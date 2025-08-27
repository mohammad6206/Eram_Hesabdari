from django.db import models
import uuid


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
    group = models.ForeignKey("ProductGroup", verbose_name="گروه کالا", on_delete=models.CASCADE)
    unit = models.ForeignKey("Unit", verbose_name="واحد کالا", on_delete=models.CASCADE)
    registration_date = models.DateField("تاریخ ثبت", null=True, blank=True)
    min_quantity = models.PositiveIntegerField("حداقل تعداد", default=0)
    max_quantity = models.PositiveIntegerField("حداکثر تعداد", default=0)
    expiration_date = models.DateField("تاریخ انقضا", null=True, blank=True)
    purchase_price = models.DecimalField("قیمت خرید", max_digits=12, decimal_places=2, default=0)
    sale_price = models.DecimalField("قیمت فروش", max_digits=12, decimal_places=2, default=0)
    warehouse = models.ForeignKey(Warehouse, verbose_name="مکان کالا", on_delete=models.SET_NULL, null=True, blank=True)
    discount_percent = models.DecimalField("درصد تخفیف فروش", max_digits=5, decimal_places=2, default=0)
    model = models.CharField("مدل", max_length=100, blank=True, null=True)
    tax_percent = models.DecimalField("درصد مالیات", max_digits=5, decimal_places=2, default=0)
    duty_percent = models.DecimalField("درصد عوارض", max_digits=5, decimal_places=2, default=0)
    final_tax_percent = models.DecimalField("مالیات بر مصرف نهایی", max_digits=5, decimal_places=2, default=0)
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
    
