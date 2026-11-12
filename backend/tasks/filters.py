import django_filters
from django.utils import timezone

from .models import Task


class TaskFilter(django_filters.FilterSet):
    status = django_filters.CharFilter(
        field_name="status"
    )

    priority = django_filters.CharFilter(
        field_name="priority"
    )

    category = django_filters.NumberFilter(
        field_name="category_id"
    )

    due = django_filters.CharFilter(
        method="filter_due"
    )

    class Meta:
        model = Task
        fields = [
            "status",
            "priority",
            "category",
        ]

    def filter_due(self, queryset, name, value):
        today = timezone.localdate()

        if value == "today":
            return queryset.filter(due_date=today)

        if value == "overdue":
            return queryset.filter(
                due_date__lt=today
            ).exclude(status="Done")

        if value == "upcoming":
            return queryset.filter(
                due_date__gt=today
            )

        return queryset