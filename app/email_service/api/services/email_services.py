from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from apps.tokens import custom_token_generator


def enviar_correo_confirmacion(alumno,password):
    token = custom_token_generator.make_token(alumno)
    uid = urlsafe_base64_encode(force_bytes(alumno.id_usuario))
    nombre = alumno.nombre
    apellidos = alumno.apellidos
    url_confirmacion = f"{settings.FRONTEND_URL}/api/confirmar-cuenta/{uid}/{token}/"

    asunto = "Confirma tu cuenta"
    mensaje_html = render_to_string(
        "users/confirmaCorreo.html", {
            "nombre_alumno" : nombre,
            "apellidos_alumno" : apellidos,
            "url_confirmacion": url_confirmacion,
            'password': password}
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

def enviar_contraseña_admin(historial, correo_admin, contrasena_nueva):
    destino = historial.correo
    nombre = historial.nombre
    apellidos = historial.apellidos
    asunto = "Acceso a cuenta de administrador"
    msj_html = render_to_string(
        "administrador/sendPassword.hmtl",{
            "nombre_admin": nombre,
            "apellidos_admin": apellidos,
            "email_admin": correo_admin,
            "pass_admin": contrasena_nueva
        }
    )
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
