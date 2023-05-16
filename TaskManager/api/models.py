from django.db import models

# Create your models here.


class Task(models.Model):
    name = models.CharField(max_length=100)
    completed = models.BooleanField(default=False)
    description = models.TextField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    deadline = models.DateTimeField(null=True, blank=True)
    completionPercentage = models.IntegerField(default=0)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Task'
        verbose_name_plural = 'Tasks'


class Subtask(models.Model):
    name = models.CharField(max_length=100)
    completed = models.BooleanField(default=False)
    deadline = models.DateTimeField(null=True, blank=True)
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='subtask', null=True)

    def __str__(self):
        return self.body

    class Meta:
        verbose_name = 'Subtask'
        verbose_name_plural = 'Subtasks'