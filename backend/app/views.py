from django.shortcuts import render
from django.http import HttpResponse


def inicio_sesion(request):
    return render(request, 'inicio_sesion.html')
def inicio(request):
    return render(request, 'inicio.html')
def administrador(request):
    return render(request, 'administrador.html')