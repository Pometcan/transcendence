from os import getenv
from pickle import GET
"""
Django settings for backend project.

Generated by 'django-admin startproject' using Django 5.1.2.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.1/ref/settings/
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv()

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY', 'Agla Kudur')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv('DEBUG', 'true')

ALLOWED_HOSTS = ['*']

######################################################################################################################################---ÖNEMLİ
CSRF_COOKIE_PATH = '/'
#################################################################################################################

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites', #SENEM: social login için gerekli

    'rest_framework',

    #authentication için
    'rest_framework.authtoken',
    #registraton için
    'allauth',
    'allauth.account',
    'allauth.socialaccount', #SENEM: 42 intra ile bağlamak için kullanılabilir- social login
    'dj_rest_auth',
    'dj_rest_auth.registration',

    "corsheaders",
    'requests',
    'users.apps.UsersConfig',
    'drf_spectacular', #SENEM: swagger içindi sanırım

    #MELIH
    'channels',
    'game',
]



AUTH_USER_MODEL = 'users.User'

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly'
    ],

    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema', #SENEM: swagger için

    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',  # CSRF için
        'rest_framework.authentication.TokenAuthentication',
    ],
}

AUTHENTICATION_BACKENDS = (
    'allauth.account.auth_backends.AuthenticationBackend',
)

SITE_ID = 1
ACCOUNT_EMAIL_VERIFICATION = 'none' #SENEM: 2fa için değiştirmek gerekebilir??
# SENEM: ACCOUNT_EMAIL_VERIFICATION = 'mandatory'  # E-posta doğrulaması zorunlu
ACCOUNT_EMAIL_REQUIRED = True #SENEM: Kayıt esnasında email adresi verilmeli mi?
ACCOUNT_UNIQUE_EMAIL = True
#SENEM: ACCOUNT_AUTHENTICATED_REDIRECT_URL = '/'  # Başarılı giriş sonrası yönlendirilecek URL



MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "allauth.account.middleware.AccountMiddleware",
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'
ASGI_APPLICATION = 'backend.asgi.application'

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('redis', 6379)],
            "password": os.getenv('REDIS_PASSWORD', None),
        },
    },
}
# CORS Ayarları
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS',
]
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
    'x-custom-header',
]
# CSRF Güvenilir Kaynaklar
CSRF_TRUSTED_ORIGINS = [
    "https://pometcan.com",
    "https://api.pometcan.com",
    "http://localhost:80",
    "http://localhost:8000",
    f"https://{os.getenv('FRONTEND_DOMAIN')}",
    f"https://{os.getenv('BACKEND_DOMAIN')}",
    f"https://{os.getenv('GRAFANA_DOMAIN')}",
    "https://api.pometcan.com"
    "https://localhost:80",
    "http://localhost:80",
    "http://localhost:8000",
    "http://127.0.0.1:8000", #swagger için
]
# Add explicit CORS origins
CORS_ALLOWED_ORIGINS = [
    "https://pometcan.com",
    "https://api.pometcan.com",
    "http://localhost:80",
    "http://localhost:8000",
]

CSRF_COOKIE_SECURE = True  # SENEM: Geliştirme aşamasında, productionda True yapmalıyız.
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = False  # SENEM: CSRF token yalnızca HTTP başlıklarında mevcut olacak??

# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv('POSTGRES_DB'),
        "USER": os.getenv('POSTGRES_USER'),
        "PASSWORD": os.getenv('POSTGRES_PASSWORD'),
        "HOST": os.getenv('DB_HOST'),
        "PORT": os.getenv('DB_PORT'),
    }
}

CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': f"redis://redis:{os.getenv('REDIS_PORT')}/1",
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
            'PASSWORD': os.getenv('REDIS_PASSWORD', None),
        }
    }
}


SESSION_ENGINE = 'django.contrib.sessions.backends.cache'
SESSION_CACHE_ALIAS = 'default'

# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
    # {
    #     'NAME': 'user.validators.custom_password_validator',
    # },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/
STATIC_URL = '/usr/share/nginx/html/backstatic/'

MEDIA_URL = '/media/'
MEDIA_ROOT = 'uploads'

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, '/backend/static'),
]

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
