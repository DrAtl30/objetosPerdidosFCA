from django.urls import path, include
from rest_framework.routers import DefaultRouter
# from rest_framework.authtoken.views import obtain_auth_token #es para pruebas
from apps.views import (isAuth,RegistroAlumnoView,LoginAlumnoView,LogOutAlumnoView,ConfirmarCuentaView,verificar_correo_confirmado, ReenviarCorreoConfirmacion, ObjetoPerdidoViewSet, toggle_ocultar_objeto, obtener_ocultos, ComentarioView, ComentarioAllView)

router = DefaultRouter()
router.register(r'objetos', ObjetoPerdidoViewSet, basename='objetos')

urlpatterns = [
    path("isAuth/",isAuth,name="isAuth"),
    path("registro/", RegistroAlumnoView.as_view(), name="registro"),
    path("login/", LoginAlumnoView.as_view(), name="login"),
    # path("token/", obtain_auth_token, name="api_token_auth"), #es para pruebas
    path("logout/", LogOutAlumnoView.as_view(), name="logout"),
    path("confirmar-cuenta/<suid>",ConfirmarCuentaView.as_view(),name="confirma-cuenta"),
    path("reenviar_confirmacion",ReenviarCorreoConfirmacion.as_view(),name="reenviar_confirmacion"),
    path("verificarCorreoConfirmado/",verificar_correo_confirmado,name="verificarCorreoConfirmado"),
    path("toggle_ocultar/",toggle_ocultar_objeto,name="toggle_ocultar_objeto"),
    path("obtener_ocultos/",obtener_ocultos,name="obtener_ocultos"),
    
    path("comentario/<int:objeto_id>/", ComentarioView.as_view(),name="comentario_by_objeto"),
    path("comentario/", ComentarioAllView.as_view(),name="comentario"),
    
    path("", include(router.urls)),
]
