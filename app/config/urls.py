from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from apps import views


urlpatterns = [
    path("admin/", admin.site.urls),
    
    path('api/', include('apps.urls')),
    
    path("", views.home, name="home"),
    path("login/", views.login, name="login"),
    path("registro/", views.user_registro, name="user_registro"),
    path("administrador/", views.home_admin, name="home_admin"),
    
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
