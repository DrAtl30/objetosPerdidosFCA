from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password

from .models import Usuario, Alumno

class registroUser(serializers.ModelSerializer):
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

    def validate_correo_institucional(self, value):

        email_exits = Usuario.objects.filter(correo_institucional=value).first()

        if email_exits:
            alumno = Alumno.objects.filter(id_usuario = email_exits.id_usuario).first()
            num_cuenta = alumno.numero_cuenta         
            raise serializers.ValidationError(f"El correo electrónico {value} ya está registrado con el numero de cuenta {num_cuenta}.")
        return value

    def validate_num_cuenta(self, value):

        if value:
            alumno = Alumno.objects.filter(numero_cuenta=value).first()
            if alumno and alumno.id_usuario:
                correo = alumno.id_usuario.correo_institucional
                raise serializers.ValidationError(f"El número de cuenta {value} ya está registrado con el correo {correo}.")
        return value

    def create(self,validated_data):
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

        licenciatura_valida = LICENCIATURA_OPCIONES.get(licenciatura, None)

        user = Usuario.objects.create(**validated_data)

        if rol == 'alumno':
            if not licenciatura_valida:
                raise serializers.ValidationError({"licenciatura": f"Licenciatura no valida '{licenciatura_valida}'"})
            Alumno.objects.create(
                id_usuario=user,
                numero_cuenta=num_cuenta,
                licenciatura = licenciatura_valida
            )

        return user

class LoginUser(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = [
            'correo_institucional',
            'contrasena'
        ]

    def validate(self, data):
        try:
            usuario = Usuario.objects.get(correo_institucional = data['correo_institucional'])
        except Usuario.DoesNotExist:
            raise serializers.ValidationError("Correo incorrecto.")
        if not check_password(data["contrasena"], usuario.contrasena):
            raise serializers.ValidationError("Contraseña incorrecta.")

        return {
            "id_usuario": usuario.id_usuario,
            "nombre": usuario.nombre,
            "correo_institucional": usuario.correo_institucional,
        }
