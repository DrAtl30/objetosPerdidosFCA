from django.urls import path
from . import views
urlpatterns = [
    path("index/", views.index, name="index"),
    path("admin/", views.administrador, name="admin"),
    path("inicio/", views.inicio, name="inicio"),
    path("inicioSesion/", views.inicioSesion, name="inicioSesion"),
]
