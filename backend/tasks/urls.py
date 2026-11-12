from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    CategoryListCreateView,
    CategoryDetailView,
    TaskViewSet,
)

router = DefaultRouter()
router.register(
    r"tasks",
    TaskViewSet,
    basename="task"
)

urlpatterns = [
    path(
        "categories/",
        CategoryListCreateView.as_view(),
        name="category-list-create"
    ),
    path(
        "categories/<int:pk>/",
        CategoryDetailView.as_view(),
        name="category-detail"
    ),
    path("", include(router.urls)),
]