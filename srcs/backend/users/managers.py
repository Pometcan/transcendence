from django.db import models
from django.contrib.auth.models import UserManager as DefaultUserManager
from django.core.exceptions import ValidationError
from django.apps import apps

class UserManager(DefaultUserManager):
    use_in_migrations =True

    def get_friend_validation(self, requestUser, friend):

        if not friend \
                or not self.filter(id=friend.id).exists() \
                or not friend.is_active :
            raise ValidationError("Kullanıcı bulunamadı.")
        if not requestUser.friends.filter(id = friend.id).exists():
            raise ValidationError("Kullanıcı zaten arkadaşınız değil.")

    def block_user_validation(self, requestUser, userToBlock):
        if not userToBlock \
                or not self.filter(id=userToBlock.id).exists() \
                or not userToBlock.is_active \
                or requestUser.blocked_by.filter(id = userToBlock.id).exists():
            raise ValidationError("Kullanıcı bulunamadı.")
        if requestUser == userToBlock:
            raise ValueError("Kendinizi engelleyemezsiniz.")
        if requestUser.blocked_users.filter(id = userToBlock.id).exists():
            raise ValidationError("Kullanıcı zaten engellenmiş.")

    def get_blocked_user_valdation(self, requestUser, blockedUser):

        if  not blockedUser \
                or not self.filter(id=blockedUser.id).exists() \
                or not blockedUser.is_active \
                or requestUser.blocked_by.filter(id = blockedUser.id).exists():
            raise ValidationError("Kullanıcı bulunamadı.")


class FriendshipRequestManager(models.Manager):
    use_in_migrations = True

    def create_friendship_request_validation(self, sender, receiver, status):

        User = apps.get_model('users', 'User')
        if not receiver \
                or not User.objects.filter(id=receiver.id).exists() \
                or not receiver.is_active \
                or sender.blocked_users.filter(id=receiver.id).exists() \
                or receiver.blocked_users.filter(id=sender.id).exists() :
            raise ValidationError("Kullanıcı bulunamadı.")
        if receiver and sender == receiver:
            raise ValidationError("Kendinize arkadaşlık isteği gönderemezsiniz.")
        if receiver and sender.friends.filter(id=receiver.id).exists():
            raise ValidationError(f"{sender.username} ve {receiver.username} zaten arkadaşlar.")
        if receiver and self.filter(sender=sender, receiver=receiver, is_active=True, status='P').exists() and status=='P':
            raise ValidationError("Bu kullanıcıya zaten aktif bir arkadaşlık isteğiniz var.")

    def get_sent_friendship_request_validation(self, instance, request_user):

        if not instance.is_active \
                or not instance.sender == request_user :
            raise ValidationError("Arkadaşlık isteği bulunamadı.")

    def get_received_friendship_request_validation(self, instance, request_user):

        if not instance.is_active \
                or not instance.receiver == request_user :
            raise ValidationError("Arkadaşlık isteği bulunamadı.")
