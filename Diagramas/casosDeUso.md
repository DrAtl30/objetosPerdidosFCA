| Caso de uso                    | Reportar Objeto Perdido |
|---------------------------------|-------------------------|
| Actor                           | Comunidad Universitaria |
| Breve Descripción               | El interesado levanta un reporte de algún objeto perdido |
| Precondiciones                  | El usuario debe estar autenticado |
| Postcondiciones                 | El reporte se guarda y es enviado para su posterior revisión |
| Flujo principal                 | 1. El interesado accede a la página de reportar un objeto perdido. 2. El interesado rellena un formulario con la información del objeto perdido (Nombre, Correo Electrónico, Descripción del Objeto, Fecha de Pérdida, Ubicación de Pérdida, Imagen (obligatoria)). 3. El sistema notifica al interesado que su reporte ha sido enviado con éxito. |
| Flujos alternos                 | Si el usuario intenta reportar un objeto previamente registrado, el sistema sugiere revisar la lista antes de continuar |
| Flujos excepcionales            | Si la imagen del objeto excede el tamaño permitido, se muestra un mensaje de error |
| Puntos de extensión             | Ninguno |

---

| Caso de uso                    | Buscar Objeto Perdido |
|---------------------------------|-----------------------|
| Actor                           | Comunidad Universitaria |
| Breve Descripción               | El interesado podrá acceder para visualizar todos los objetos perdidos, así como la información de los mismos |
| Precondiciones                  | Ninguna |
| Postcondiciones                 | El interesado se contacta para reclamar un objeto |
| Flujo principal                 | 1. El interesado accede a la página de objetos perdidos. 2. Hace una búsqueda entre todos los objetos disponibles. 3. Pulsa el botón de reclamar objeto que lo redirigirá a un formulario de contacto. |
| Flujos alternos                 | Si el usuario no encuentra el objeto, el sistema le sugiere revisar más tarde o contactar a la administración |
| Flujos excepcionales            | Si ocurre un problema técnico (fallo de servidor), el sistema informa del error y solicita intentar más tarde |
| Puntos de extensión             | Ninguno |

---

| Caso de uso                    | Registrar Objeto Perdido |
|---------------------------------|--------------------------|
| Actor                           | Administración |
| Breve Descripción               | El administrativo puede editar o registrar nuevos objetos perdidos |
| Precondiciones                  | El usuario debe tener rol de administrador |
| Postcondiciones                 | El objeto perdido es registrado o la información es editada según sea el caso |
| Flujo principal                 | 1. El administrativo accede a la sección de objetos perdidos. 2. El administrativo llena un formulario con la información del objeto perdido (Descripción del Objeto, Fecha de Pérdida, Ubicación de Pérdida, Imagen). 3. El objeto perdido queda registrado. |
| Flujos alternos                 | El administrativo edita la información de un objeto ya existente. Si el objeto ya ha sido reportado por otro usuario, el sistema sugiere fusionar la información |
| Flujos excepcionales            | Si ocurre un problema técnico (fallo de servidor), el sistema informa del error y solicita intentar más tarde |
| Puntos de extensión             | Ninguno |

---

| Caso de uso                    | Entregar Objeto Perdido |
|---------------------------------|-------------------------|
| Actor                           | Administración |
| Breve Descripción               | El administrativo guarda registro de lo relacionado a la entrega del objeto perdido |
| Precondiciones                  | El reclamante debe proporcionar identificación válida o número de cuenta |
| Postcondiciones                 | El objeto perdido es reclamado y se genera un reporte con la información correspondiente |
| Flujo principal                 | 1. El administrativo accede a la sección de objetos perdidos. 2. El administrativo llena un formulario con la información del propietario (número de cuenta, evidencia (imagen)). 3. El estado del objeto cambia de “sin reclamar” a “reclamado”. |
| Flujos alternos                 | Si el objeto fue reclamado por error, el estado puede revertirse a "Sin reclamar" |
| Flujos excepcionales            | Si ocurre un problema técnico (fallo de servidor), el sistema informa del error y solicita intentar más tarde |
| Puntos de extensión             | Si el objeto es altamente valioso, se requiere validación adicional antes de la entrega |
