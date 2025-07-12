from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils import timezone
import datetime


class CustomTokenGenerator(PasswordResetTokenGenerator):
    EXPIRATION_MINUTES = 15

    def _make_hash_value(self, user, timestamp):
        login_timestamp = (
            ""
            if user.last_login is None
            else user.last_login.replace(microsecond=0, tzinfo=None)
        )
        return (
            str(user.pk)
            + user.password
            + str(login_timestamp)
            + str(timestamp)
            + str(user.is_active)
        )

    def check_token(self, user, token):
        if not super().check_token(user, token):
            return False
        try:
            ts_b36 = token.split("-")[1]
            ts_int = int(ts_b36, 36)
            token_time = datetime.datetime(
                2001, 1, 1, tzinfo=timezone.utc
            ) + datetime.timedelta(days=ts_int)
            if timezone.now() - token_time > datetime.timedelta(
                minutes=self.EXPIRATION_MINUTES
            ):
                return False
        except Exception:
            return False
        return True

    def _parse_timestamp(self, ts_b36):
        return int(ts_b36,36)


custom_token_generator = CustomTokenGenerator()
