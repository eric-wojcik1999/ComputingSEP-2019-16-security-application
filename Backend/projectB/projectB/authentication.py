from VMA.models import User
from rest_framework import authentication
from rest_framework import exceptions
from django.contrib.auth.forms import AuthenticationForm
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate

class CustAuthentication(authentication.BaseAuthentication):

    def authenticate(self, request):
        #print("data", request.data)
#use comments to switch between the auths for testing. postman wont work with session.
        auth = authentication.SessionAuthentication()
#        auth = authentication.BasicAuthentication()
        return auth.authenticate(request=request)


class CustAuthForm(AuthenticationForm):

    error_messages = {
        'invalid_login': (
            "Please enter a correct username and password. Note that both "
            "fields may be case-sensitive."
        ),
        'inactive': "This account is inactive.",
    }

    def clean(self):
        username = self.cleaned_data.get('username')
        password = self.cleaned_data.get('password')
        if username is not None and password:
            self.user_cache = authenticate(self.request, username=username, password=password)
            if self.user_cache is None:
                raise ValidationError(self.error_messages['invalid_login'], code='invalid_login')
            else:
                self.confirm_login_allowed(self.user_cache)

        return self.cleaned_data

    def confirm_login_allowed(self, user):
        username = user.username
        password = user.password
        if not username:
            return None
        try:
            user1 = User.objects.get(username=username)
        except User.DoesNotExist:
            raise exceptions.AuthenticationFailed('No such user')
        if not password == user1.password:
            raise ValidationError(self.error_messages['invalid_login'], code='invalid_login')
        if not user.is_active:
            raise ValidationError(
                self.error_messages['inactive'],
                code='inactive',)
        return None
