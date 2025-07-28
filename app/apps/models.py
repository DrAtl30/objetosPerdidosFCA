from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group, Permission
from django.utils import timezone


class UsuarioManager(BaseUserManager):
    def create_user(self, correo_institucional, contrasena=None, **extra_fields):
        if not correo_institucional:
            raise ValueError("El correo institucional es obligatorio")

        correo_institucional = self.normalize_email(correo_institucional)
        user = self.model(correo_institucional=correo_institucional, **extra_fields)
        user.set_password(contrasena)
        user.save(using=self._db)
        return user

    def create_superuser(self, correo_institucional, contrasena=None, **extra_fields):
        extra_fields.setdefault("nombre", "Administrador")
        extra_fields.setdefault("apellidos", "Sistema")
        extra_fields.setdefault("rol", "administrador")
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("rol") != "administrador":
            raise ValueError("El superusuario debe tener el rol 'administrador'.")

        return self.create_user(correo_institucional, contrasena, **extra_fields)


class Usuario(AbstractBaseUser, PermissionsMixin):
    id_usuario = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    correo_institucional = models.EmailField(unique=True)
    rol = models.CharField(max_length=50)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    groups = models.ManyToManyField(
        Group,
        related_name="usuario_set",
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="usuario_set",
        blank=True,
    )

    USERNAME_FIELD = "correo_institucional"
    REQUIRED_FIELDS = ["nombre", "apellidos", "rol"]

    objects = UsuarioManager()

    def __str__(self):
        return self.correo_institucional

    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return self.is_superuser

    class Meta:
        db_table = "usuario"


class Administrador(models.Model):
    id_admin = models.AutoField(primary_key=True)
    id_usuario = models.OneToOneField(
        "Usuario", models.DO_NOTHING, db_column="id_usuario", default=51
    )

    class Meta:
        # managed = False
        db_table = "administrador"


class HistorialAdministrativo(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    num_empleado = models.CharField(max_length=20)
    curp = models.CharField(max_length=18)
    fecha_inicio = models.DateTimeField(auto_now_add=True)
    fecha_fin = models.DateTimeField(null=True, blank=True)
    correo = models.CharField(max_length=100, null=True)
    id_usuario = models.ForeignKey(
        Usuario,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        db_column="id_usuario",
        default=51
    )

    class Meta:
        db_table = "historial_administrativo"

    def __str__(self):
        return f"{self.nombre} {self.apellidos} ({self.num_empleado})"


class Alumno(models.Model):
    id_alumno = models.AutoField(primary_key=True)
    id_usuario = models.OneToOneField(
        "Usuario", models.DO_NOTHING, db_column="id_usuario", default=51
    )
    numero_cuenta = models.CharField(unique=True, max_length=20)
    licenciatura = models.CharField(unique=True, max_length=100)

    class Meta:
        # managed = False
        db_table = "alumno"


class Comentario(models.Model):
    id_comentario = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey("Usuario", models.DO_NOTHING, db_column="id_usuario", default=51)
    id_objeto = models.ForeignKey(
        "Objetoperdido", models.DO_NOTHING, db_column="id_objeto", null=True
    )
    comentario = models.TextField()
    fecha_comentario = models.DateTimeField()
    fecha_edicion = models.DateTimeField(blank=True, null=True)

    class Meta:
        # managed = False
        db_table = "comentario"


class Imagenobjeto(models.Model):
    id_imagen = models.AutoField(primary_key=True)
    id_objeto = models.ForeignKey(
        "Objetoperdido", on_delete=models.CASCADE, db_column="id_objeto", blank=True, null=True, related_name="imagenes"
    )
    id_reporte = models.ForeignKey(
        "Reporteentrega",
        models.DO_NOTHING,
        db_column="id_reporte",
        blank=True,
        null=True,
    )
    ruta_imagen = models.ImageField(upload_to="objetos/")

    class Meta:
        # managed = False
        db_table = "imagenobjeto"


class Notificacion(models.Model):
    id_notificacion = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey("Usuario", models.DO_NOTHING, db_column="id_usuario",default=51)
    mensaje = models.TextField()
    fecha_notificacion = models.DateTimeField()
    estado_lectura = models.BooleanField()

    class Meta:
        # managed = False
        db_table = "notificacion"


class Objetoperdido(models.Model):
    ESTADO_OBJETO = [
        ('registrado','Registrado'),
        ('publicado','Publicado'),
        ('reclamado','Reclamado'),
        ('entregado','Entregado'),
        ('no reclamado','No reclamado'),
    ]
    
    id_objeto = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    fecha_perdida = models.DateField()
    lugar_perdida = models.CharField(max_length=255)
    estado_objeto = models.CharField(max_length=50, choices=ESTADO_OBJETO)
    fecha_carga = models.DateTimeField(auto_now_add=True)
    id_usuario_reclamante = models.ForeignKey(
        "Usuario",
        models.DO_NOTHING,
        db_column="id_usuario_reclamante",
        blank=True,
        null=True,
        default=1
    )

    class Meta:
        # managed = False
        db_table = "objetoperdido"


class Reporteentrega(models.Model):
    id_reporte = models.AutoField(primary_key=True)
    id_objeto = models.ForeignKey(
        Objetoperdido, models.DO_NOTHING, db_column="id_objeto", null=True
    )
    fecha_hora_entrega = models.DateTimeField()
    id_usuario_reclamante = models.ForeignKey(
        "Usuario",
        models.DO_NOTHING,
        db_column="id_usuario_reclamante",
        blank=True,
        null=True,
        default=51
    )
    imagen_evidencia = models.CharField(max_length=255)
    observaciones = models.TextField(blank=True, null=True)

    class Meta:
        # managed = False
        db_table = "reporteentrega"
