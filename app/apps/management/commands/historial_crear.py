import os
from django.core.management.base import BaseCommand
from email_service.api.services.email_services import enviar_contraseña_admin
from apps.models import HistorialAdministrativo, Administrador, Usuario


class Command(BaseCommand):
    help = "Crea un nuevo registro en HistorialAdministrativo de forma interactiva"

    def handle(self, *args, **kwargs):
        self.stdout.write("\n=== Crear nuevo historial administrativo ===\n")

        administdores = Administrador.objects.select_related("id_usuario").all()

        if not administdores.exists():
            self.stdout.write(self.style.ERROR("❌ No hay administradores registrados."))
            return

        self.stdout.write("Seleccione un número de las cuentas dispoibles de perfil administrador")
        self.stdout.write("Seleccione '0' para cancelar\n ")
        for idx, admin in enumerate(administdores, start=1):
            usuario = admin.id_usuario
            self.stdout.write(f"{idx}. {usuario.nombre} {usuario.apellidos} ({usuario.correo_institucional})")

        while True:
            
            try:
                selection = int(input("Espero tus indicaciones: "))
                if selection == 0:
                    self.stdout.write(self.style.SUCCESS("\n Retornar al menú \n"))
                    return
                
                if 1 <= selection <= len(administdores):
                    admin_select = administdores[selection - 1]
                    user_admin = admin_select.id_usuario
                    break
                else:
                    self.stdout.write("⚠️ Número fuera de rango. Intente de nuevo.")
            except ValueError:
                self.stdout.write("⚠️ Entrada inválida. Ingrese un número.")

        nombre = input("Nombre(s): ").strip()
        apellidos = input("Apellidos: ").strip()
        
        while True:
            num_empleado = input("Número de empleado (máx, 7 caracteres): ").strip()

            if len(num_empleado) ==0:
                self.stdout.write(self.style.WARNING("Debes escribir un número de empleado"))
                continue
            if not num_empleado.isdigit():
                self.stdout.write(self.style.WARNING("Solo se aceptan números naturales"))     
                continue
            if len(num_empleado) > 7:
                self.stdout.write(self.style.WARNING("Demasiado largo, deben de ser 7 dígitos"))     
                continue

            if len(num_empleado)!= 7:
                self.stdout.write(self.style.WARNING("Deben de ser 7 dígitos, si no los tiene agrege ceros a la izquierda"))
                continue
            break

        
        while True:
            curp = input("CURP: ").strip().upper()
            if len(curp) == 0 :
                self.stdout.write(self.style.WARNING("Debe de ingresar una CURP"))
                continue
            if not curp.isalnum():
                self.stdout.write(self.style.WARNING("La CURP solo se compone de números y letras"))
                continue
            if len(curp)!=18:
                self.stdout.write(self.style.WARNING("La CURP debe tener exactamente 18 carácteres"))
                continue
            break

        correo = input("Correo: ").strip()

        historial = HistorialAdministrativo.objects.create(
            nombre=nombre,
            apellidos=apellidos,
            num_empleado=num_empleado,
            curp=curp,
            correo=correo,
            id_usuario=user_admin
        )

        self.stdout.write(self.style.SUCCESS("✅ Historial administrativo creado exitosamente."))
        self.stdout.write(str(historial))

        # Leer la contraseña desde el archivo
        try:
            with open("ultima_password_admin.txt", "r") as f:
                line = f.readline()
                correo_guardado, password_guardada = line.strip().split(":")

            if correo_guardado == user_admin.correo_institucional:
                enviar_contraseña_admin(historial, user_admin.correo_institucional, password_guardada)
                self.stdout.write(self.style.SUCCESS(f"📩 Contraseña enviada  del correo {user_admin.correo_institucional} al correo {correo}."))
                os.remove("ultima_password_admin.txt")
            else:
                self.stdout.write(self.style.WARNING("⚠️ El correo no coincide con el último cambio de contraseña."))

        except FileNotFoundError:
            self.stdout.write(self.style.ERROR("❌ No se encontró el archivo con la contraseña."))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Error al leer la contraseña: {e}"))
