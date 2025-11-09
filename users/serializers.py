from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import re
from .models import Nilai

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password_confirmation = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = ('email', 'full_name', 'major', 'password', 'password_confirmation')
        extra_kwargs = {
            'password': {'write_only': True, 'style': {'input_type': 'password'}},
            'full_name': {'required': True},
            'major': {'required': True},
        }
        
    def validate_email(self, value):
        email = value.lower()
        student_pattern = re.compile(r'^[a-zA-Z0-9._%+-]+@student\.prasetiyamulya\.ac\.id')
        intructor_pattern = re.compile(r'^[a-zA-Z0-9._%+-]+@prasetiyamulya\.ac\.id')
        
        if student_pattern.match(email) or intructor_pattern.match(email):
            if User.objects.filter(email=email).exists():
                raise serializers.ValidationError("Email is already in use.")
            return email
        raise serializers.ValidationError("Email must be a valid student or instructor email address.")

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirmation']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        email = validated_data['email'].lower()
        username = email.split('@')[0]
        domain = email.split('@')[1]
        
        role = ""
        if domain == 'student.prasetiyamulya.ac.id':
            role = 'student'
        elif domain == 'prasetiyamulya.ac.id':
            role = 'instructor'
            
        user = User.objects.create_user(
            email=email,
            username=username,
            password=validated_data['password'],
            full_name=validated_data['full_name'],
            major=validated_data.get('major', ''),
            role=role,
        )
        
        return user
    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate_email(self, value):
        return value.lower()
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Add custom claims
        token['email'] = user.email
        token['username'] = user.username
        token['full_name'] = user.full_name
        token['major'] = user.major
        token['role'] = user.role
        
        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)
        
        token_data = {
            'access': data['access'],
            'refresh': data['refresh'],
        }
        # Add custom response data
        data.update({
            'email': self.user.email,
            'username': self.user.username,
            'full_name': self.user.full_name,
            'major': self.user.major,
            'role': self.user.role,
            'token': token_data,
        })
        
        return data


class NilaiSerializer(serializers.ModelSerializer):
    # Accept either student email/NIM/ID from the client
    student_identifier = serializers.CharField(write_only=True, required=True)
    student_email = serializers.ReadOnlyField(source='student.email')
    lecturer_email = serializers.ReadOnlyField(source='lecturer.email')

    class Meta:
        model = Nilai
        fields = (
            'id', 'student', 'student_identifier', 'student_email', 'lecturer', 'lecturer_email',
            'course', 'score', 'note', 'created_at', 'updated_at'
        )
        read_only_fields = ('student', 'lecturer', 'created_at', 'updated_at')

    def validate(self, attrs):
        # Ensure score is within a reasonable range
        score = attrs.get('score')
        if score is not None and (score < 0 or score > 100):
            raise serializers.ValidationError({'score': 'Nilai harus di antara 0 sampai 100.'})

        ident = attrs.pop('student_identifier', None)
        if not ident:
            raise serializers.ValidationError({'student_identifier': 'Masukkan email/NIM/ID mahasiswa.'})

        # Resolve student by ID, email, or username (NIM)
        user = None
        if isinstance(ident, str) and ident.isdigit():
            try:
                user = User.objects.get(pk=int(ident))
            except User.DoesNotExist:
                pass
        if user is None:
            user = User.objects.filter(email__iexact=ident).first() or User.objects.filter(username__iexact=ident).first()
        if user is None:
            raise serializers.ValidationError({'student_identifier': 'Mahasiswa tidak ditemukan.'})
        if getattr(user, 'role', None) != 'student':
            raise serializers.ValidationError({'student_identifier': 'User tersebut bukan mahasiswa.'})
        attrs['student'] = user
        return attrs