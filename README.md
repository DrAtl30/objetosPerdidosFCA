Estructura del proyecto

ObjetosPerdidos/  # Carpeta raíz del proyecto
│
├── backend/  # Contiene todo el código del backend en Django
│   ├── backend_app/  # Aplicación principal de Django
│   │   ├── migrations/  # Migraciones de base de datos
│   │   ├── templates/  # Templates específicos de esta aplicación
│   │   ├── static/  # Archivos estáticos específicos de esta aplicación
│   │   ├── __init__.py  # Archivo de inicialización del módulo
│   │   ├── admin.py  # Configuración del panel de administración de Django
│   │   ├── apps.py  # Configuración de la aplicación Django
│   │   ├── models.py  # Modelos de la base de datos
│   │   ├── views.py  # Controladores de la aplicación
│   │   ├── urls.py  # Rutas de la aplicación
│   │   ├── tests.py  # Pruebas unitarias
│   │
│   ├── backend_proyect/  # Proyecto principal de Django (donde está settings.py)
│   │   ├── __init__.py  # Archivo de inicialización del proyecto
│   │   ├── settings.py  # Configuración global de Django
│   │   ├── urls.py  # Enrutador principal del proyecto
│   │   ├── wsgi.py  # Configuración WSGI para servir la aplicación
│   │   ├── asgi.py  # Configuración ASGI para aplicaciones en tiempo real
│   │
│   ├── manage.py  # Script para ejecutar comandos de Django
│
├── docker/  # Contiene archivos relacionados con Docker
│   ├── Dockerfile  # Instrucciones para construir la imagen de Django
│   ├── docker-compose.yml  # Orquestación de contenedores (Django, DB, Nginx)
│   ├── requirements.txt  # Dependencias de Python para instalar en el contenedor
│   ├── .env  # Variables de entorno (base de datos, API keys, etc.)
│
├── nginx/  # Configuración del proxy inverso Nginx
│   ├── nginx.conf  # Configuración principal de Nginx
│   ├── sites-available/  # Configuración de sitios y subdominios
│   │   ├── default  # Configuración por defecto de Nginx
│   │   ├── subdominio1.conf  # Configuración para un subdominio
│   │   ├── subdominio2.conf  # Configuración para otro subdominio
│   ├── ssl/  # Certificados SSL (si usas HTTPS con Let's Encrypt)
│   │   ├── fullchain.pem  # Certificado SSL
│   │   ├── privkey.pem  # Clave privada SSL
│
├── scripts/  # Contiene scripts útiles para automatizar tareas
│   ├── init.sh  # Script para inicializar la base de datos y migraciones
│   ├── entrypoint.sh  # Script de entrada para configurar el contenedor
│
├── templates/  # Carpeta para los templates compartidos entre apps
│   ├── base/  # Plantillas base que extienden otras
│   │   ├── base.html  # Template base general para toda la app
│   │   ├── navbar.html  # Barra de navegación común en todas las páginas
│   │   ├── footer.html  # Pie de página común
│
├── static/  # Carpeta de archivos estáticos compartidos por todas las apps
│   ├── css/  # Estilos generales del sitio
│   ├── js/  # Scripts JavaScript globales
│   ├── images/  # Recursos gráficos generales
│
├── LICENSE  # Licencia del proyecto
├── .gitignore  # Archivos y carpetas que no se deben incluir en Git


