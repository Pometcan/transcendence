import uuid
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from.models import Message
from.serializers import MessageSerializer
from users.models import User
from django.shortcuts import get_object_or_404
from django.db import transaction

def generate_unique_room_name(user1_id, user2_id):
    sorted_ids = sorted([user1_id, user2_id])
    return f"private_chat_{sorted_ids}_{sorted_ids}"

@api_view(['POST'])
def create_private_chat(request):
    user1_id = request.data.get('user1_id')
    user2_id = request.data.get('user2_id')

    if not user1_id or not user2_id:
        return Response({'error': 'Both user IDs are required.'}, status=400)

    try:
        user1 = User.objects.get(id=user1_id)
        user2 = User.objects.get(id=user2_id)
    except User.DoesNotExist:
        return Response({'error': 'Invalid user ID.'}, status=400)

    room_name = generate_unique_room_name(user1_id, user2_id)
    return Response({'room_name': room_name})

@api_view(['GET'])
def get_room_messages(request, room_name):
    messages = Message.objects.filter(room_name=room_name)
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)