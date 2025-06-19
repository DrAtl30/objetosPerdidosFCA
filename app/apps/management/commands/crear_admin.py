from django.core.management.base import BaseCommand
from apps.models import Usuario, Administrador
from django.db import transaction, IntegrityError


class Command(BaseCommand):
    help = "Crea un nuevo administrador controladamente"

    def handle(self, *args, **kwargs):
        print("=== Crear nuevo administrador ===")

        correo = input("Correo institucional: ").strip()
        nombre = input("Nombre(s): ").strip()
        apellidos = input("Apellidos: ").strip()
        contrasena = input("Contraseña: ").strip()

        try:
            with transaction.atomic():
                if Usuario.objects.filter(correo_institucional=correo).exists():
                    self.stderr.write("❌ Ya existe un usuario con ese correo.")
                    return

                user = Usuario.objects.create_user(
                    correo_institucional=correo,
                    contrasena=contrasena,
                    nombre=nombre,
                    apellidos=apellidos,
                    rol="administrador",
                    is_superuser=True,
                    is_staff=True,
                    is_active=True,
                )

                Administrador.objects.create(id_usuario=user)

                self.stdout.write("✅ Administrador creado exitosamente.")

        except IntegrityError as e:
            self.stderr.write(f"❌ Error al crear el administrador: {e}")
