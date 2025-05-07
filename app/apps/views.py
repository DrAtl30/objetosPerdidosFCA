from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse, HttpResponseRedirect
from rest_framework import status
from .serializers import registroUser, LoginUser
from django.shortcuts import render
from datetime import datetime
from email_service.api.services.email_services import enviar_correo_confirmacion
import json
import logging

# Create your views here.
logger = logging.getLogger(__name__)


def home(request):
    user_name = ''
    if request.user.is_authenticated:
        user_name = request.user.nombre  # o request.user.first_name, si usas el modelo User por defecto
    return render(request, "inicio.html", {'user_name': user_name})


def login(request):
    return render(request, "inicio_sesion.html")


def user_registro(request):
    timestamp = datetime.now().timestamp()
    return render(request, "users/registro.html", {"timestamp": timestamp})


def object_registro(request):
    timestamp = datetime.now().timestamp()
    return render(request, "registroObjeto.html", {"timestamp": timestamp})


def home_admin(request):
    return render(request, "administrador/administrador.html")


class RegistroAlumnoView(APIView):
    def post(self, request, *args, **kwargs):
        logger.info(f"Datos recibidos: {request.data}")

        alumno = registroUser(data=request.data)
        if alumno.is_valid():
            email_alumno= alumno.save()
            enviar_correo_confirmacion(email_alumno)
            return Response(
                {"mensaje": "Registro exitoso"}, status=status.HTTP_201_CREATED
            )
        logger.error(f"Errores del serializer: {alumno.errors}")
        return Response(alumno.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginAlumnoView(APIView):
    def post(self,request):
        alumno = LoginUser(data=request.data)
        if alumno.is_valid():
            data = alumno.validated_data
            print("Datos válidos:", data)
            request.session["usuario_id"] = data["id_usuario"]
            return Response({
                'mensaje': 'Inicio de sesión exitoso.',
                'id_usuario': data['id_usuario'],
                'nombre': data['nombre'],
                'correo_institucional': data['correo_institucional'],
            }, status=status.HTTP_200_OK)

        return Response(alumno.errors, status=status.HTTP_400_BAD_REQUEST)
