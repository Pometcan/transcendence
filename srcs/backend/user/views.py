from django.shortcuts import render
from django.http import HttpResponse

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from drf_spectacular.utils import extend_schema
from .serializers import AddUserSerializer, GetUserSerializer, UpdateUserSerializer
from .models import User


def index(request):
    return HttpResponse("Hello, world. You're at the user index.")


@extend_schema(
    request=AddUserSerializer,
    responses={201: AddUserSerializer}
)
@api_view(['POST'])
@permission_classes([AllowAny]) #/register
def AddUserView(request):
    if request.method == 'POST':
        serializer = AddUserSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "User created successfully.", "user_id": user.id}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    

@api_view(['GET'])
@permission_classes([AllowAny]) #/profile/id //IsAuthenticated da olabilir!!
def GetUserByIdView(request, id):
    request_user = request.user
    
    # Sorgu: Oturum açan kullanıcı bu iddeki kullanıcıyı bloklamışsa veya kullanıcı oturum açan kullanıcıyı blokladıysa veya pasifse gelmez.
    user = User.objects.filter(id=id, is_active=True
    ).exclude(id__in=request_user.blocked_users.values_list('id', flat=True)
    ).exclude(id__in=request_user.blocked_by.values_list('id', flat=True)).first()
    
    if not user:
        return Response({"detail": "User not found or access is restricted."}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = GetUserSerializer(user)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny]) #/allUsers/ //IsAuthenticated da olabilir!!
def GetAllUsersView(request): 
    request_user = request.user
    
    # Sorgu: Oturum açan kullanıcıyı bloklayan veya oturum açan kullanıcının blokladığı kullanıcıları ve pasif kullanıcıları hariç tutar
    users = User.objects.filter(is_active=True).exclude(
        id__in=request_user.blocked_users.values_list('id', flat=True)
    ).exclude(
        id__in=request_user.blocked_by.values_list('id', flat=True)
    )

    serializer = GetUserSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)



@extend_schema(
    request=UpdateUserSerializer,
    responses={201: UpdateUserSerializer}
)
@api_view(['PUT'])
@permission_classes([AllowAny]) #/updateProfile/  /IsAuthenticated olmalı!!!!!!!
def UpdateUserView(request):
    user = request.user

    serializer = UpdateUserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User updated successfully."}, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['PUT'])
@permission_classes([AllowAny]) #/deleteAccount/  /IsAuthenticated olmalı!!!!!!!
def DeactivateUserView(request):
    user = request.user
    user.is_active = False
    user.save()

    return Response({"detail": "Your account has been deactivated."}, status=status.HTTP_200_OK)