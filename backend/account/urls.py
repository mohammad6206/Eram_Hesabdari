from django.urls import path
from .views import login_view, LogoutView

urlpatterns = [
    path("login/", login_view, name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
]
