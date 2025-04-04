-- Tabla Usuario
CREATE TABLE Usuario (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    correo_institucional VARCHAR(150) UNIQUE NOT NULL,
    contrasena TEXT NOT NULL CHECK (LENGTH(contrasena) >= 60), -- Para almacenar hashes seguros (bcrypt)
    rol VARCHAR(50) NOT NULL CHECK (rol IN ('alumno', 'administrador'))
);

-- Tabla Carrera
CREATE TABLE Carrera (
    id_carrera SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    facultad VARCHAR(100) NOT NULL
);

-- Tabla Alumno
CREATE TABLE Alumno (
    id_alumno SERIAL PRIMARY KEY,
    id_usuario INT UNIQUE NOT NULL,
    numero_cuenta VARCHAR(20) UNIQUE NOT NULL,
    id_carrera INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_carrera) REFERENCES Carrera(id_carrera) ON DELETE CASCADE
);

-- Tabla Administrador
CREATE TABLE Administrador (
    id_admin SERIAL PRIMARY KEY,
    id_usuario INT UNIQUE NOT NULL,
    num_empleado VARCHAR(20) UNIQUE NOT NULL,
    curp VARCHAR(18) UNIQUE NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE RESTRICT -- Evita eliminación accidental
);

-- Tabla ObjetoPerdido
CREATE TABLE ObjetoPerdido (
    id_objeto SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_perdida DATE NOT NULL,
    lugar_perdida VARCHAR(255) NOT NULL,
    estado_objeto VARCHAR(50) NOT NULL CHECK (estado_objeto IN ('registrado', 'en revisión', 'publicado', 'reclamado', 'entregado', 'no reclamado')),
    id_usuario_reclamante INT NULL,
    FOREIGN KEY (id_usuario_reclamante) REFERENCES Usuario(id_usuario) ON DELETE SET NULL
);

-- Tabla ReporteEntrega
CREATE TABLE ReporteEntrega (
    id_reporte SERIAL PRIMARY KEY,
    id_objeto INT NOT NULL,
    fecha_hora_entrega TIMESTAMP NOT NULL,
    id_usuario_reclamante INT NULL, -- Se mantiene NULL si el usuario es eliminado
    imagen_evidencia VARCHAR(255) NOT NULL, -- Cambiado a VARCHAR para almacenar rutas
    observaciones TEXT,
    FOREIGN KEY (id_objeto) REFERENCES ObjetoPerdido(id_objeto) ON DELETE SET NULL,
    FOREIGN KEY (id_usuario_reclamante) REFERENCES Usuario(id_usuario) ON DELETE SET NULL
);

-- Tabla Notificacion
CREATE TABLE Notificacion (
    id_notificacion SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    mensaje TEXT NOT NULL,
    fecha_notificacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado_lectura BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE
);

-- Tabla Comentario
CREATE TABLE Comentario (
    id_comentario SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_objeto INT NOT NULL,
    comentario TEXT NOT NULL,
    fecha_comentario TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_edicion TIMESTAMP NULL, -- Agregada para registrar ediciones
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_objeto) REFERENCES ObjetoPerdido(id_objeto) ON DELETE CASCADE
);

-- Tabla ImagenObjeto
CREATE TABLE ImagenObjeto (
    id_imagen SERIAL PRIMARY KEY,
    id_objeto INT NULL,  -- Relacionado con Objeto Perdido
    id_reporte INT NULL, -- Relacionado con Reporte de Entrega
    ruta_imagen VARCHAR(255) NOT NULL,
    FOREIGN KEY (id_objeto) REFERENCES ObjetoPerdido(id_objeto) ON DELETE SET NULL,
    FOREIGN KEY (id_reporte) REFERENCES ReporteEntrega(id_reporte) ON DELETE RESTRICT
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_estado_objeto ON ObjetoPerdido(estado_objeto);
CREATE INDEX idx_fecha_hora_entrega ON ReporteEntrega(fecha_hora_entrega);
CREATE INDEX idx_estado_lectura ON Notificacion(estado_lectura);
CREATE INDEX idx_fecha_comentario ON Comentario(fecha_comentario);

-- registros de la tabla Carrera
insert into carrera (nombre, facultad)
values ('Administración','FCA');
insert into carrera (nombre, facultad)
values ('Contaduría','FCA');
insert into carrera (nombre, facultad)
values ('Mercadotecnia','FCA');
insert into carrera (nombre, facultad)
values ('Informática Administrativa','FCA');

