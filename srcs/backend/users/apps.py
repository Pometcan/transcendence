from django.apps import AppConfig
import os
import shutil
from django.conf import settings


class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'users'

    def ready(self):
        avatar_filename = "default-avatar.png"
        if not settings.MEDIA_ROOT:
            raise ValueError(f" {settings.MEDIA_ROOT} MEDIA_ROOT is not set in settings.py")

        if not avatar_filename:
            raise ValueError(f"{avatar_filename} avatar_filename is not set properly")
        default_avatar_dst = os.path.join(settings.MEDIA_ROOT, avatar_filename)
        default_avatar_src = os.path.join(settings.STATIC_ROOT, avatar_filename)

        if not os.path.exists(settings.MEDIA_ROOT):
            os.makedirs(settings.MEDIA_ROOT)
        if not os.path.exists(default_avatar_dst):
            with open(default_avatar_dst, 'wb') as f:
                pass
        if os.path.exists(default_avatar_src):
            shutil.copy(default_avatar_src, default_avatar_dst)
        else:
            print(f"{default_avatar_src} bulunamadı, kopyalama yapılamadı.")
