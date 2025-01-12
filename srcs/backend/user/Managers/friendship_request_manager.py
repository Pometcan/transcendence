from django.db import models
from django.core.exceptions import ValidationError

class FriendshipRequestManager(models.Manager):
    use_in_migrations = True
    
    def create_friendship_request(self, sender, receiver):
        if sender == receiver:
            raise ValidationError("Kendinize arkadaşlık isteği gönderemezsiniz.")
        if sender.friends.filter(id=receiver.id).exists():
            raise ValidationError(f"{sender.username} ve {receiver.username} zaten arkadaşlar.")
        if self.filter(sender=sender, receiver=receiver, is_active=True).exists():
            raise ValidationError("Bu kullanıcıya zaten aktif bir arkadaşlık isteğiniz var.")
        
        return self.create(sender=sender, receiver=receiver)