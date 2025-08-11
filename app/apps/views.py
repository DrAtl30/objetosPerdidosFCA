from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.http import JsonResponse,  QueryDict
from rest_framework import status, generics, permissions
from .serializers import RegistroUser, LoginUser, RegistroObjeto, ComentarioSerializer
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth import login, logout
from django.core.signing import TimestampSigner, BadSignature, SignatureExpired
from django.utils import timezone
from django.db.models import Q
from datetime import datetime, timedelta
from email_service.api.services.email_services import enviar_correo_confirmacion
import logging, json, os
from .models import Usuario, Objetoperdido,Imagenobjeto, Comentario


# Create your views here.
logger = logging.getLogger(__name__)
def prueba(request):
    return render(request, 'base.html')

def home(request):
    user_name = ''
    user_lastname = ''
    if request.user.is_authenticated:
        user_name = request.user.nombre
        user_lastname = request.user.apellidos

    return render(request, "inicio.html", {'user_name': user_name, 'user_lastname': user_lastname})


def inicio_session(request):
    return render(request, "users/inicio_sesion.html")


def user_registro(request):
    timestamp = datetime.now().timestamp()
    return render(request, "users/registro.html", {"timestamp": timestamp})


def object_registro(request,id_objeto=None):
    if not request.user.is_authenticated or request.user.rol != 'administrador':
        return redirect('/')
    contexto = {}
    if id_objeto is not None:
        objeto = get_object_or_404(Objetoperdido, pk=id_objeto)
        imagenes = objeto.imagenes.all()
        contexto["objeto"] = objeto
        contexto['imagenes'] = imagenes
    return render(request, "administrador/registroObjeto.html", contexto)


def home_admin(request):
    if not request.user.is_authenticated or request.user.rol != 'administrador':
        return redirect('/')
    admin_name = ""
    admin_lastname = ""
    if request.user.is_authenticated:
        admin_name = request.user.nombre
        admin_lastname = request.user.apellidos

    return render(request, "administrador/administrador.html", {'admin_name': admin_name, 'admin_lastname': admin_lastname})


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
        max_age = 60
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
        return render(request, 'users/confirmacionCuenta.html', {'mensaje': mensaje, 'exito': exito,'uid': uid})

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
        
        return render(request, 'users/confirmacionCuenta.html', {'mensaje': mensaje, 'exito': exito, 'uid':None})


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
                Q(descripcion__icontains = busqueda) |
                Q(lugar_perdida__icontains = busqueda)
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
        instance.nombre = request.data.get('nombre', instance.nombre)
        instance.descripcion_general = request.data.get('descripcion_general', instance.descripcion_general)
        instance.descripcion_especifica = request.data.get('descripcion_especifica', instance.descripcion_especifica)
        instance.fecha_perdida = request.data.get('fecha_perdida', instance.fecha_perdida)
        instance.hora_perdida = request.data.get('hora_perdida', instance.hora_perdida)
        instance.lugar_perdida = request.data.get('lugar_perdida', instance.lugar_perdida)
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

        # Eliminar las imágenes del sistema de archivos
        for imagen in objeto.imagenes.all():
            if imagen.ruta_imagen and os.path.exists(imagen.ruta_imagen.path):
                os.remove(imagen.ruta_imagen.path)
            imagen.delete()

        objeto.delete()
        return Response({"message": "Objeto e imágenes eliminados correctamente"}, status=status.HTTP_200_OK)
    
    def retrieve(self, request, *args, **kwargs):
        objeto = self.get_object()
        
        if request.user.is_authenticated and request.user.rol == 'administrador':
            data = {
                'id': objeto.id_objeto,
                'nombre': objeto.nombre,
                'descripcion_general': objeto.descripcion_general,
                'descripcion_especifica': objeto.descripcion_especifica,
                'hora_perdida': objeto.hora_perdida.strftime('%H:%M') if objeto.hora_perdida else '',
                'fecha_perdida': objeto.fecha_perdida.strftime('%Y-%m-%d') if objeto.fecha_perdida else '',
                'lugar_perdida': objeto.lugar_perdida,
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
                'lugar_perdida': objeto.lugar_perdida,
                'imagenes': [{'ruta_imagen': img.ruta_imagen.url} for img in objeto.imagenes.all()],
            }
        return Response(data)

def toggle_ocultar_objeto(request):
    if not request.user.is_authenticated or not request.user.is_staff:
        return JsonResponse({'error':'No autorizado'}, status=403)

    if request.method == 'POST':
        data = json.loads(request.body)
        objeto_id = data.get("id")
        
        if not objeto_id:
            return JsonResponse({"error": "ID no proporcionado"}, status=400)

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


class ComentarioView(generics.ListCreateAPIView):
    serializer_class = ComentarioSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            # Permitir a cualquiera ver comentarios
            return [permissions.AllowAny()]
        # Para POST, sí requiere autenticación
        return [permissions.IsAuthenticated()]
    
    def get_queryset(self):
        objeto_id = self.kwargs.get("objeto_id")
        
        return Comentario.objects.filter(id_objeto=objeto_id).order_by("-fecha_comentario")
    
    def perform_create(self, serializer):
        objeto_id = self.kwargs.get("objeto_id")
        serializer.save(
            id_usuario = self.request.user,
            id_objeto_id=objeto_id,
            fecha_comentario = timezone.now()
        )
        return super().perform_create(serializer)
    
class ComentarioAllView(generics.ListAPIView):
    serializer_class = ComentarioSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Comentario.objects.all().order_by("-fecha_comentario")
    