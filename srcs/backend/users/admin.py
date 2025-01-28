from django.contrib import admin

# Register your models here.

from users.models import User, FriendshipRequest


admin.site.register(User)
admin.site.register(FriendshipRequest)