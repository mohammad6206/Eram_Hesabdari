from django.db import models
import uuid
import random
from django.db import models
from django.db.models import Sum
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver


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
    product_code = models.CharField("کد اختصاصی", max_length=100, blank=True, null=True)  # <-- همان کد اختصاصی
    group = models.ForeignKey("ProductGroup", verbose_name="گروه کالا", on_delete=models.CASCADE)
    registration_date = models.DateField("تاریخ ثبت", null=True, blank=True)
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
    position=models.CharField("سمت", max_length=100, blank=True, null=True)
    
    national_card_file = models.FileField("کارت ملی", upload_to="personnel/national_cards/", blank=True, null=True)
    birth_certificate_file = models.FileField("شناسنامه / کارت دانشجویی / آخرین مدرک", upload_to="personnel/birth_certificates/", blank=True, null=True)
    vehicle_card_file = models.FileField("کارت خودرو (اختیاری)", upload_to="personnel/vehicle_cards/", blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)



    def save(self, *args, **kwargs):
        if not self.personnel_code:
            self.personnel_code = generate_unique_personnel_code()
        super().save(*args, **kwargs)





class Seller(models.Model):
    number_field = "number"

    number = models.CharField("شماره تامین کننده", max_length=50, unique=True, blank=True, null=True)
    name = models.CharField("نام تامین‌کننده", max_length=255)
    national_id = models.CharField("شناسه ملی", max_length=20, blank=True, null=True)
    economic_code = models.CharField("کد اقتصادی", max_length=50, blank=True, null=True)
    postal_code = models.CharField("کد پستی", max_length=20, blank=True, null=True)
    city = models.CharField("شهر فروشگاه", max_length=100, blank=True, null=True)
    address = models.TextField("آدرس", blank=True, null=True)
    email = models.EmailField("ایمیل", blank=True, null=True)
    phone = models.CharField("شماره تماس", max_length=20, blank=True, null=True)
    website = models.URLField("آدرس وبسایت", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name






class Buyer(models.Model):
    number_field = "number"

    number = models.CharField("شماره خریدار", max_length=50, unique=True, blank=True, null=True)
    name = models.CharField("نام مرکز / نام شخص (حقیقی/حقوقی)", max_length=255)
    contact_phone = models.CharField("شماره تماس مرکز / شماره تماس شخص در ارتباط", max_length=20, blank=True, null=True)
    national_id = models.CharField("شناسه ملی", max_length=20, blank=True, null=True)
    economic_code = models.CharField("کد اقتصادی", max_length=50, blank=True, null=True)
    postal_code = models.CharField("کد پستی", max_length=20, blank=True, null=True)
    address = models.TextField("آدرس", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name



class BuyInvoice(models.Model):
    invoice_number = models.CharField(max_length=50, unique=True)
    seller = models.ForeignKey('Seller', on_delete=models.CASCADE)
    buyer = models.ForeignKey('Personnel', on_delete=models.CASCADE)
    destination = models.ForeignKey('Warehouse', on_delete=models.SET_NULL, null=True)
    invoice_file = models.FileField(upload_to='buy_invoice/', null=True, blank=True)
    total_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Invoice #{self.invoice_number} - {self.seller.name}"


class BuyInvoiceItem(models.Model):
    buy_invoice = models.ForeignKey(BuyInvoice, on_delete=models.CASCADE, related_name='items')
    row_number = models.PositiveIntegerField()
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    product_code = models.CharField(max_length=100, blank=True, null=True)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    unit_price = models.DecimalField(max_digits=15, decimal_places=2)
    total_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2)
    tax_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    final_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    description = models.TextField(blank=True, null=True)

    def save(self, *args, **kwargs):
        self.total_amount = self.quantity * self.unit_price
        self.tax_amount = self.total_amount * (self.tax_rate / 100)
        self.final_amount = self.total_amount + self.tax_amount

        if not self.row_number:
            last_row = BuyInvoiceItem.objects.filter(buy_invoice=self.buy_invoice).order_by('-row_number').first()
            self.row_number = (last_row.row_number + 1) if last_row else 1

        super().save(*args, **kwargs)

    class Meta:
        ordering = ['row_number']

    def __str__(self):
        return f"{self.product.name} - Row {self.row_number}"


# سگنال برای بروزرسانی total_amount فاکتور بعد از ثبت یا حذف آیتم
@receiver([post_save, post_delete], sender=BuyInvoiceItem)
def update_invoice_total(sender, instance, **kwargs):
    invoice = instance.buy_invoice
    invoice.total_amount = invoice.items.aggregate(total=Sum('final_amount'))['total'] or 0
    invoice.save()





class SellInvoice(models.Model):
    invoice_number = models.CharField(max_length=50, unique=True)
    buyer = models.ForeignKey('Buyer', on_delete=models.CASCADE)
    seller = models.ForeignKey('Seller', on_delete=models.CASCADE)
    destination = models.ForeignKey('Warehouse', on_delete=models.SET_NULL, null=True)
    invoice_file = models.FileField(upload_to='sell_invoice/', null=True, blank=True)
    total_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Invoice #{self.invoice_number} - {self.seller.name}"

class SellInvoiceItem(models.Model):
    sell_invoice = models.ForeignKey(SellInvoice, on_delete=models.CASCADE, related_name='items')
    row_number = models.PositiveIntegerField()
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    product_code = models.CharField(max_length=100, blank=True, null=True)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    unit_price = models.DecimalField(max_digits=15, decimal_places=2)
    total_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2)
    tax_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    final_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    description = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['row_number']

    def save(self, *args, **kwargs):
        # محاسبه خودکار مبالغ
        self.total_amount = self.quantity * self.unit_price
        self.tax_amount = self.total_amount * (self.tax_rate / 100)
        self.final_amount = self.total_amount + self.tax_amount

        # تعیین ردیف خودکار
        if not self.row_number:
            last_row = SellInvoiceItem.objects.filter(sell_invoice=self.sell_invoice).order_by('-row_number').first()
            self.row_number = (last_row.row_number + 1) if last_row else 1

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.product.name} - Row {self.row_number}"


# سیگنال برای بروزرسانی total_amount فاکتور بعد از ثبت یا حذف آیتم
@receiver([post_save, post_delete], sender=SellInvoiceItem)
def update_invoice_total(sender, instance, **kwargs):
    invoice = instance.sell_invoice
    invoice.total_amount = invoice.items.aggregate(total=Sum('final_amount'))['total'] or 0
    invoice.save()
