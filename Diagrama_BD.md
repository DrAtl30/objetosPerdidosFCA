```mermaid
erDiagram
    USUARIO ||--o{ ALUMNO : "1 a 1"
    USUARIO ||--o{ OBJETO_ARTICULO : "1 a muchos"
    USUARIO ||--o{ COMENTARIO : "1 a muchos"
    USUARIO ||--o{ NOTIFICACION : "1 a muchos"
    ALUMNO ||--o{ REPORTE : "1 a muchos"
    OBJETO_ARTICULO ||--o{ COMENTARIO : "1 a muchos"
    OBJETO_ARTICULO ||--o{ REPORTE : "1 a muchos"

    USUARIO {
        SERIAL id_usuario PK
        VARCHAR nombre
        VARCHAR correo
        VARCHAR rol
    }

    ALUMNO {
        SERIAL numero_cuenta PK
        INT id_usuario FK
    }

    OBJETO_ARTICULO {
        SERIAL id_objeto PK
        TEXT descripcion
        TIMESTAMP fecha_registro
        BOOLEAN Estado_reclamado
        TEXT Imagen
    }

    COMENTARIO {
        SERIAL id_comentario PK
        INT id_objeto FK
        INT id_usuario FK
        TEXT contenido
        TIMESTAMP fecha_comentario
    }

    NOTIFICACION {
        SERIAL id_notificacion PK
        INT id_usuario FK
        TEXT mensaje
        TIMESTAMP fecha_notificacion
        BOOLEAN Estado_lectura
    }

    REPORTE {
        SERIAL id_reporte PK
        INT id_objeto FK
        TIMESTAMP fecha_reporte
        TEXT descripcion
        INT numero_cuenta FK
        TEXT Evidencia
    }
