from django.contrib import admin
from .models import CustomUser, Nilai
from django.contrib.auth.admin import UserAdmin

class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'full_name', 'major', 'role')
    list_filter = ('role', 'major')
    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Personal info', {'fields': ('full_name', 'major', 'role')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'full_name', 'major', 'role', 'password1', 'password2'),
        }),
    )
    ordering = ('email',)
    
admin.site.register(CustomUser, CustomUserAdmin)

@admin.register(Nilai)
class NilaiAdmin(admin.ModelAdmin):
    list_display = ('course', 'score', 'student', 'lecturer', 'created_at')
    list_filter = ('course', 'lecturer')
    search_fields = ('course', 'student__email', 'lecturer__email')