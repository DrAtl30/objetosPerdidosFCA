propueta 1
```mermaid
classDiagram
    class Artículo {
        -String nombreObjeto
        -String descripción
        -String estadoObjeto
        -String fotografía
        +cambiarEstado(String nuevoEstado)
    }

    class Reporte {
        -String nombreObjeto
        -String descripción
        -Date fechaExtravío
        -String lugarExtravío
        -Date fechaEntrega
        -String estadoObjeto
        -int númeroCuentaReclamante
        -String evidenciaFotográfica
        -String observaciones
        +agregarEvidencia(String evidencia)
        +agregarObservaciones(String observaciones)
    }

    Artículo "1" -- "0..*" Reporte : Se reporta >
