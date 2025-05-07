from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from decouple import config

class EmailAPIView(APIView):
    def post(self, request):
        try:
            to_email = config('EMAIL_TEST_USER')
            subject = "mensaje de prueba"
            message = "Este es un mensaje de prueba desde OPFCA"
            from_email = config("EMAIL_TEST_USER_GMAIL")
            send_mail(subject, message, from_email, [to_email])
            return Response({
              'message' : 'correo enviado con exito'
          }, status=status.HTTP_200_OK)
        except Exception as e:
            err_msj = str(e)
            return Response(
                {"message": err_msj}, status=status.HTTP_400_BAD_REQUEST
            )

