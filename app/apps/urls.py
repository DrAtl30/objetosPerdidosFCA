from django.urls import path
from apps.views import RegistroAlumnoView, LoginAlumnoView, ConfirmarCuentaView, verificar_correo_confirmado
urlpatterns = [
    path("registro/", RegistroAlumnoView.as_view(), name="registro"),
    path("login/", LoginAlumnoView.as_view(), name="login"),
    path('confirmar-cuenta/<uidb64>/<token>/', ConfirmarCuentaView.as_view(), name="confirma-cuenta"),
    path("verificarCorreoConfirmado/", verificar_correo_confirmado, name="verificarCorreoConfirmado"),
]
