from django.shortcuts import render
from rest_framework import viewsets
from .serializers import TaskSerializer, SubtaskSerializer
from .models import Task, Subtask

# Create your views here.


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    queryset = Task.objects.all()


class SubtaskViewSet(viewsets.ModelViewSet):
    serializer_class = SubtaskSerializer
    queryset = Subtask.objects.all()