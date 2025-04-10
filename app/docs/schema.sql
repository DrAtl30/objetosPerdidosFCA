-- Active: 1744049705361@@localhost@5432@objetos_perdidos_fca@public
CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    correo_institucional VARCHAR(150) UNIQUE NOT NULL,
    contrasena TEXT NOT NULL CHECK (LENGTH(contrasena) >= 60), -- Para almacenar hashes seguros (bcrypt)
    rol VARCHAR(50) NOT NULL CHECK (rol IN ('alumno', 'administrador'))
);
-- Tabla Alumno
CREATE TABLE alumno (
    id_alumno SERIAL PRIMARY KEY,
    id_usuario INT UNIQUE NOT NULL,
    numero_cuenta VARCHAR(20) UNIQUE NOT NULL,
    licenciatura VARCHAR (100) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE
);

-- Tabla Administrador
CREATE TABLE administrador (
    id_admin SERIAL PRIMARY KEY,
    id_usuario INT UNIQUE NOT NULL,
    num_empleado VARCHAR(20) UNIQUE NOT NULL,
    curp VARCHAR(18) UNIQUE NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE RESTRICT -- Evita eliminación accidental
);

-- Tabla ObjetoPerdido
CREATE TABLE objeto_perdido (
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
CREATE TABLE reporte_entrega (
    id_reporte SERIAL PRIMARY KEY,
    id_objeto INT NOT NULL,
    fecha_hora_entrega TIMESTAMP NOT NULL,
    id_usuario_reclamante INT NULL, -- Se mantiene NULL si el usuario es eliminado
    imagen_evidencia VARCHAR(255) NOT NULL, -- Cambiado a VARCHAR para almacenar rutas
    observaciones TEXT,
    FOREIGN KEY (id_objeto) REFERENCES objeto_perdido(id_objeto) ON DELETE SET NULL,
    FOREIGN KEY (id_usuario_reclamante) REFERENCES usuario(id_usuario) ON DELETE SET NULL
);

-- Tabla Notificacion
CREATE TABLE notificacion (
    id_notificacion SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    mensaje TEXT NOT NULL,
    fecha_notificacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado_lectura BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

-- Tabla Comentario
CREATE TABLE comentario (
    id_comentario SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_objeto INT NOT NULL,
    comentario TEXT NOT NULL,
    fecha_comentario TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_edicion TIMESTAMP NULL, -- Agregada para registrar ediciones
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_objeto) REFERENCES objeto_perdido(id_objeto) ON DELETE CASCADE
);

-- Tabla ImagenObjeto
CREATE TABLE imagen_objeto (
    id_imagen SERIAL PRIMARY KEY,
    id_objeto INT NULL,  -- Relacionado con Objeto Perdido
    id_reporte INT NULL, -- Relacionado con Reporte de Entrega
    ruta_imagen VARCHAR(255) NOT NULL,
    FOREIGN KEY (id_objeto) REFERENCES objeto_perdido(id_objeto) ON DELETE SET NULL,
    FOREIGN KEY (id_reporte) REFERENCES reporte_entrega(id_reporte) ON DELETE RESTRICT
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_estado_objeto ON objeto_perdido(estado_objeto);
CREATE INDEX idx_fecha_hora_entrega ON reporte_entrega(fecha_hora_entrega);
CREATE INDEX idx_estado_lectura ON notificacion(estado_lectura);
CREATE INDEX idx_fecha_comentario ON comentario(fecha_comentario);

