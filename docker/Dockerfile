# Creamos un usuario no root para seguridad
RUN useradd -m django
# Establecemos el directorio de trabajo en el contenedor, este directorio se genera DENTRO del contenedor que se crea
WORKDIR /app
# Copiamos solo el archivo de dependencias primero para aprovechar la cache de Docker
COPY requirements.txt /app/
# Instalamos las dependencias
RUN pip install --no-cache-dir -r requirements.txt
# Luego copiamos el resto de los archivos
COPY . /app/
# Cambiamos el propietario de los archivos al usuario creado
#RUN chown -R django:django /app
# Usamos el usuario no root
#USER django
# Exponemos el puerto en el que correrá Django
EXPOSE 8000
# Comando por defecto al iniciar el contenedor
# CMD ["tail", "-f", "/dev/null"]
#CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
