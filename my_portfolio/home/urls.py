from django.urls import path
from . import views

urlpatterns = [
    path('', views.home_view, name='home'),
    path('certificates/', views.certificates_view, name='certificates'),
]
