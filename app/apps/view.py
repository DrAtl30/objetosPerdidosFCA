# views.py
from django.shortcuts import render

def user_registro(request):
    return render(request, 'users/registro.html')
