from django.shortcuts import render

# Create your views here.

def index(request):
    return render(request, "backend_app/index.html", {})

def administrador(request):
    return render(request, "backend_app/administrador.html", {})

def inicio(request):
    return render(request, "backend_app/inicio.html", {})

def inicioSesion(request):
    return render(request, "backend_app/inicio_sesion.html", {})

def escudo(request):
    return render(request, "backend_app/index.html", {})