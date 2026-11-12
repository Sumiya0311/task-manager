from django.utils import timezone

from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count, Q
from django.db.models.functions import Coalesce
from rest_framework import generics, viewsets, status
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Category, Task
from .serializers import CategorySerializer, TaskSerializer
from .filters import TaskFilter


# --------------------------------------------------
# CATEGORY APIs
# --------------------------------------------------

class CategoryListCreateView(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return Category.objects.filter(
            user=self.request.user
        ).order_by("id")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CategoryDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(
            user=self.request.user
        )


# --------------------------------------------------
# TASK PAGINATION
# --------------------------------------------------

class TaskPagination(PageNumberPagination):
    page_size = 10


# --------------------------------------------------
# TASK APIs
# --------------------------------------------------

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    # Pagination
    pagination_class = TaskPagination

    # Filters, Search and Sorting
    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_class = TaskFilter

    search_fields = [
        "title",
        "description",
    ]

    ordering_fields = [
        "due_date",
        "priority",
        "created_at",
    ]

    ordering = ["-created_at"]

    # --------------------------------------------------
    # Only logged-in user's tasks
    # --------------------------------------------------

    def get_queryset(self):
        return Task.objects.filter(
            user=self.request.user
        ).select_related("category")

    # --------------------------------------------------
    # Automatically assign logged-in user
    # --------------------------------------------------

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    # --------------------------------------------------
    # Toggle Task Completion
    # --------------------------------------------------

    @action(
        detail=True,
        methods=["patch"],
        url_path="toggle-complete"
    )
    def toggle_complete(self, request, pk=None):
        task = self.get_object()

        if task.status == "Done":
            task.status = "To Do"
            task.completed_at = None
        else:
            task.status = "Done"
            task.completed_at = timezone.now()

        task.save(
            update_fields=[
                "status",
                "completed_at",
                "updated_at",
            ]
        )

        return Response(
            self.get_serializer(task).data,
            status=status.HTTP_200_OK
        )
    @action(
        detail=False,
        methods=["get"],
        url_path="dashboard"
    )
    def dashboard(self, request):
        tasks = Task.objects.filter(user=request.user)
        today = timezone.localdate()

        total = tasks.count()
        todo = tasks.filter(status="To Do").count()
        in_progress = tasks.filter(
            status="In Progress"
        ).count()
        done = tasks.filter(status="Done").count()

        overdue = tasks.filter(
            due_date__lt=today
        ).exclude(status="Done").count()

        due_today = tasks.filter(
            due_date=today
        ).count()

        completion_percentage = (
            round((done / total) * 100, 2)
            if total > 0 else 0
        )

        category_counts = list(
            Category.objects.filter(
                user=request.user
            ).annotate(
                task_count=Count("tasks")
            ).values(
                "id",
                "name",
                "color",
                "task_count"
            )
        )

        uncategorized_count = tasks.filter(
            category__isnull=True
        ).count()

        return Response({
            "total_tasks": total,
            "todo": todo,
            "in_progress": in_progress,
            "done": done,
            "overdue": overdue,
            "due_today": due_today,
            "completion_percentage": completion_percentage,
            "category_counts": category_counts,
            "uncategorized_count": uncategorized_count,
        })