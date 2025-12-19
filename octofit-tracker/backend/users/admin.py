from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

# Register your models here.

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'user_type', 'fitness_level', 'total_points']
    list_filter = ['user_type', 'fitness_level']
    fieldsets = UserAdmin.fieldsets + (
        ('OctoFit Info', {'fields': ('user_type', 'age', 'height', 'weight', 'fitness_level', 'total_points', 'profile_image')}),
    )
