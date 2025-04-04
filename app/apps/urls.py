from django.urls import path
from apps.views import RegistroView

urlpatterns = [
    path('registro/', RegistroView.as_view(), name='registro'),
]
