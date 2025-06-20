from django.core.management.base import BaseCommand
from apps.models import HistorialAdministrativo


class Command(BaseCommand):
    help = "Muestra todos los registros de HistorialAdministrativo"

    def handle(self, *args, **kwargs):
        historiales = HistorialAdministrativo.objects.all().order_by("-fecha_inicio")

        if not historiales.exists():
            self.stdout.write("No hay registros en el historial.")
            return

        self.stdout.write("=== Historiales Administrativos ===")
        for h in historiales:
            estado = (
                "Activo" if h.fecha_fin is None else h.fecha_fin.strftime("%Y-%m-%d")
            )
            self.stdout.write(
                f"- {h.nombre} {h.apellidos} | Empleado: {h.num_empleado} | Correo: {h.correo} | Inicio: {h.fecha_inicio.strftime('%Y-%m-%d')} | Fin: {estado}"
            )
