from django.core.management.base import BaseCommand
from apps.models import HistorialAdministrativo  # Cambia 'app' por el nombre de tu app
from django.utils import timezone

class Command(BaseCommand):
    help = 'Registra la fecha de finalización de un historial administrativo'

    def handle(self, *args, **kwargs):
        self.stdout.write("=== Finalizar historial administrativo ===")

        num_empleado = input("Número de empleado: ").strip()

        try:
            historial = HistorialAdministrativo.objects.get(num_empleado=num_empleado)
        except HistorialAdministrativo.DoesNotExist:
            self.stdout.write(self.style.ERROR("❌ No se encontró un historial con ese número de empleado."))
            return

        if historial.fecha_fin is not None:
            self.stdout.write(self.style.WARNING("⚠️ Este historial ya tiene una fecha de finalización."))
            return

        historial.fecha_fin = timezone.localtime(timezone.now())
        historial.save()

        self.stdout.write(self.style.SUCCESS(f"✅ Fecha de finalización registrada: {historial.fecha_fin}"))
