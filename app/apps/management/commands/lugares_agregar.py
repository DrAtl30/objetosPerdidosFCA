from django.core.management.base import BaseCommand
from apps.models import Lugar_Perdida
from django.db import transaction, IntegrityError

class Command(BaseCommand):
    help = 'Añadir un nuevo lugar'
    
    def handle(self, *args, **options):
        print("=== Crea un nuevo Lugar ===")
        nombre = input("Nombre del lugar: ").strip()
        
        if not nombre:
            self.stderr.write("❌El nombre no puede estar vacio.")
            return
        
        try:
            with transaction.atomic():
                if Lugar_Perdida.objects.filter(nombre__iexact = nombre).exists():
                    self.stderr.write("❌ Ya existe un lugar regsitrado con ese nombre.")
                    return
                lugar_lost = Lugar_Perdida.objects.create(nombre = nombre)
                self.stdout.write(f"✅ Lugar '{lugar_lost.nombre}' registrado exitosamente.")
                
        except IntegrityError as e:
            self.stderr.write(f"❌ Error al registrar el lugar: {e}")