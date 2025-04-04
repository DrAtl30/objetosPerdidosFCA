from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from apps.views import *


urlpatterns = [
    path("admin/", admin.site.urls),
    
    path('api/', include('apps.urls')),
    
    path("", home, name="home"),
    path("login/", login, name="login"),
    path("registro/", user_registro, name="user_registro"),
    path("administrador/", home_admin, name="home_admin"),
    
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
