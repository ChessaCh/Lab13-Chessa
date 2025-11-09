from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('instructor', 'Instructor'),
    ]
    
    MAJOR_CHOICES = [
        ('artificial_intelligence_and_robotics', 'AIR'),
        ('business_mathematics', 'BM'),
        ('digital_business_technology', 'DBT'),
        ('product_design_engineering', 'PDE'),
        ('energy_business_technology', 'EBT'),
        ('food_business_technology', 'FBT'),
    ]
    
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=100)
    major = models.CharField(max_length=100, choices=MAJOR_CHOICES, blank=True, null=True)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='student')
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'full_name']
    
    def __str__(self):
        return self.email


class Nilai(models.Model):
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='nilais')
    lecturer = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_nilais')
    course = models.CharField(max_length=120)
    score = models.FloatField()
    note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.course} - {self.student.email} ({self.score})"