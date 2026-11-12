from rest_framework import serializers
from .models import Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "color"]
        read_only_fields = ["id"]

    def validate_name(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Category name cannot be empty."
            )

        user = self.context["request"].user

        queryset = Category.objects.filter(
            user=user,
            name__iexact=value
        )

        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError(
                "You already have a category with this name."
            )

        return value

    def validate_color(self, value):
        import re

        if not re.fullmatch(r"#[0-9A-Fa-f]{6}", value):
            raise serializers.ValidationError(
                "Enter a valid hex color, such as #4F46E5."
            )

        return value

from django.utils import timezone
from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        source="category.name",
        read_only=True,
        default=None
    )

    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "description",
            "category",
            "category_name",
            "priority",
            "status",
            "due_date",
            "completed_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "completed_at",
            "created_at",
            "updated_at",
        ]

    def validate_title(self, value):
        value = value.strip()
        if len(value) < 3:
            raise serializers.ValidationError(
                "Title must contain at least 3 characters."
            )
        return value

    def validate_category(self, value):
        if value is None:
            return None
        if value.user_id != self.context["request"].user.id:
            raise serializers.ValidationError(
                "You can only use your own categories."
            )
        return value

    def validate_due_date(self, value):
        if (
            value
            and self.instance is None
            and value < timezone.localdate()
        ):
            raise serializers.ValidationError(
                "Due date cannot be in the past."
            )
        return value

    def create(self, validated_data):
        if validated_data.get("status") == "Done":
            validated_data["completed_at"] = timezone.now()
        return super().create(validated_data)

    def update(self, instance, validated_data):
        new_status = validated_data.get(
            "status", instance.status
        )

        if new_status == "Done" and instance.status != "Done":
            validated_data["completed_at"] = timezone.now()
        elif new_status != "Done" and instance.status == "Done":
            validated_data["completed_at"] = None

        return super().update(instance, validated_data)