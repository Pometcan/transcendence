from django.apps import AppConfig
import os
import shutil
from django.conf import settings


class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'users'

    def ready(self):
        default_avatar_dst = os.path.join(settings.MEDIA_ROOT,'${AVATAR_FILE_NAME}')
        
        if  os.path.exists(default_avatar_dst):
            default_avatar_src = os.path.join(settings.STATICFILES_DIRS[0], '${AVATAR_FILE_NAME}')
            shutil.copy(default_avatar_src, default_avatar_dst)



    