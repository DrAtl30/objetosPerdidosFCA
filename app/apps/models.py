from django.db import models


class Administrador(models.Model):
    id_admin = models.AutoField(primary_key=True)
    id_usuario = models.OneToOneField('Usuario', models.DO_NOTHING, db_column='id_usuario')
    num_empleado = models.CharField(unique=True, max_length=20)
    curp = models.CharField(unique=True, max_length=18)

    class Meta:
        managed = False
        db_table = 'administrador'


class Alumno(models.Model):
    id_alumno = models.AutoField(primary_key=True)
    id_usuario = models.OneToOneField('Usuario', models.DO_NOTHING, db_column='id_usuario')
    numero_cuenta = models.CharField(unique=True, max_length=20)
    id_carrera = models.ForeignKey('Carrera', models.DO_NOTHING, db_column='id_carrera')

    class Meta:
        managed = False
        db_table = 'alumno'


class Carrera(models.Model):
    id_carrera = models.AutoField(primary_key=True)
    nombre = models.CharField(unique=True, max_length=100)
    facultad = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'carrera'


class Comentario(models.Model):
    id_comentario = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey('Usuario', models.DO_NOTHING, db_column='id_usuario')
    id_objeto = models.ForeignKey('Objetoperdido', models.DO_NOTHING, db_column='id_objeto')
    comentario = models.TextField()
    fecha_comentario = models.DateTimeField()
    fecha_edicion = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'comentario'


class Imagenobjeto(models.Model):
    id_imagen = models.AutoField(primary_key=True)
    id_objeto = models.ForeignKey('Objetoperdido', models.DO_NOTHING, db_column='id_objeto', blank=True, null=True)
    id_reporte = models.ForeignKey('Reporteentrega', models.DO_NOTHING, db_column='id_reporte', blank=True, null=True)
    ruta_imagen = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'imagenobjeto'


class Notificacion(models.Model):
    id_notificacion = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey('Usuario', models.DO_NOTHING, db_column='id_usuario')
    mensaje = models.TextField()
    fecha_notificacion = models.DateTimeField()
    estado_lectura = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'notificacion'


class Objetoperdido(models.Model):
    id_objeto = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    fecha_perdida = models.DateField()
    lugar_perdida = models.CharField(max_length=255)
    estado_objeto = models.CharField(max_length=50)
    id_usuario_reclamante = models.ForeignKey('Usuario', models.DO_NOTHING, db_column='id_usuario_reclamante', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'objetoperdido'


class Reporteentrega(models.Model):
    id_reporte = models.AutoField(primary_key=True)
    id_objeto = models.ForeignKey(Objetoperdido, models.DO_NOTHING, db_column='id_objeto')
    fecha_hora_entrega = models.DateTimeField()
    id_usuario_reclamante = models.ForeignKey('Usuario', models.DO_NOTHING, db_column='id_usuario_reclamante', blank=True, null=True)
    imagen_evidencia = models.CharField(max_length=255)
    observaciones = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'reporteentrega'


class Usuario(models.Model):
    id_usuario = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    apellido1 = models.CharField(max_length=100)
    apellido2 = models.CharField(max_length=100, blank=True, null=True)
    correo_institucional = models.CharField(unique=True, max_length=150)
    contrasena = models.TextField()
    rol = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = 'usuario'
