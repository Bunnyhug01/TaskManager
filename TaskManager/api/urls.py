from rest_framework import routers
from .views import TaskViewSet, SubtaskViewSet

router = routers.DefaultRouter()
router.register(r'api/tasks', TaskViewSet, 'tasks')
router.register(r'api/subtasks', SubtaskViewSet, 'subtasks')

urlpatterns = router.urls