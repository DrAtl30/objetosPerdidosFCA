from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator


def enviar_correo_confirmacion(alumno):
    token = default_token_generator.make_token(alumno)
    uid = urlsafe_base64_encode(force_bytes(alumno.id_usuario))
    url_confirmacion = f"{settings.FRONTEND_URL}/api/confirmar-cuenta/{uid}/{token}/"

    asunto = "Confirma tu cuenta"
    mensaje_html = render_to_string(
        "users/confirmaCorreo.html", {"url_confirmacion": url_confirmacion}
    )
    mensaje_texto = f"Por favor confirma tu cuenta ingresando al siguiente enlace: {url_confirmacion}"

    email = EmailMultiAlternatives(
        asunto,
        mensaje_texto,
        settings.EMAIL_HOST_USER,
        [alumno.correo_institucional],
    )
    email.attach_alternative(mensaje_html, "text/html")
    email.send()

def enviar_contraseña_admin(destinatario, correo_admin, contrasena_nueva):
    asunto = "Acceso a cuenta de administrador"
    msj = f"""
    Has sido registrado como administrador del sistema.

    Correo institucional: {correo_admin}
    Contraseña temporal: {contrasena_nueva}

    Por favor, inicia sesión.
    """

    email = EmailMultiAlternatives(
        asunto,
        msj,
        settings.EMAIL_HOST_USER,
        [destinatario],
    )
    email.send()
