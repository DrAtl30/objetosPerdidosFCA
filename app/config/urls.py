from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from apps import views

from email_service.api.views import EmailAPIView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("apps.urls")),
    path("", views.home, name="home"),
    path("login/", views.inicio_session, name="login"),
    path("reset-password/", views.reset_password, name="reset_password"),
    path("registro/", views.user_registro, name="user_registro"),
    path("registro-objeto/", views.object_registro, name="object_registro"),
    path("editar-objeto/<int:id_objeto>", views.object_registro, name="editar_objeto"),
    path("administrador/", views.home_admin, name="home_admin"),
    path('administrador/reclamados/', views.object_reclamados, name='objetos_reclamados'),
    path("reclamar/<int:id_objeto>/", views.reclamar_objeto, name="reclamar_objeto"),
    path("send-email", EmailAPIView.as_view(), name="send-email"),
    path("prueba/", views.prueba, name="prueba"),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
