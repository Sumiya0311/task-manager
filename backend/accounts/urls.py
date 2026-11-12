from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    RegisterView,
    EmailLoginView,
    CurrentUserView,
    ChangePasswordView,
)

urlpatterns = [
    path(
        "register/",
        RegisterView.as_view(),
        name="register",
    ),

    path(
        "login/",
        EmailLoginView.as_view(),
        name="login",
    ),

    path(
        "token/refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh",
    ),

    path(
        "me/",
        CurrentUserView.as_view(),
        name="current_user",
    ),

    path(
        "change-password/",
        ChangePasswordView.as_view(),
        name="change_password",
    ),
]