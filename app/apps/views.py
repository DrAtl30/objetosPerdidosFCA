from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.http import JsonResponse,  QueryDict, HttpResponse
from rest_framework import status, generics, permissions
from .serializers import RegistroUser, LoginUser, RegistroObjeto
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth import login, logout
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.conf import settings
from django.core.signing import TimestampSigner, BadSignature, SignatureExpired
from django.template.loader import render_to_string
from django.utils import timezone
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.urls import reverse
from django.db.models import Q
from datetime import datetime, timedelta
from email_service.api.services.email_services import enviar_correo_confirmacion, enviar_correo_recuperacion, enviar_correo_nueva_pass, enviar_reporte_pdf_individual
import logging, json, os, tempfile
from weasyprint import HTML
from .models import Usuario, Objetoperdido,Imagenobjeto, Lugar_Perdida, Reclamacion, Reporteentrega, Notificacion
from .mensajes import MENSAJES_ADMIN, MENSAJES_USUARIO


# Create your views here.
logger = logging.getLogger(__name__)
def prueba(request):
    return render(request, 'administrador/reclamados.html')

def home(request):
    user_name = ''
    user_lastname = ''
    if request.user.is_authenticated:
        user_name = request.user.nombre
        user_lastname = request.user.apellidos

    return render(request, "home/home.html", {'user_name': user_name, 'user_lastname': user_lastname})


def inicio_session(request):
    if request.user.is_authenticated:
        return redirect('/')

    return render(request, "auth/inicio_sesion.html")

def reset_password(request):
    if request.user.is_authenticated:
        return redirect('/')
    return render(request, "auth/password_reset.html")

def user_registro(request):
    if request.user.is_authenticated:
        return redirect('/')
    timestamp = datetime.now().timestamp()
    return render(request, "auth/registro.html", {"timestamp": timestamp})

def home_admin(request):
    if not request.user.is_authenticated or request.user.rol != 'administrador':
        return redirect('/')
    admin_name = ""
    admin_lastname = ""
    if request.user.is_authenticated:
        admin_name = request.user.nombre
        admin_lastname = request.user.apellidos

    return render(request, "administrador/administrador.html", {'admin_name': admin_name, 'admin_lastname': admin_lastname})

def enviar_mensaje(remitente, destinatario, mensaje):
    Notificacion.objects.create(
        remitente=remitente,
        destinatario=destinatario,
        mensaje=mensaje,
        fecha_notificacion=timezone.now(),
        estado_lectura=False
    )

def object_registro(request,id_objeto=None):
    if not request.user.is_authenticated or request.user.rol != 'administrador':
        return redirect('/')
    contexto = {}
    if id_objeto is not None:
        objeto = get_object_or_404(Objetoperdido, pk=id_objeto)
        imagenes = objeto.imagenes.all()
        contexto["objeto"] = objeto
        contexto['imagenes'] = imagenes
    
    lugares = Lugar_Perdida.objects.all().order_by('nombre')
    contexto ['lugares'] = lugares
    return render(request, "administrador/registroObjeto.html", contexto)

def object_reclamados(request):
    if not request.user.is_authenticated or request.user.rol != 'administrador':
        return redirect('/')
    objetos = Objetoperdido.objects.filter(reclamaciones__isnull=False).prefetch_related('reclamaciones__usuario').distinct()
    

    mensajes_por_reclamacion = []
    for obj in objetos:
        for reclamacion in obj.reclamaciones.all():
            usuario = reclamacion.usuario.nombre
            obj_nombre = obj.nombre
            mensajes_actualizados = [m.replace("{usuario}", usuario).replace("{objeto}", obj_nombre)
                                    for m in MENSAJES_ADMIN]
            mensajes_por_reclamacion.append({
                'reclamacion_id': reclamacion.id,
                'mensajes': mensajes_actualizados
            })
    
    return render(request, 'administrador/reclamados.html', {'objetos': objetos, 'mensajes':mensajes_por_reclamacion})

def reclamar_objeto(request, id_objeto):
    if request.method == 'POST':
        objeto = get_object_or_404(Objetoperdido, pk=id_objeto)
        if objeto.estado_objeto == 'entregado':
            return JsonResponse({'success':False, 'mensaje':'Este objeto ya ha sido entregado y no se puede reclamar'})
            
        reclamacion_existe = Reclamacion.objects.filter(objeto=objeto, usuario=request.user).exists()
        if reclamacion_existe:
            return JsonResponse({'success':False, 'mensaje':'Ya has reclamado este objeto'})
        
        Reclamacion.objects.create(objeto=objeto,usuario=request.user)
        
        objeto.estado_objeto = 'reclamado'
        objeto.save(update_fields=['estado_objeto'])
        
        mensajes = MENSAJES_USUARIO[0]
        administradores = Usuario.objects.filter(rol='administrador')
        for admin in administradores:
            mensaje = mensajes.format(usuario=request.user.nombre, objeto=objeto.nombre)
            enviar_mensaje(request.user,admin, mensaje)
        
        return JsonResponse({'success':True, 'mensaje': 'Objeto reclamado exitosamente'})
    
    return JsonResponse({'success':False, 'mensaje': 'Metodo no permitido'}, status=405)


def obtener_notificaciones(request):
    if not request.user.is_authenticated:
        return JsonResponse({'notificaciones': []})
    usuario = request.user
    tiempo_limite = timezone.now() - timedelta(hours=24)
    
    Notificacion.objects.filter(destinatario = usuario, fecha_notificacion__lt=tiempo_limite).delete()
    
    notificaciones = Notificacion.objects.filter(destinatario=usuario).order_by('-fecha_notificacion')
    
    data = [
        {
            "id": n.id_notificacion,
            "mensaje": n.mensaje,
            "fecha": n.fecha_notificacion.strftime('%Y-%m-%d %H:%M:%S'),
            "leida": n.estado_lectura,
            "remitente": n.remitente.nombre if n.remitente else "Sistema",
            "remitente_id": n.remitente.id_usuario if n.remitente else None
        }
        for n in notificaciones
    ]
    
    return JsonResponse({"notificaciones": data})

def marcar_notificaciones_leidas(request):
    usuario = request.user
    # Marcar todas como leídas
    Notificacion.objects.filter(destinatario=usuario, estado_lectura=False).update(estado_lectura=True)
    return JsonResponse({"success": True})

def enviar_notificacion_admin(request):
    reclamacion_id = request.POST.get("reclamacion_id")
    mensaje = request.POST.get("mensaje")

    if not reclamacion_id or not mensaje:
        return JsonResponse({"success": False, "mensaje": "Datos incompletos"}, status=400)

    try:
        reclamacion = Reclamacion.objects.select_related("usuario").get(pk=reclamacion_id)
    except Reclamacion.DoesNotExist:
        return JsonResponse({"success": False, "mensaje": "Reclamación no encontrada"}, status=404)

    # remitente es el admin actual
    remitente = request.user
    destinatario = reclamacion.usuario

    enviar_mensaje(remitente, destinatario, mensaje)

    return JsonResponse({"success": True, "mensaje": "Notificación enviada"})
    

def isAuth(request):
    return JsonResponse({'auth': request.user.is_authenticated,'id_usuario_auth':request.user.id_usuario if request.user.is_authenticated else None})


class RegistroAlumnoView(APIView):
    def post(self, request, *args, **kwargs):
        alumno = RegistroUser(data=request.data)
        if alumno.is_valid():
            email_alumno,password= alumno.save()
            enviar_correo_confirmacion(email_alumno,password)
            return Response(
                {"mensaje": "Registro exitoso. Por favor revisa tu correo para confirmar tu cuenta antes de iniciar sesión."}, status=status.HTTP_201_CREATED
            )
        logger.error(f"Errores del serializer: {alumno.errors}")
        return Response(alumno.errors, status=status.HTTP_400_BAD_REQUEST)

class ConfirmarCuentaView(APIView):
    def get(self, request, suid):
        exito = True
        signer = TimestampSigner()
        max_age = 30 * 60
        uid = None
        try:
            uid = signer.unsign(suid, max_age)
            alumno = get_object_or_404(Usuario, id_usuario=uid)
            if alumno.is_active:
                mensaje = 'La cuenta ya ha sido confirmada'
                exito = True
            else:
                alumno.is_active =  True
                alumno.save()
                mensaje = "Cuenta confirmada"
            
        except SignatureExpired:
            try:
                uid = signer.unsign(suid)
            except:
                uid = None
            mensaje = 'El enlace ha expirado'
            exito = False
        except BadSignature:
            mensaje = 'El enlace es inválido'
            exito = False
        return render(request, 'auth/confirmacionCuenta.html', {'mensaje': mensaje, 'exito': exito,'uid': uid})

class ReenviarCorreoConfirmacion(APIView):
    def post(self, request):
        uid =  request.POST.get("uid")
        alumno = get_object_or_404(Usuario, id_usuario=uid)
        
        if alumno.is_active:
            mensaje = 'La cuenta ya esta confirmada'
            exito = True
        else:
            enviar_correo_confirmacion(alumno)
            mensaje = 'Se ha enviado un nuevo enlace a tu correo'
            exito = False
        
        return render(request, 'auth/confirmacionCuenta.html', {'mensaje': mensaje, 'exito': exito, 'uid':None})


def verificar_correo_confirmado(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('correo_institucional')
        try:
            user = Usuario.objects.get(correo_institucional = email)
            return JsonResponse({'existe':True,'confirmado': user.is_active})
        except Usuario.DoesNotExist:
            return JsonResponse({'existe':False,"confirmado": False})

    return JsonResponse({"error": 'Metodo no permitido'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


class LoginAlumnoView(APIView):
    def post(self,request):
        alumno = LoginUser(data=request.data)
        if alumno.is_valid():
            data = alumno.validated_data
            try:
                usuario = Usuario.objects.get(id_usuario=data["id_usuario"])
                login(request, usuario)
            except Usuario.DoesNotExist:
                return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

            return Response({
                'mensaje': 'Inicio de sesión exitoso.',
                'id_usuario': data['id_usuario'],
                'nombre': data['nombre'],
                'correo_institucional': data['correo_institucional'],
                'rol' : usuario.rol
            }, status=status.HTTP_200_OK)

        return Response(alumno.errors, status=status.HTTP_400_BAD_REQUEST)

class LogOutAlumnoView(APIView):
    def post(self, request):
        if request.user.is_authenticated:
            logout(request)
            return Response({"mensaje": "Sesión cerrada correctamente."}, status=status.HTTP_200_OK)
        else:
            return Response({"mensaje": "No hay sesión activa."}, status=status.HTTP_400_BAD_REQUEST)
        
class PasswordResetView(APIView):
    def post(self, request):
        email = request.data.get('correo_institucional')
        if not email:
            return Response({'error': 'Debe proporcionar un correo electronico'}, status = status.HTTP_200_OK)
        
        try:
            usuario = Usuario.objects.get(correo_institucional=email)
        except Usuario.DoesNotExist:
            return Response({'mensaje': 'Si el correo esta registrado, recibiras un enlace para cambiar la contraseña'}, status = status.HTTP_200_OK)
        
        signer = TimestampSigner()
        
        uid_signed = signer.sign(str(usuario.id_usuario))
        
        reset_url = request.build_absolute_uri(reverse('reset_pass_check', kwargs={'uidb64':uid_signed}))
        
        enviar_correo_recuperacion(email, reset_url)
        
        return Response({'mensaje': 'Si el correo está registrado, recibirás un enlace para cambiar la contraseña.', "url":reset_url}, status=status.HTTP_200_OK)
    
class PasswordResetConfirmView(APIView):
    def get(self, request,uidb64):
        max_age = 60 * 60  #minutos * segundos
        signer = TimestampSigner()
        context = {}
        context['uidb64'] = uidb64
        try:
            uid = signer.unsign(uidb64, max_age) #30 minutos
            
            context['mensaje'] = "Ingrese la nueva contraseña"
            context['exito'] = True
            
            
            return render(request, 'auth/password_reset_confirm.html', context)
            
        except SignatureExpired:
            context['mensaje'] = 'El enlace ha expirado'
            context['exito'] = False
        except BadSignature:
            context['mensaje'] = 'El enlace es invalido'
            context['exito'] = False

            
        return render(request, 'auth/password_reset_confirm.html', context)
        
    def post(self, request, uidb64):
        nueva_password = request.data.get("password")
        if not nueva_password:
            return Response({"error": "La contraseña es obligatoria"},status=status.HTTP_400_BAD_REQUEST)
        
        signer = TimestampSigner()
        max_age = 60 * 60  #minutos * segundos
        
        try:
            # Decodificar el uid
            uid = signer.unsign(uidb64,max_age)
            usuario = get_object_or_404(Usuario, id_usuario=uid)
            
            # Cambiar contraseña
            usuario.set_password(nueva_password)
            usuario.save()
            
            enviar_correo_nueva_pass(usuario, nueva_password)
            
            return Response({"mensaje": "Contraseña actualizada con éxito, se te envio por correo"}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class ReenviarCorreoResetPasswordView(APIView):
    def post(self, request):
        uid_signed = request.data.get("uid")  # UID firmado enviado desde el frontend
        if not uid_signed:
            return Response({"error": "No se proporcionó UID"}, status=status.HTTP_400_BAD_REQUEST)
        
        signer = TimestampSigner()
        try:
            # Verificamos que el UID sea válido, sin importar la expiración
            uid = signer.unsign(uid_signed)
            usuario = get_object_or_404(Usuario, id_usuario=uid)
            
            # Generar nuevo enlace con un UID fresco
            nuevo_uid_signed = signer.sign(str(usuario.id_usuario))
            reset_url = request.build_absolute_uri(
                reverse('reset_pass_check', kwargs={'uidb64': nuevo_uid_signed})
            )
            
            enviar_correo_recuperacion(usuario.correo_institucional, reset_url)
            
            return Response({"mensaje": "Se ha enviado un nuevo enlace para restablecer la contraseña"}, status=status.HTTP_200_OK)
        
        except BadSignature:
            return Response({"error": "UID inválido"}, status=status.HTTP_400_BAD_REQUEST)




# CRUD
class ObjetoPerdidoViewSet(ModelViewSet):
    queryset = Objetoperdido.objects.all()
    serializer_class = RegistroObjeto
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        user = self.request.user
        ocultos_path = os.path.join(os.path.dirname(__file__), "../media/ocultos.json")
        try:
            with open(ocultos_path, 'r') as f:
                ocultos = json.load(f).get('ocultos', [])
        except FileNotFoundError:
            ocultos = []
        
        ocultos = [int(o) for o in ocultos]
        
        if user.is_authenticated and user.rol == 'administrador':
            queryset = Objetoperdido.objects.all()
        else:
            queryset = Objetoperdido.objects.exclude(id_objeto__in=ocultos)

        now = timezone.now()
        fecha_param = self.request.query_params.get("fecha")
        filtros_fecha = {
            'last-hour': lambda qs: qs.filter(fecha_carga__gte=now-timedelta(hours=1)),
            'hoy': lambda qs: qs.filter(fecha_carga__date=now.date()),
            'this-week': lambda qs: qs.filter(fecha_carga__gte=(now-timedelta(days=now.weekday())).date()),
            'this-month': lambda qs: qs.filter(fecha_carga__year=now.year, fecha_carga__month=now.month),
            'this-year': lambda qs: qs.filter(fecha_carga__year=now.year),
        }
        
        if fecha_param in filtros_fecha:
            queryset = filtros_fecha[fecha_param](queryset)
        
        estado_param = self.request.query_params.get("estado")
        estado = {
            'reclamado': 'reclamado',
            'publicado': 'publicado',
            'entregado': 'entregado',
            'no-reclamado': 'no reclamado'
        }
        
        if estado_param in estado:
            estado_valor = estado_param.replace('-',' ')
            queryset = queryset.filter(estado_objeto__iexact=estado_valor)
        
        orden_param = self.request.query_params.get("orden")
        orden_map = {
            "recientes": "-fecha_carga",
            "antiguos": "fecha_carga",
            "a-z": "nombre",
            "z-a": "-nombre",
        }
        if orden_param in orden_map:
            queryset = queryset.order_by(orden_map[orden_param])
        else:
            queryset = queryset.order_by("-fecha_carga")
            
        busqueda = self.request.query_params.get("search")
        if busqueda:
            queryset = queryset.filter(
                Q(nombre__icontains = busqueda) |
                Q(descripcion_general__icontains = busqueda) |
                Q(descripcion_especifica__icontains = busqueda) |
                Q(id_lugar__nombre__icontains = busqueda)
            )

        return queryset 
    
    def create(self, request, *args, **kwargs):
        if request.user.rol != 'administrador':
            return Response({'error': 'No tienes permiso para realizar esta acción'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(data=request.data, context={'request':request})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        return Response({'mensaje': 'Objeto registrado correctamente'}, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        if request.user.rol != 'administrador':
            return Response({'error': 'No tienes permiso para realizar esta acción'}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)
    
    def partial_update(self, request, *args, **kwargs):
        if request.user.rol != 'administrador':
            return Response({'error': 'No tienes permiso para realizar esta acción'}, status=status.HTTP_403_FORBIDDEN)
        
        instance = self.get_object()
        if instance.estado_objeto == 'reclamado' or instance.reclamaciones.exists():
            return Response({'error': 'No se puede editar un objeto que ya ha sido reclamado'}, status=status.HTTP_400_BAD_REQUEST)
        instance.nombre = request.data.get('nombre', instance.nombre)
        instance.descripcion_general = request.data.get('descripcion_general', instance.descripcion_general)
        instance.descripcion_especifica = request.data.get('descripcion_especifica', instance.descripcion_especifica)
        instance.fecha_perdida = request.data.get('fecha_perdida', instance.fecha_perdida)
        instance.hora_perdida = request.data.get('hora_perdida', instance.hora_perdida)
        instance.id_lugar = request.data.get('id_lugar', instance.id_lugar)
        instance.estado_objeto = request.data.get('estado_objeto', instance.estado_objeto)
        instance.encontrado_por = request.data.get('encontrado_por', instance.encontrado_por)
        instance.save()
        
        if isinstance(request.data, QueryDict) and 'imagenes_existentes' in request.data:
            urls_enviadas = request.data.getlist('imagenes_existentes')
            rutas_actuales = [img.ruta_imagen.url for img in instance.imagenes.all()]
        
            for img in instance.imagenes.all():
                if img.ruta_imagen.url not in urls_enviadas:
                    if img.ruta_imagen and os.path.isfile(img.ruta_imagen.path):
                        os.remove(img.ruta_imagen.path)
                    img.delete()
            
            for archivo in request.FILES.getlist('imagenes_upload'):
                Imagenobjeto.objects.create(id_objeto=instance, ruta_imagen=archivo)

        return Response({"message": "Objeto actualizado correctamente"}, status=status.HTTP_200_OK)
    
    def destroy(self, request, pk=None):
        if request.user.rol != 'administrador':
            return Response({'error': 'No tienes permiso para realizar esta acción'}, status=status.HTTP_403_FORBIDDEN)
        
        objeto = get_object_or_404(Objetoperdido, pk=pk)
        
        if objeto.estado_objeto == 'reclamado' or objeto.reclamaciones.exists():
            return Response({'error': 'No se puede eliminar un objeto que ha sido reclamado'},status=status.HTTP_400_BAD_REQUEST)

        # Eliminar las imágenes del sistema de archivos
        for imagen in objeto.imagenes.all():
            if imagen.ruta_imagen and os.path.exists(imagen.ruta_imagen.path):
                os.remove(imagen.ruta_imagen.path)
            imagen.delete()

        objeto.delete()
        return Response({"message": "Objeto e imágenes eliminados correctamente"}, status=status.HTTP_200_OK)
    
    def retrieve(self, request, *args, **kwargs):
        objeto = self.get_object()
        
        usuario = request.user if request.user.is_authenticated else None
        is_claimed = False
        
        if usuario:
            is_claimed = objeto.reclamaciones.filter(usuario=usuario).exists()
        
        if request.user.is_authenticated and request.user.rol == 'administrador':
            data = {
                'id': objeto.id_objeto,
                'nombre': objeto.nombre,
                'descripcion_general': objeto.descripcion_general,
                'descripcion_especifica': objeto.descripcion_especifica,
                'hora_perdida': objeto.hora_perdida.strftime('%H:%M') if objeto.hora_perdida else '',
                'fecha_perdida': objeto.fecha_perdida.strftime('%Y-%m-%d') if objeto.fecha_perdida else '',
                'id_lugar': objeto.id_lugar.nombre,
                'estado_objeto': objeto.estado_objeto,
                'encontrado_por': objeto.encontrado_por,
                'imagenes': [{'ruta_imagen': img.ruta_imagen.url} for img in objeto.imagenes.all()],
            }
        else:
            data = {
                'id': objeto.id_objeto,
                'nombre': objeto.nombre,
                'descripcion_general': objeto.descripcion_general,
                'fecha_perdida': objeto.fecha_perdida.strftime('%Y-%m-%d') if objeto.fecha_perdida else '',
                'ya_reclamo': is_claimed,
                'imagenes': [{'ruta_imagen': img.ruta_imagen.url} for img in objeto.imagenes.all()],
            }
        return Response(data)
    
class ReclamacionDetail(APIView):
    def post(self, request, pk):
        reclamacion =  get_object_or_404(Reclamacion, pk=pk)
        objeto = reclamacion.objeto
        usuario = reclamacion.usuario
        
        if objeto.estado_objeto == 'entregado':
            return Response({'error': 'El objeto ya ha sido entregado'}, status=status.HTTP_400_BAD_REQUEST)
        
        objeto.estado_objeto = 'entregado'
        objeto.fecha_entrega = timezone.now()
        objeto.save(update_fields=['estado_objeto','fecha_entrega'])
        
        entrega = Reporteentrega.objects.create(id_objeto = objeto,id_usuario_reclamante=usuario,fecha_hora_entrega=timezone.now() )
        
        pdf_path = generar_pdf_entrega(entrega, request)
        enviar_reporte_pdf_individual(usuario, objeto, [pdf_path])
        
        mensaje_aceptado = MENSAJES_ADMIN[2].format(usuario=usuario.nombre, objeto=objeto.nombre)
        enviar_mensaje(remitente=request.user, destinatario=usuario, mensaje=mensaje_aceptado)
        
        otrasReclamaciones = Reclamacion.objects.filter(objeto=objeto).exclude(usuario=usuario)
        for r in otrasReclamaciones:
            mensaje_no_aceptado = MENSAJES_ADMIN[1].format(usuario=r.usuario.nombre, objeto=objeto.nombre)
            enviar_mensaje(remitente=request.user, destinatario=r.usuario, mensaje=mensaje_no_aceptado)
         
        
        reclamaciones_eliminadas = list(Reclamacion.objects.filter(objeto=objeto).values_list('id', flat=True))
        reclamaciones_eliminadas.append(reclamacion.id)

        # Borra todas
        Reclamacion.objects.filter(objeto=objeto).delete()
        
        
        
        return Response({"message": "Reclamación aceptada y pdf creado, mensajes enviados","reclamaciones_eliminadas": reclamaciones_eliminadas}, status=status.HTTP_200_OK)
        
        
    def delete(self, request, pk):
        reclamacion = get_object_or_404(Reclamacion, pk=pk)
        objeto = reclamacion.objeto
        usuario = reclamacion.usuario
                
        mensajes = MENSAJES_ADMIN[1]
        mensaje = mensajes.format(usuario=usuario.nombre, objeto=objeto.nombre)
        enviar_mensaje(remitente=request.user, destinatario=usuario, mensaje=mensaje)
        reclamacion.delete()
        
        if not objeto.reclamaciones.exists():
            objeto.estado_objeto = 'publicado'
            objeto.save(update_fields=['estado_objeto'])
        return Response({"message": "Reclamación eliminada correctamente"}, status=status.HTTP_200_OK)
    
def generar_pdf_entrega(entrega, request, filename=None):
    html_string = render_to_string('report/objeto_entregado.html', {'entrega': entrega})
    
    if not filename:
        filename = f'reporte_entrega_{entrega.id_reporte}.pdf'
    
    folder = os.path.join(settings.MEDIA_ROOT, 'reportes')
    os.makedirs(folder, exist_ok=True)
    pdf_path = os.path.join(folder, filename)
    
    with open(pdf_path, 'wb') as f:
        HTML(string=html_string, base_url=request.build_absolute_uri()).write_pdf(target=f)
    
    # Guardar la ruta relativa en el modelo
    entrega.pdf_path = os.path.join('reportes', filename)
    entrega.save(update_fields=['pdf_path'])
    
    return pdf_path 
    

def toggle_ocultar_objeto(request):
    if not request.user.is_authenticated or not request.user.is_staff:
        return JsonResponse({'error':'No autorizado'}, status=403)

    if request.method == 'POST':
        data = json.loads(request.body)
        objeto_id = data.get("id")
        
        
        if not objeto_id:
            return JsonResponse({"error": "ID no proporcionado"}, status=400)
        
        objeto = get_object_or_404(Objetoperdido, pk=objeto_id)

        if objeto.estado_objeto == 'reclamado' or objeto.reclamaciones.exists():
            return JsonResponse({'error': 'No se puede ocultar un objeto que ha sido reclamado'}, status=400)

        ocultos_path = os.path.join(os.path.dirname(__file__), "../media/ocultos.json")

        try:
            with open(ocultos_path, 'r') as f:
                ocultos = json.load(f).get('ocultos',[])
        except FileNotFoundError:
            ocultos = []

        if objeto_id in ocultos:
            ocultos.remove(objeto_id)
            estado = 'mostrado'
        else:
            ocultos.append(objeto_id)
            estado = 'ocultado'

        with open(ocultos_path, 'w') as f:
            json.dump({'ocultos': ocultos}, f, indent=2, ensure_ascii=False)

        return JsonResponse({'status': 'ok', 'estado': estado})

    return JsonResponse({'error': 'Metodo no permitido'}, status=405)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def obtener_ocultos(request):
    if request.user.rol != 'administrador':
        return Response({"ocultos": []})

    ocultos_path = os.path.join(os.path.dirname(__file__), "../media/ocultos.json")
    try:
        with open(ocultos_path, 'r') as f:
            ocultos = json.load(f).get('ocultos', [])
    except FileNotFoundError:
        ocultos = []

    return Response({"ocultos": ocultos})


# class ComentarioView(generics.ListCreateAPIView):
#     serializer_class = ComentarioSerializer

#     def get_permissions(self):
#         if self.request.method == 'GET':
#             # Permitir a cualquiera ver comentarios
#             return [permissions.AllowAny()]
#         # Para POST, sí requiere autenticación
#         return [permissions.IsAuthenticated()]
    
#     def get_queryset(self):
#         objeto_id = self.kwargs.get("objeto_id")
        
#         return Comentario.objects.filter(id_objeto=objeto_id).order_by("-fecha_comentario")
    
#     def perform_create(self, serializer):
#         objeto_id = self.kwargs.get("objeto_id")
#         serializer.save(
#             id_usuario = self.request.user,
#             id_objeto_id=objeto_id,
#             fecha_comentario = timezone.now()
#         )
#         return super().perform_create(serializer)
    
# class ComentarioAllView(generics.ListAPIView):
#     serializer_class = ComentarioSerializer
#     permission_classes = [permissions.IsAuthenticated]
    
#     def get_queryset(self):
#         return Comentario.objects.all().order_by("-fecha_comentario")
    