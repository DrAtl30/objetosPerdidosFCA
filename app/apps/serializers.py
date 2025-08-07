from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password

from .models import Usuario, Alumno, Objetoperdido, Imagenobjeto


class RegistroUser(serializers.ModelSerializer):
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
            "password",
            "num_cuenta",
            "licenciatura",
            "num_empleado",
            "curp",
            "rol",
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError(
                "La contraseña debe tener al menos 8 caracteres."
            )
        return value

    def validate_correo_institucional(self, value):
        email_exits = Usuario.objects.filter(correo_institucional=value).first()

        if email_exits:
            alumno = Alumno.objects.filter(id_usuario=email_exits.id_usuario).first()
            num_cuenta = alumno.numero_cuenta
            raise serializers.ValidationError(
                f"El correo electrónico {value} ya está registrado con el numero de cuenta {num_cuenta}."
            )
        return value

    def validate_num_cuenta(self, value):

        if value:
            alumno = Alumno.objects.filter(numero_cuenta=value).first()
            if alumno and alumno.id_usuario:
                correo = alumno.id_usuario.correo_institucional
                raise serializers.ValidationError(
                    f"El número de cuenta {value} ya está registrado con el correo {correo}."
                )
        return value

    def create(self, validated_data):
        rol = validated_data.get("rol")
        num_cuenta = validated_data.pop("num_cuenta", None)
        num_empleado = validated_data.pop("num_empleado", None)
        licenciatura = validated_data.pop("licenciatura", None)
        curp = validated_data.pop("curp", None)
        password = validated_data.pop("password")

        LICENCIATURA_OPCIONES = {
            "Administracion": "Administración",
            "Contaduria": "Contaduría",
            "Mercadotecnia": "Mercadotecnia",
            "Informatica_Administrativa": "Informática Administrativa",
        }

        licenciatura_valida = LICENCIATURA_OPCIONES.get(licenciatura, None)

        user = Usuario(**validated_data)
        user.set_password(password)
        user.is_active = False
        user.save()

        if rol == "alumno":
            if not licenciatura_valida:
                raise serializers.ValidationError(
                    {"licenciatura": f"Licenciatura no valida '{licenciatura_valida}'"}
                )
            Alumno.objects.create(
                id_usuario=user,
                numero_cuenta=num_cuenta,
                licenciatura=licenciatura_valida,
            )

        return user, password


class LoginUser(serializers.Serializer):
    correo_institucional = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        try:
            usuario = Usuario.objects.get(
                correo_institucional=data["correo_institucional"]
            )
        except Usuario.DoesNotExist:
            raise serializers.ValidationError("Correo incorrecto.")
        if not check_password(data["password"], usuario.password):
            raise serializers.ValidationError("Contraseña incorrecta.")

        return {
            "id_usuario": usuario.id_usuario,
            "nombre": usuario.nombre,
            "correo_institucional": usuario.correo_institucional,
        }

# Registro de objetos
ESTADO_OBJETO = [
    ("registrado", "Registrado"),
    ("publicado", "Publicado"),
    ("reclamado", "Reclamado"),
    ("entregado", "Entregado"),
    ("no reclamado", "No reclamado"),
]

class ImagenSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='id_imagen', read_only=True)
    ruta_imagen = serializers.ImageField(read_only=True)
    class Meta:
        model = Imagenobjeto  # o como se llame tu modelo de imagen
        fields = ['id', 'ruta_imagen']

class RegistroObjeto(serializers.ModelSerializer):
    estado_objeto = serializers.ChoiceField(choices=Objetoperdido.ESTADO_OBJETO)
    imagenes = ImagenSerializer(many=True, read_only=True)  # lectura de imágenes relacionadas

    # Campo para subir imágenes, solo escritura
    imagenes_upload = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=True,
        error_messages={
            'required': 'Se requiere al menos una imagen del objeto.',
            'blank': 'No se pueden subir el objeto sin evidencia.'
        }
    )

    class Meta:
        model = Objetoperdido
        fields = [
            'id_objeto',
            'nombre',
            'descripcion_general',
            'descripcion_especifica',
            'fecha_perdida',
            'hora_perdida',
            'lugar_perdida',
            'encontrado_por',
            'estado_objeto',
            'imagenes',
            'imagenes_upload',
        ]

    def validate_imagenes_upload(self, value):
        if not value:
            raise serializers.ValidationError("Debes subir al menos una imagen")
        return value

    def create(self, validated_data):
        imagenes = validated_data.pop('imagenes_upload')
        objeto = Objetoperdido.objects.create(**validated_data, id_usuario_reclamante=None)

        for imagen in imagenes:
            Imagenobjeto.objects.create(id_objeto=objeto, ruta_imagen=imagen)

        return objeto

