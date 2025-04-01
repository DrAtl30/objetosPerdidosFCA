|-- LICENSE  # Archivo con los términos de licencia del proyecto  
|-- README.md  # Documentación del proyecto  
|-- backend  # Es la aplicación principal de Django  
|-- docker  # Contiene archivos para la configuración de Docker  
|   |-- Dockerfile  # Define la imagen de Docker  
|   |-- docker-file.yml  # Configuración de Docker Compose  
|   |-- requirements.txt  # Lista de dependencias del proyecto  
|    -- .env  # guarda las variables de entorno que se colocan en docker-compose.yml
|-- nginx  # Configuración del servidor Nginx  
|   |-- sites-available  # Archivos de configuración de hosts virtuales en Nginx  
|   -- ssl  # Certificados SSL/TLS para HTTPS  
|-- otra_app  # Espacio para otra aplicación Django dentro del proyecto  
|-- project-config  # Configuración global del proyecto Django (settings.py, urls.py, wsgi.py, etc.)  
|-- scripts  # Scripts para automatizar tareas del proyecto  
|-- static  # Archivos estáticos como CSS, imágenes y JavaScript  
|   |-- css_g  # Hojas de estilo CSS globales  
|   |-- images_g  # Carpeta con imágenes del proyecto  
|   -- js_g  # Archivos JavaScript globales  
-- templates  # Archivos HTML utilizados en las vistas de Django  
