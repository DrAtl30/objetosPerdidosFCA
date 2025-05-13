from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.http import urlsafe_base64_decode
from django.http import JsonResponse
from rest_framework import status
from .serializers import registroUser, LoginUser
from django.shortcuts import render, get_object_or_404
from django.contrib.auth import login
from django.contrib.auth.tokens import default_token_generator
from datetime import datetime
from email_service.api.services.email_services import enviar_correo_confirmacion
import logging, json
from .models import Usuario

# Create your views here.
logger = logging.getLogger(__name__)


def home(request):
    user_name = ''
    user_lastname = ''
    if request.user.is_authenticated:
        user_name = request.user.nombre
        user_lastname = request.user.apellidos
    return render(request, "inicio.html", {'user_name': user_name, 'user_lastname': user_lastname})


def inicio_session(request):
    return render(request, "inicio_sesion.html")


def user_registro(request):
    timestamp = datetime.now().timestamp()
    return render(request, "users/registro.html", {"timestamp": timestamp})


def object_registro(request):
    timestamp = datetime.now().timestamp()
    return render(request, "registroObjeto.html", {"timestamp": timestamp})


def home_admin(request):
    admin_name = ""
    admin_lastname = ""
    if request.user.is_authenticated:
        admin_name = request.user.nombre
        admin_lastname = request.user.apellidos
    return render(request, "administrador/administrador.html", {'admin_name': admin_name, 'admin_lastname': admin_lastname})


class RegistroAlumnoView(APIView):
    def post(self, request, *args, **kwargs):
        logger.info(f"Datos recibidos: {request.data}")

        alumno = registroUser(data=request.data)
        if alumno.is_valid():
            email_alumno= alumno.save()
            enviar_correo_confirmacion(email_alumno)
            return Response(
                {"mensaje": "Registro exitoso. Por favor revisa tu correo para confirmar tu cuenta antes de iniciar sesión."}, status=status.HTTP_201_CREATED
            )
        logger.error(f"Errores del serializer: {alumno.errors}")
        return Response(alumno.errors, status=status.HTTP_400_BAD_REQUEST)

class ConfirmarCuentaView(APIView):
    def get(self, request, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            alumno = get_object_or_404(Usuario, id_usuario=uid)
            if default_token_generator.check_token(alumno, token):
                alumno.is_active = True
                alumno.save()
                mensaje = 'Cuenta confirmada correctamente'
                exito = True
            else:
                mensaje = 'Enlace inválido o expirado'
                exito = False
        except:
            mensaje = 'Enlace inválido'
            exito = False
        return render(request, 'users/confirmacionCuenta.html', {'mensaje': mensaje, 'exito': exito})


def verificar_correo_confirmado(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('correo_institucional')
        try:
            user = Usuario.objects.get(correo_institucional = email)
            return JsonResponse({'confirmado': user.is_active})
        except Usuario.DoesNotExist:
            return JsonResponse({"confirmado": False})

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
            }, status=status.HTTP_200_OK)

        return Response(alumno.errors, status=status.HTTP_400_BAD_REQUEST)
