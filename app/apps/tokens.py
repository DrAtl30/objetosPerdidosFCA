from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils import timezone
import datetime

class CustomTokenGenerator(PasswordResetTokenGenerator):
    EXPIRATION_MINUTES = 15

    def _make_hash_value(self, user, timestamp):
        return str(user.pk) + str(timestamp) + str(user.is_active)

    def check_token(self, user, token):
        if not super().check_token(user, token):
            return False
        try:
            ts_b64 = token.split("-")[1]
            ts_int = self._parse_timestamp(ts_b64)
            token_time = datetime.datetime(2001, 1, 1, tzinfo=timezone.utc) + datetime.timedelta(days=ts_int)
            if timezone.now() - token_time > datetime.timedelta(minutes=self.EXPIRATION_MINUTES):
                return False
        except Exception:
            return False
        return True

    def _parse_timestamp(self, ts_b64):
        return int(ts_b64)

custom_token_generator = CustomTokenGenerator()
