from django.core.management.base import BaseCommand, CommandError
from django.core.management import call_command


class Command(BaseCommand):
    help = (
        "Menú para ejecutar comandos administrativos relacionados con admin y historial"
    )

    def handle(self, *args, **options):
        opciones = {
            "1": "admin_crear",
            "2": "admin_cambiar_password",
            "3": "historial_ver",
            "4": "historial_crear",
            "5": "historial_finalizar",
            "6": "lugares_agregar",
            "7": "lugares_ver",
            "q": "Salir",
        }

        while True:
            self.stdout.write("\n--- Menú para administrar cuenta Administrador ---")
            self.stdout.write("1 - Crear Administrador")
            self.stdout.write("2 - Cambiar contraseña de un Administrador")
            self.stdout.write("3 - Consultar historial del Administrador")
            self.stdout.write("4 - Vincular usuario a perfil de Administrador")
            self.stdout.write("5 - Desvincular usuario del perfil de Administrador")
            self.stdout.write("6 - Añadir un nuevo lugar")
            self.stdout.write("7 - Ver todos los lugares")
            self.stdout.write("q - Salir")

            eleccion = input("Selecciona una opción: ").strip()

            if eleccion == "q":
                self.stdout.write("Saliendo del menú...")
                break

            comando = opciones.get(eleccion)
            if not comando:
                self.stdout.write(
                    self.style.ERROR("Opción inválida, intenta de nuevo.")
                )
                continue

            self.stdout.write(f"Ejecutando comando: {comando}...\n")
            try:
                call_command(comando)
            except CommandError as e:
                self.stdout.write(self.style.ERROR(f"Error: {e}"))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Error inesperado: {e}"))
            else:
                self.stdout.write(
                    self.style.SUCCESS(f"Comando {comando} ejecutado correctamente.")
                )
