from django.db import models
from django.core.exceptions import ValidationError

class FriendshipRequestManager(models.Manager):
    use_in_migrations = True
    
    def create_friendship_request(self, sender, receiver, status):
        if sender == receiver:
            raise ValidationError("Kendinize arkadaşlık isteği gönderemezsiniz.")
        if sender.friends.filter(id=receiver.id).exists():
            raise ValidationError(f"{sender.username} ve {receiver.username} zaten arkadaşlar.")
        if self.filter(sender=sender, receiver=receiver, is_active=True, status='P').exists() and status=='P':
            raise ValidationError("Bu kullanıcıya zaten aktif bir arkadaşlık isteğiniz var.")
        