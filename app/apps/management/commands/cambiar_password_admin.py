from django.core.management.base import BaseCommand
from apps.models import Usuario
from getpass import getpass


class Command(BaseCommand):
    help = "Cambia la contraseña de un administrador"

    def handle(self, *args, **kwargs):
        print("=== Cambiar contraseña de administrador ===")

        correo = input("Correo institucional: ").strip()

        try:
            user = Usuario.objects.get(correo_institucional=correo)

            if user.rol != "administrador":
                self.stderr.write("❌ El usuario existe pero no es un administrador.")
                return

            nueva_password = getpass("Nueva contraseña: ")
            confirmar_password = getpass("Confirmar contraseña: ")

            if nueva_password != confirmar_password:
                self.stderr.write("❌ Las contraseñas no coinciden.")
                return

            user.set_password(nueva_password)
            user.save()
            self.stdout.write("✅ Contraseña actualizada correctamente.")

        except Usuario.DoesNotExist:
            self.stderr.write("❌ No se encontró un usuario con ese correo.")
