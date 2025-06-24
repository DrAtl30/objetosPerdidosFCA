"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.urls import path
from app.views import *  # Importar las vistasde la aplicación

urlpatterns = [
    
    path('inicio-sesion', inicio_sesion, name='inicio_sesion'),
    path('inicio', inicio, name='inicio'),
    path('administrador', administrador, name='administrador'),
    path('registro-sesion', registro_sesion, name='registro_sesion'),
    path('registro-objeto', registro_objeto, name='registro_objeto'),
]