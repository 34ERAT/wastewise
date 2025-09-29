from uuid import uuid4
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.contrib.gis.db import models


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields) -> "User":
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        extra_fields.setdefault("is_active", True)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields) -> "User":
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    class UserTypes(models.Choices):
        HOUSEHOLD = "Household"
        SME = "sme"
        COUNCIL = "Council"
        RECYCLER = "Recycler"

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    email = models.EmailField(max_length=255, unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    # password = models.CharField(max_length=255)
    user_type = models.CharField(
        max_length=20, choices=UserTypes.choices, default=UserTypes.HOUSEHOLD
    )
    location = models.PointField(geography=True, null=True, blank=True)
    username = None
    first_name = None
    last_name = None
    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["user_type"]

    def __str__(self) -> str:
        return f"{self.email} ({self.user_type}) "


class BaseModel(models.Model):
    """Absttract base model with uuid pk and timstamp"""

    id = models.UUIDField(primary_key=True, default=uuid4(), editable=False)
    create_at = models.DateTimeField(
        auto_now_add=True,
    )
    update_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class WasteType(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4(), editable=False)
    name = models.CharField(max_length=50)
    description = models.TextField(blank=True, null=True)

    def __str__(self) -> str:
        return self.name


class WasteRequest(BaseModel):
    class StatusChoices(models.Choices):
        PENDING = "pending"
        ASSIGNED = "assigned"
        COMPLETED = "completed"
        CANCELLED = "cancelled"

    user = models.ForeignKey(User, on_delete=models.RESTRICT)
    waste_type = models.ForeignKey(WasteType, on_delete=models.RESTRICT)
    volume_kg = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(
        max_length=20, choices=StatusChoices.choices, default=StatusChoices.PENDING
    )
    schedule_time = models.DateTimeField()
    location = models.PointField(geography=True, null=True, blank=True)

    def __str__(self) -> str:
        return f"request {self.id} - {self.user.name}"


class Vehicle(BaseModel):
    class StatusChoices(models.Choices):
        AVAILABE = "availabe"
        BUSY = "busy"
        OFFLINE = "offline"

    driver_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, unique=True)
    current_location = models.PointField(geography=True, null=True, blank=True)
    status = models.CharField(
        max_length=20, choices=StatusChoices.choices, default=StatusChoices.AVAILABE
    )

    def __str__(self) -> str:
        return f"vehicle {self.id} - {self.driver_name}"


class RecyclingCenter(BaseModel):
    name = models.CharField(max_length=100)
    email = models.EmailField(blank=True, unique=True)
    phone = models.CharField(max_length=20, unique=True)
    location = models.PointField(geography=True, null=True, blank=True)

    def __str__(self) -> str:
        return self.name


class Collection(BaseModel):
    class StatusChoices(models.Choices):
        IN_PROGRESS = "in_progress"
        COMPLETED = "completed"
        Failed = "failed"

    waste_request = models.ForeignKey(WasteRequest, on_delete=models.RESTRICT)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.RESTRICT)
    pickup_time = models.DateTimeField(null=True, blank=True)
    delivered_to = models.ForeignKey(
        RecyclingCenter, on_delete=models.RESTRICT, null=True
    )
    status = models.CharField(
        max_length=20, choices=StatusChoices.choices, default=StatusChoices.IN_PROGRESS
    )

    def __str__(self):
        return f"Collection {self.id} for Request {self.waste_request.id}"
