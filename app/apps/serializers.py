from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password

from .models import Usuario, Alumno, Carrera

class registroUser(serializers.ModelSerializer):
    rol = serializers.CharField(required=False, allow_null = True, max_length=50)
    num_cuenta = serializers.CharField(
        required=False, allow_null=True, max_length=20, write_only=True
    )
    licenciatura = serializers.CharField(
        required=False, allow_null=True, max_length=100, write_only=True
    )
    num_empleado = serializers.CharField(
        required=False, allow_null=True, max_length=20, write_only=True
    )
    curp = serializers.CharField(
        required=False, allow_null=True, max_length=18, write_only=True
    )
    class Meta:
        model = Usuario
        fields = [
            "nombre",
            "apellidos",
            "correo_institucional",
            "contrasena",
            "num_cuenta",
            "licenciatura",
            "num_empleado",
            "curp",
            "rol",
        ]

    def validate_contrasena(self, value):
        if len(value) < 8:
            raise serializers.ValidationError(
                "La contraseña debe tener al menos 8 caracteres."
            )
        return make_password(value)

    def validate_correo_electronico(self, value):
        # Validar el formato del correo electrónico
        if Usuario.objects.filter(correo_institucional=value).exists():
            raise serializers.ValidationError(
                "El correo electrónico ya está registrado."
            )
        return value

    def create(self,validated_data):
        print("Datos recibidos:", validated_data)  # ← Añade esto
        rol = validated_data.get('rol')
        num_cuenta = validated_data.pop('num_cuenta', None)
        num_empleado = validated_data.pop('num_empleado', None)
        licenciatura = validated_data.pop('licenciatura', None)
        curp = validated_data.pop('curp', None)

        LICENCIATURA_OPCIONES = {
            "Administracion": "Administración",
            "Contaduria": "Contaduría",
            "Mercadotecnia": "Mercadotecnia",
            "Informatica_Administrativa": "Informática Administrativa",
        }

        licenciatura1 = LICENCIATURA_OPCIONES.get(licenciatura, None)

        if not rol:
            if num_cuenta and licenciatura:
                rol = 'alumno'
            elif num_empleado and curp:
                rol = 'administrador'
            else:
                raise serializers.ValidationError({"rol": "El rol debe ser 'alumno' o 'administrador'."})

        user = Usuario.objects.create(**validated_data)

        if rol == 'alumno':
            try:
                carrer = Carrera.objects.get(nombre = licenciatura1)
            except Carrera.DoesNotExist:
                raise serializers.ValidationError(
                    {"error": f"Carrera no Valida '{licenciatura1}' "}
                )
            Alumno.objects.create(id_usuario=user, numero_cuenta=num_cuenta, id_carrera = carrer)

        return user
