from django.core.exceptions import ValidationError
from .models import User
import re
# import requests
from django.utils.translation import gettext_lazy as _

#Username doğrulaması
def validate_username(value):
    if User.objects.filter(username=value, is_active=True).exists():
        raise ValidationError("A user with that username already exists.")
    return value

#Email doğrulaması
def validate_email(value):
    if User.objects.filter(email=value, is_active=True).exists():
        raise ValidationError("A user with that email already exists.")
    return value

#Custom password validation function
def validate_password(value):

    # Minimum uzunluk kontrolü (Django'nun MinimumLengthValidator ile de yapılır)
    if len(value) < 8:
        raise ValidationError('Password must be at least 8 characters long.')

    # Yaygın şifreler kontrolü (CommonPasswordValidator'ın sağladığı işlevsellik)
    common_passwords = ['password', '123456', 'qwerty', 'letmein', 'admin']
    if value.lower() in common_passwords:
        raise ValidationError('This password is too common. Please choose a more secure password.')

    # Büyük harf kontrolü
    if not re.search(r'[A-Z]', value):
        raise ValidationError('Password must contain at least one uppercase letter.')

    # Rakam kontrolü
    if not re.search(r'[0-9]', value):
        raise ValidationError('Password must contain at least one digit.')

    # Özel karakter kontrolü
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value): 
        raise ValidationError('Password must contain at least one special character.')

# # Avatar link doğrulaması
# def validate_avatar(value):
#     if not value.startswith('https://'): # URL SSL korumalı mı kontrol et
#         raise ValidationError(_('Avatar link must be an SSL-secured URL (https).'))
#     try: # URL'yi kontrol et
#         response = requests.get(value, timeout=10)
#         if response.status_code != 200:
#             raise ValidationError(_('The avatar link is not accessible. Please provide a valid URL.'))
#     except requests.exceptions.RequestException as e:
#         raise ValidationError(_('The avatar link is invalid or unreachable.'))
#     return value

