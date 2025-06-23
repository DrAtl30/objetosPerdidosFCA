from datetime import timedelta
from django.utils import timezone
from django.contrib.auth import logout


class SessionTimeoutMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_authenticated:
            now = timezone.now()
            session_start = request.session.get("last_activity")

            # Establecer el tiempo según el rol
            if request.user.rol == "administrador":
                timeout = timedelta(minutes=40)  # ⚠️ cámbialo de 1 a 40 minutos
            else:
                timeout = timedelta(hours=24)

            if session_start:
                try:
                    last_activity = timezone.datetime.fromisoformat(session_start)

                    # Convertir a timezone-aware si es naive
                    if timezone.is_naive(last_activity):
                        last_activity = timezone.make_aware(
                            last_activity, timezone.get_current_timezone()
                        )

                    if now - last_activity > timeout:
                        logout(request)
                        request.session.flush()
                        return self.get_response(request)  # salir tras logout
                except Exception:
                    logout(request)
                    request.session.flush()
                    return self.get_response(request)

            # Guardar el timestamp actual
            request.session["last_activity"] = now.isoformat()

        return self.get_response(request)
