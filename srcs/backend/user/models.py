from django.contrib.auth.models import AbstractUser
from django.db import models
from .Managers.friendship_request_manager import FriendshipRequestManager

#Kullanıcı Modeli
class User(AbstractUser):
    username = models.CharField(unique=True, blank=False)
    email = models.EmailField(unique=True, blank=False)
    password = models.CharField(max_length=128, blank=False, null=False)
    avatar = models.URLField(max_length=500, blank=True, null=True, default='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png')
    rank = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    create_date = models.DateTimeField(auto_now_add=True)
    update_date = models.DateTimeField(auto_now=True)

    #Kullanıcılar ve arkadaşları arasındaki ilişki Many-to-Many olarak yönetilir. Friends User tablosuna kolon olarak eklenmez. Djangonun otomatik olarak oluşturacağı User_FrinedshipRequest tablosunu temsil eder.
    friends = models.ManyToManyField('self', through='FriendshipRequest', symmetrical=False, related_name='friend_of', blank=True)
    blocked_users = models.ManyToManyField('self',symmetrical=False, related_name='blocked_by', blank=True)

    def __str__(self):
        return self.username


# Arkadaşlık İsteği Modeli
class FriendshipRequest(models.Model):
    sender = models.ForeignKey(User, related_name='sent_requests', on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name='received_requests', on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True, blank=False, null=False)

    STATUS_CHOICES = [
        ('P', 'Beklemede'),
        ('A', 'Kabul Edildi'),
        ('R', 'Reddedildi'),
    ]
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='P') # status kaldırılabilir çok şart değil
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    objects = FriendshipRequestManager()
    
    def __str__(self):
        return f"{self.sender.username} sent friendship request to the {self.receiver.username}"

