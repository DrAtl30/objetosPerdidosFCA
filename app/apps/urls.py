from django.urls import path
from apps.views import RegistroAlumnoView, LoginAlumnoView
urlpatterns = [
    path("registro/", RegistroAlumnoView.as_view(), name="registro"),
    path("login/", LoginAlumnoView.as_view(), name="login"),
]
