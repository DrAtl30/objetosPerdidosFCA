import time
import sys
from django.db import connections
from django.db.utils import OperationalError
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    """Esperar a que la base de datos esté disponible"""

    def handle(self, *args, **options):
        self.stdout.write('Esperar a conectar a la base de datos...')
        db_conn = None
        max_retries = 50
        retry_count = 0
        
        while retry_count < max_retries:
            try:
                #En Django 'connections' es un diccionario que maneja todas las conexiones de las base de datos definidas
                    #en el settins.py, se coloca 'default' porque es el nombre de la conexión existente
                db_conn = connections['default'] 
                db_conn.cursor()
                self.stdout.write(self.style.SUCCESS('¡Base de datos conectada!'))
                return
            except OperationalError:
                self.stdout.write('Base de datos no disponible, esperemos 1 segundo...')
                retry_count += 1
                time.sleep(1)
        
        self.stdout.write(
            self.style.ERROR('No se pudo conectar a la base de datos después de 50 segundos')
        )
        sys.exit(1) #Si no se optuvo la conexión mara error "1" para que Docker los sepa