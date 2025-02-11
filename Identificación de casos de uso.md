Descripción de casos de uso

|Caso de uso|Reportar Objeto Perdido|
| :- | :- |
|Actor|Comunidad Universitaria|
|Breve Descripción|El interesado levanta un reporte de algún objeto perdido|
|Precondiciones|Ninguna|
|Postcondiciones|El reporte se guarda y es enviado para su posterior revisión|
|Flujo principal|<p>1. El interesado accede a la pagina de reportar un objeto perdido</p><p>2. El interesado rellena un formulario con la información del objeto perdido (Nombre, Correo Electrónico, Descripción del Objeto, Fecha de Pérdida, Ubicación de Pérdida, Imagen (opcional))</p><p>3. El sistema notifica al interesado que su reporte ha sido enviado con éxito</p>|
|Flujos alternos|Si faltan datos obligatorios, el sistema muestra un mensaje de error y solicita completarlos|
|Flujos excepcionales|Si ocurre un problema técnico (fallo de servidor), el sistema informa del error y solicita intentar más tarde.|
|Puntos de extensión|Ninguno|



|Caso de uso|Buscar objeto perdido |
| :- | :- |
|Actor|Comunidad universitaria|
|Breve Descripción|El interesado podrá acceder para visualizar todos los objetos perdidos, así como la información de los mismos.|
|Precondiciones|Ninguna|
|Postcondiciones|El interesado se contacta para reclamar un objeto|
|Flujo principal|<p>1. El interesado accede a la página de objetos perdidos</p><p>2. Hace una búsqueda entre todos los objetos disponibles</p><p>3. Pulsa el botón de reclamar objeto que lo redirigirá a un formulario de contacto</p>|
|Flujos alternos|Ninguno|
|Flujos excepcionales|Si ocurre un problema técnico (fallo de servidor), el sistema informa del error y solicita intentar más tarde.|
|Puntos de extensión|Ninguno|



|Caso de uso|Registrar objeto perdido |
| :- | :- |
|Actor|Administración|
|Breve Descripción|El administrativo puede editar o registrar nuevos objetos perdidos|
|Precondiciones|Ninguna|
|Postcondiciones|El objeto perdido es registrado o la información es editada según sea el caso|
|Flujo principal|<p>1. El administrativo accede a la sección de objetos perdidos</p><p>2. El administrativo llena un formulario con la información del objeto perdido (Descripción del Objeto, Fecha de Pérdida, Ubicación de Pérdida, Imagen)</p><p>3. El objeto perdido queda registrado</p>|
|Flujos alternos|El administrativo edita la información de un objeto ya existente|
|Flujos excepcionales|Si ocurre un problema técnico (fallo de servidor), el sistema informa del error y solicita intentar más tarde.|
|Puntos de extensión|Ninguno|



|Caso de uso|Reportar Objeto Perdido|
| :- | :- |
|Actor|Comunidad Universitaria|
|Breve Descripción|El interesado levanta un reporte de algún objeto perdido|
|Precondiciones|Ninguna|
|Postcondiciones|El reporte se guarda y es enviado para su posterior revisión|
|Flujo principal|<p>1. El interesado accede a la pagina de reportar un objeto perdido</p><p>2. El interesado rellena un formulario con la información del objeto perdido (Nombre, Correo Electrónico, Descripción del Objeto, Fecha de Pérdida, Ubicación de Pérdida, Imagen (opcional))</p><p>3. El sistema notifica al interesado que su reporte ha sido enviado con éxito</p>|
|Flujos alternos|Si faltan datos obligatorios, el sistema muestra un mensaje de error y solicita completarlos|
|Flujos excepcionales|Si ocurre un problema técnico (fallo de servidor), el sistema informa del error y solicita intentar más tarde.|
|Puntos de extensión|Ninguno|



|Caso de uso|Entregar objeto perdido |
| :- | :- |
|Actor|Administración|
|Breve Descripción|El administrativo guarda registro de lo relacionado a la entrega del objeto perdido|
|Precondiciones|Ninguna|
|Postcondiciones|El objeto perdido es reclamado y se genera un reporte con la información correspondiente|
|Flujo principal|<p>1. El administrativo accede a la sección de objetos perdidos</p><p>2. El administrativo llena un formulario con la información del propietario (número de cuenta, evidencia (imagen))</p><p>3. El estado del objeto cambia de “sin reclamar” a “reclamado”</p>|
|Flujos alternos|Ninguno|
|Flujos excepcionales|Si ocurre un problema técnico (fallo de servidor), el sistema informa del error y solicita intentar más tarde.|
|Puntos de extensión|Ninguno|

