from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from apps.views import (RegistroAlumnoView,LoginAlumnoView,LogOutAlumnoView,ConfirmarCuentaView,verificar_correo_confirmado, ReenviarCorreoConfirmacion, ObjetoPerdidoViewSet, toggle_ocultar_objeto, obtener_ocultos)

router = DefaultRouter()
router.register(r'objetos', ObjetoPerdidoViewSet, basename='objetos')

urlpatterns = [
    path("registro/", RegistroAlumnoView.as_view(), name="registro"),
    path("login/", LoginAlumnoView.as_view(), name="login"),
    path("token/", obtain_auth_token, name="api_token_auth"),
    path("logout/", LogOutAlumnoView.as_view(), name="logout"),
    path("confirmar-cuenta/<suid>",ConfirmarCuentaView.as_view(),name="confirma-cuenta"),
    path("reenviar_confirmacion",ReenviarCorreoConfirmacion.as_view(),name="reenviar_confirmacion"),
    path("verificarCorreoConfirmado/",verificar_correo_confirmado,name="verificarCorreoConfirmado"),
    # path("registro-objeto/", RegistroObjetoView.as_view(), name="registro_objeto"),
    # path("editar-objeto/<int:id_objeto>", RegistroObjetoView.as_view(), name="editar_objeto"),
    path("toggle_ocultar/",toggle_ocultar_objeto,name="toggle_ocultar_objeto"),
    path("obtener_ocultos/",obtener_ocultos,name="obtener_ocultos"),
    # path("eliminar_objeto/<int:id_objeto>",eliminar_objeto,name="eliminar_objeto"),
    
    path("", include(router.urls)),
]
