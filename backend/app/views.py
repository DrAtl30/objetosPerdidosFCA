from django.shortcuts import render
from django.http import HttpResponse


def inicio_sesion(request):
    return render(request, 'inicio_sesion.html')
def inicio(request):
    return render(request, 'users/inicio.html')
def administrador(request):
    return render(request, 'admin/administrador.html')
def registro_sesion(request):
    return render(request, 'users/registro_sesion.html')
def registro_objeto(request):
    return render(request, 'admin/registro_objeto.html')