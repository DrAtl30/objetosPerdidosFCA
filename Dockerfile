# Usar una imagen oficial de Python
FROM python:3.9

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar requirements.txt ANTES de copiar la app
COPY requirements.txt /app/

# Copiar los archivos del proyecto al contenedor
COPY ./app /app

# Instalar dependencias del proyecto
RUN pip install --no-cache-dir -r requirements.txt

# Exponer el puerto donde se ejecuta Django
EXPOSE 8000

# Comando para correr el servidor de desarrollo de Django
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
