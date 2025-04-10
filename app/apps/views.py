from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse, HttpResponseRedirect
from rest_framework import status
from .serializers import registroUser
from django.shortcuts import render
from datetime import datetime
import json
import logging

# Create your views here.
logger = logging.getLogger(__name__)


def home(request):
    return render(request, "inicio.html")


def login(request):
    return render(request, "inicio_sesion.html")


def user_registro(request):
    timestamp = datetime.now().timestamp()
    return render(request, "users/registro.html", {"timestamp": timestamp})


def home_admin(request):
    return render(request, "administrador/administrador.html")


class RegistroView(APIView):
    def post(self, request, *args, **kwargs):
        logger.info(f"Datos recibidos: {request.data}")

        serializer = registroUser(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"mensaje": "Registro exitoso"}, status=status.HTTP_201_CREATED
            )
        logger.error(f"Errores del serializer: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
