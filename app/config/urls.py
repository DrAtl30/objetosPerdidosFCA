from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from apps import view


urlpatterns = [
    path('users/registro', view.user_registro, name='user_registro'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)