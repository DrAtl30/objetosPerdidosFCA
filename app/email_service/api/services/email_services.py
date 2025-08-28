from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.core.signing import TimestampSigner
from django.utils.html import strip_tags
import os

def enviar_correo(asunto, destinatario, plantilla, contexto, mensaje_texto=None, adjuntos = None):
    mensaje_html = render_to_string(plantilla, contexto)
    if not mensaje_texto:
        try:
            mensaje_texto = render_to_string(plantilla.replace(".html", ".txt"), contexto)
        except Exception:
            mensaje_texto = strip_tags(mensaje_html)
         
        
    email = EmailMultiAlternatives(asunto, mensaje_texto,settings.EMAIL_HOST_USER,[destinatario])
    email.attach_alternative(mensaje_html, "text/html")
    
    if adjuntos:
        for path in adjuntos:
            with open(path, 'rb') as f:
                filename = os.path.basename(path)
                email.attach(filename, f.read(), 'application/pdf')
    email.send()



def enviar_correo_confirmacion(alumno,password=None):
    signer = TimestampSigner()
    uid = signer.sign(str(alumno.id_usuario))
    url_confirmacion = f"{settings.FRONTEND_URL}/api/confirmar-cuenta/{uid}"

    contexto = {
        'nombre_alumno':alumno.nombre,
        'apellidos_alumno':alumno.apellidos,
        'url_confirmacion':url_confirmacion,
        'password':password
    }
    asunto = "Confirma tu cuenta"
    enviar_correo(asunto,alumno.correo_institucional,'auth/confirmaCorreo.html',contexto,f"Por favor confirma tu cuenta ingresando al siguiente enlace: {url_confirmacion}")


def enviar_pass_admin(historial, correo_admin, contrasena_nueva):
    destinatario = historial.correo
    asunto = "Acceso a cuenta de administrador"
    plantilla = "auth/sendPassword.html"
    contexto = {
            "titulo": "Credenciales de acceso",
            "nombre_admin": historial.nombre,
            "apellidos_admin": historial.apellidos,
            "email_admin": correo_admin,
            "password": contrasena_nueva,
            'tipo': 'bienvenida'
        }
    msj = f"""
    Has sido registrado como administrador del sistema.

    Correo institucional: {correo_admin}
    Contraseña temporal: {contrasena_nueva}

    Por favor, inicia sesión.
    """
    enviar_correo(asunto, destinatario,plantilla, contexto, msj)

def enviar_correo_recuperacion(email, url_reset):
    asunto = "Recuperación de contraseña"
    contexto = {"reset_url": url_reset}
    plantilla = "auth/password_reset_email.html"
    mensaje_texto = f"Restablece tu contraseña ingresando aquí: {url_reset}"

    enviar_correo(asunto,email,plantilla,contexto,mensaje_texto)

def enviar_correo_nueva_pass(alumno,password):
    asunto = "Contraseña Actualizada"
    plantilla = "auth/sendPassword.html"
    contexto = {
        "titulo": "Credenciales de acceso",
        'nombre':alumno.nombre,
        'apellidos':alumno.apellidos,
        'password':password,
        'tipo': 'bienvenida'
    }
    mensaje_texto = f"Tu contraseña se actualizó correctamente. Nueva contraseña: {password}"
    enviar_correo(asunto,alumno.correo_institucional,plantilla,contexto,mensaje_texto)
    
def enviar_reporte_pdf_individual(alumno,objeto,adjuntos):
    asunto = "Reporte de Entrega de Objeto"
    plantilla = "report/reporte_email.html"
    contexto = {
        "titulo": "Credenciales de acceso",
        'nombre':alumno.nombre,
        'apellidos':alumno.apellidos,
        'objeto': objeto.nombre,
        'fecha_entrega':objeto.fecha_entrega
    }
    mensaje_texto = f"Has reclamado el objeto {objeto.nombre} en la fecha {objeto.fecha_entrega}, se adjunta el reporte en PDF"
    enviar_correo(asunto,alumno.correo_institucional,plantilla,contexto,mensaje_texto, adjuntos)