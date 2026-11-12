from django.contrib import admin

from .models import Category, Task


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "user",
        "color",
    )

    list_filter = ("user",)
    search_fields = ("name", "user__username")


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "user",
        "priority",
        "status",
        "due_date",
    )

    list_filter = (
        "status",
        "priority",
    )

    search_fields = (
        "title",
        "user__username",
    )

    ordering = ("-created_at",)