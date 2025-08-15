from django.core.management.base import BaseCommand
from apps.models import Lugar_Perdida

class Command(BaseCommand):
    help = "Muestra todos los lugares registrados"

    def handle(self, *args, **kwargs):
        lugares = Lugar_Perdida.objects.all().order_by('nombre')

        if not lugares.exists():
            self.stdout.write("⚠️ No hay lugares registrados.")
            return

        self.stdout.write("=== Lista de lugares registrados ===")
        for lugar in lugares:
            self.stdout.write(f"- {lugar.nombre}")