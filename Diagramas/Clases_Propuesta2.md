Propuesta 2
```mermaid
classDiagram
    class Artículo {
        -String nombreObjeto
        -String descripción
        -String estadoObjeto
        -int númeroCuenta
        -Date fechaExtravío
        -String lugarExtravío
        -Date fechaEntrega
        -int númeroCuentaReclamante
        -String fotografía        
        -String evidenciaEntrega
        -String observaciones
        +cambiarEstado(String nuevoEstado)
        +agregarEvidencia(String evidencia)
        +agregarObservaciones(String observaciones)
    }
    
