from django.db import models
import uuid
import random


class AutoNumberMixin(models.Model):
    number_field = "number"

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        number_field = self.number_field
        number_value = getattr(self, number_field, None)

        if not number_value:
            model = self.__class__
            last_obj = model.objects.order_by("-id").first()

            if last_obj:
                last_number = getattr(last_obj, number_field)
                if last_number and str(last_number).isdigit():
                    next_number = int(last_number) + 1
                else:
                    next_number = 1
            else:
                next_number = 1

            field_type = model._meta.get_field(number_field).get_internal_type()
            if field_type in ["IntegerField", "PositiveIntegerField"]:
                setattr(self, number_field, next_number)
            else:
                setattr(self, number_field, str(next_number))

        super().save(*args, **kwargs)


class Warehouse(AutoNumberMixin, models.Model):
    number_field = "number"

    code = models.UUIDField("کد انبار", default=uuid.uuid4, editable=False, unique=True)
    number = models.CharField("شماره انبار", max_length=50, unique=True, blank=True, null=True)
    name = models.CharField("نام انبار", max_length=100)
    phone = models.CharField("تلفن", max_length=20, blank=True, null=True)

    def __str__(self):
        return f"{self.code} - {self.name}"


class ProductGroup(AutoNumberMixin, models.Model):
    number_field = "number"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    number = models.CharField("شماره گروه", max_length=50, unique=True, blank=True, null=True)
    title = models.CharField("عنوان گروه", max_length=100, unique=True)

    class Meta:
        verbose_name = "گروه کالا"
        verbose_name_plural = "گروه کالاها"

    def __str__(self):
        return self.title


class Unit(AutoNumberMixin, models.Model):
    number_field = "number"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    number = models.CharField("شماره واحد", max_length=50, unique=True, blank=True, null=True)
    title = models.CharField("عنوان واحد", max_length=100, unique=True)

    class Meta:
        verbose_name = "واحد کالا"
        verbose_name_plural = "واحدهای کالا"

    def __str__(self):
        return self.title


class Product(AutoNumberMixin,models.Model):

    number_field = "number"

    number = models.CharField("شماره کالا", max_length=50, unique=True, blank=True, null=True)
    device= models.ForeignKey("Device",verbose_name="عنوان دستگاه", on_delete=models.CASCADE)
    name = models.CharField("نام کالا", max_length=200)
    model = models.CharField("مدل", max_length=100, blank=True, null=True)
    group = models.ForeignKey("ProductGroup", verbose_name="گروه کالا", on_delete=models.CASCADE)
    unit = models.ForeignKey("Unit", verbose_name="واحد کالا", on_delete=models.CASCADE)
    registration_date = models.DateField("تاریخ ثبت", null=True, blank=True)
    quantity = models.PositiveIntegerField("تعداد", default=0)
    description = models.TextField("توضیحات", blank=True, null=True)

    def __str__(self):
        return f"{self.number} - {self.name}"


class ConsumptionType(AutoNumberMixin, models.Model):
    number_field = "number"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    number = models.CharField(" شماره نوع مصرف", max_length=50, unique=True, blank=True, null=True)
    title = models.CharField("عنوان نوع مصرف", max_length=100, unique=True)

    def __str__(self):
        return self.title





class Device(AutoNumberMixin,models.Model):
    number_field = "number"

    number = models.CharField(" شماره دستگاه", max_length=50, unique=True, blank=True, null=True)
    title = models.CharField("عنوان دستگاه", max_length=100, unique=True)


    def __str__(self):
        return self.title
    




def generate_unique_personnel_code():
    from .models import Personnel  # فقط اینجا import شود
    while True:
        code = str(random.randint(10000, 99999))  # عدد 5 رقمی
        if not Personnel.objects.filter(personnel_code=code).exists():
            return code

class Personnel(models.Model):
    personnel_code = models.CharField("کد پرسنلی", max_length=5, unique=True, blank=True)
    full_name = models.CharField("نام و نام خانوادگی", max_length=200)
    national_id = models.CharField("کد ملی", max_length=20, blank=True, null=True)
    father_name = models.CharField("نام پدر", max_length=100, blank=True, null=True)
    address = models.TextField("آدرس", blank=True, null=True)
    postal_code = models.CharField("کد پستی", max_length=20, blank=True, null=True)
    email = models.EmailField("ایمیل", blank=True, null=True)
    birth_certificate_number = models.CharField("شماره شناسنامه", max_length=50, blank=True, null=True)
    
    national_card_file = models.FileField("کارت ملی", upload_to="personnel/national_cards/", blank=True, null=True)
    birth_certificate_file = models.FileField("شناسنامه / کارت دانشجویی / آخرین مدرک", upload_to="personnel/birth_certificates/", blank=True, null=True)
    vehicle_card_file = models.FileField("کارت خودرو (اختیاری)", upload_to="personnel/vehicle_cards/", blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)



    def save(self, *args, **kwargs):
        if not self.personnel_code:
            self.personnel_code = generate_unique_personnel_code()
        super().save(*args, **kwargs)
