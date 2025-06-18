from django.core.management.base import BaseCommand
from apps.models import HistorialAdministrativo  # Cambia 'app' por el nombre de tu app

class Command(BaseCommand):
    help = 'Crea un nuevo registro en HistorialAdministrativo de forma interactiva'

    def handle(self, *args, **kwargs):
        self.stdout.write("=== Crear nuevo historial administrativo ===")

        nombre = input("Nombre(s): ").strip()
        apellidos = input("Apellidos: ").strip()
        num_empleado = input("Número de empleado: ").strip()
        curp = input("CURP: ").strip()

        historial = HistorialAdministrativo.objects.create(
            nombre=nombre,
            apellidos=apellidos,
            num_empleado=num_empleado,
            curp=curp
        )

        self.stdout.write(self.style.SUCCESS("✅ Historial administrativo creado exitosamente."))
        self.stdout.write(str(historial))
