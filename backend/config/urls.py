from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),

    # Authentication APIs
    path("api/auth/", include("accounts.urls")),
    path("api/", include("tasks.urls")),
]