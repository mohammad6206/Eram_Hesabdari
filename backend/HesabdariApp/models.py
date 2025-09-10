import random
from django.db import models
from django.db.models import Sum
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .resize import resize_and_crop_high_quality
import os


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


    number = models.CharField("شماره انبار", max_length=50, unique=True, blank=True, null=True)
    name = models.CharField("نام انبار", max_length=100)
    phone = models.CharField("تلفن", max_length=20, blank=True, null=True)

    def __str__(self):
        return f"{self.number} - {self.name}"


class ProductGroup(AutoNumberMixin, models.Model):
    number_field = "number"


    number = models.CharField("شماره گروه", max_length=50, unique=True, blank=True, null=True)
    title = models.CharField("عنوان گروه", max_length=100, unique=True)

    class Meta:
        verbose_name = "گروه کالا"
        verbose_name_plural = "گروه کالاها"

    def __str__(self):
        return self.title


class Unit(AutoNumberMixin, models.Model):
    number_field = "number"


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
    description = models.TextField("توضیحات", blank=True, null=True)

    created_at = models.DateTimeField("تاریخ ایجاد", blank=True, null=True)
    updated_at = models.DateTimeField("تاریخ ویرایش", blank=True, null=True)


    def __str__(self):
        return f"{self.number} - {self.name}"


class ConsumptionType(AutoNumberMixin, models.Model):
    number_field = "number"


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






def personnel_document_upload_to(instance, filename):
   
    personnel_code = instance.personnel.personnel_code or "unknown"
    doc_type = instance.doc_type
    return os.path.join("personnel", doc_type, personnel_code, filename)


class Personnel(models.Model):
    personnel_code = models.CharField("کد پرسنلی", max_length=5, unique=True, blank=True)
    full_name = models.CharField("نام و نام خانوادگی", max_length=200)
    national_id = models.CharField("کد ملی", max_length=20, blank=True, null=True)
    father_name = models.CharField("نام پدر", max_length=100, blank=True, null=True)
    address = models.TextField("آدرس", blank=True, null=True)
    postal_code = models.CharField("کد پستی", max_length=20, blank=True, null=True)
    email = models.EmailField("ایمیل", blank=True, null=True)
    birth_certificate_number = models.CharField("شماره شناسنامه", max_length=50, blank=True, null=True)
    position = models.CharField("سمت", max_length=100, blank=True, null=True)

    created_at = models.DateTimeField("تاریخ ایجاد", blank=True, null=True)
    updated_at = models.DateTimeField("تاریخ ویرایش", blank=True, null=True)

    def __str__(self):
        return f"{self.full_name} ({self.personnel_code})"


class PersonnelDocument(models.Model):
    DOC_TYPES = [
        ("national_card", "کارت ملی"),
        ("birth_certificate", "شناسنامه / کارت دانشجویی"),
        ("vehicle_card", "کارت خودرو"),
    ]

    personnel = models.ForeignKey(Personnel, on_delete=models.CASCADE, related_name="documents")
    doc_type = models.CharField(max_length=50, choices=DOC_TYPES)
    file = models.FileField(upload_to=personnel_document_upload_to)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.personnel.full_name} - {self.get_doc_type_display()}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)  # اول فایل ذخیره بشه

    # فقط روی عکس‌ها ریسایز کنیم
        if self.file and self.file.name.lower().endswith(('.png', '.jpg', '.jpeg')):
            file_path = self.file.path
        # فریم هدف: 800x600
        resize_and_crop_high_quality(file_path, file_path, size=(800, 600))




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


    created_at = models.DateTimeField("تاریخ ایجاد", blank=True, null=True)
    updated_at = models.DateTimeField("تاریخ ویرایش", blank=True, null=True)

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

    created_at = models.DateTimeField("تاریخ ایجاد", blank=True, null=True)
    updated_at = models.DateTimeField("تاریخ ویرایش", blank=True, null=True)

    def __str__(self):
        return self.name



class BuyInvoice(models.Model):
    invoice_number = models.CharField(max_length=50, unique=True)
    seller = models.ForeignKey('Seller', on_delete=models.CASCADE)
    buyer = models.ForeignKey('Personnel', on_delete=models.CASCADE)
    destination = models.ForeignKey('Warehouse', on_delete=models.SET_NULL, null=True)
    invoice_file = models.FileField(upload_to='buy_invoice/', null=True, blank=True)
    total_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)

    created_at = models.DateTimeField("تاریخ ایجاد", blank=True, null=True)
    updated_at = models.DateTimeField("تاریخ ویرایش", blank=True, null=True)

    def __str__(self):
        return f"Invoice #{self.invoice_number} - {self.seller.name}"

class BuyInvoiceItem(models.Model):
    buy_invoice = models.ForeignKey(BuyInvoice, on_delete=models.CASCADE, related_name='items')
    row_number = models.PositiveIntegerField()
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    product_code = models.CharField(max_length=100, blank=True, null=True)
    
    unit = models.ForeignKey('Unit', on_delete=models.SET_NULL, null=True, blank=True)  # اضافه شد
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    
    unit_price = models.DecimalField(max_digits=15, decimal_places=2)
    total_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2)
    tax_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    final_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    description = models.TextField(blank=True, null=True)

    def save(self, *args, **kwargs):
        # محاسبه مقادیر بر اساس تعداد و مبلغ واحد
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
        return f"{self.product.name} - {self.unit.title if self.unit else ''} - Row {self.row_number}"


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

    created_at = models.DateTimeField("تاریخ ایجاد", blank=True, null=True)
    updated_at = models.DateTimeField("تاریخ ویرایش", blank=True, null=True)
    def __str__(self):
        return f"Invoice #{self.invoice_number} - {self.seller.name}"


class SellInvoiceItem(models.Model):
    sell_invoice = models.ForeignKey(SellInvoice, on_delete=models.CASCADE, related_name='items')
    row_number = models.PositiveIntegerField()
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    unit = models.ForeignKey('Unit', on_delete=models.CASCADE, null=True, blank=True)  # واحد کالا
    product_code = models.CharField(max_length=100, blank=True, null=True)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)  # تعداد
    unit_price = models.DecimalField(max_digits=15, decimal_places=2)
    total_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2)
    tax_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    final_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    description = models.TextField(blank=True, null=True)

    def save(self, *args, **kwargs):
        # محاسبه مقادیر
        self.total_amount = self.quantity * self.unit_price
        self.tax_amount = self.total_amount * (self.tax_rate / 100)
        self.final_amount = self.total_amount + self.tax_amount

        # تنظیم ردیف اگر وجود نداشته باشه
        if not self.row_number:
            last_row = SellInvoiceItem.objects.filter(sell_invoice=self.sell_invoice).order_by('-row_number').first()
            self.row_number = (last_row.row_number + 1) if last_row else 1

        super().save(*args, **kwargs)

    class Meta:
        ordering = ['row_number']

    def __str__(self):
        return f"{self.product.name} - Row {self.row_number}"


# سگنال برای بروزرسانی total_amount فاکتور بعد از ثبت یا حذف آیتم
@receiver([post_save, post_delete], sender=SellInvoiceItem)
def update_sell_invoice_total(sender, instance, **kwargs):
    invoice = instance.sell_invoice
    invoice.total_amount = invoice.items.aggregate(total=Sum('final_amount'))['total'] or 0
    invoice.save()









class InventoryItem(models.Model):
    buy_invoice_item = models.ForeignKey(
        BuyInvoiceItem, on_delete=models.CASCADE, related_name="inventory_items"
    )
    product_name = models.CharField("نام کالا", max_length=200)
    product_code = models.CharField("کد اختصاصی", max_length=100)
    invoice_number = models.CharField("شماره فاکتور", max_length=50)
    serial_number = models.CharField("سریال کالا", max_length=150, unique=True)
    warehouse = models.ForeignKey("Warehouse", verbose_name="انبار مقصد", on_delete=models.CASCADE)

    class Meta:
        verbose_name = "کالای ورودی به انبار"
        verbose_name_plural = "کالاهای ورودی به انبار"
        indexes = [
            models.Index(fields=["product_code", "invoice_number"]),
            models.Index(fields=["serial_number"]),
        ]

    def __str__(self):
        return f"{self.product_name} | {self.serial_number} | {self.warehouse.name}"



from django.db.models.signals import post_save
from django.dispatch import receiver

# سگنال برای ایجاد آیتم‌های انبار بعد از ثبت BuyInvoiceItem
@receiver(post_save, sender=BuyInvoiceItem)
def create_inventory_items(sender, instance, created, **kwargs):
    if created:
        # تعداد هر آیتم
        qty = int(instance.quantity)
        
        for i in range(1, qty + 1):
            # سریال کالا: کد اختصاصی + شماره فاکتور + شماره سریال
            serial = f"{instance.product_code}{instance.buy_invoice.invoice_number} - {i}"
            
            # ایجاد آیتم انبار
            InventoryItem.objects.create(
                buy_invoice_item=instance,
                product_name=instance.product.name,
                product_code=instance.product_code,
                invoice_number=instance.buy_invoice.invoice_number,
                serial_number=serial,
                warehouse=instance.buy_invoice.destination
            )


from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=BuyInvoice)
def update_inventory_items_warehouse(sender, instance, **kwargs):
    # بررسی کنیم اگر انبار مقصد تغییر کرده باشد
    inventory_items = InventoryItem.objects.filter(buy_invoice_item__buy_invoice=instance)
    for item in inventory_items:
        if item.warehouse != instance.destination:
            item.warehouse = instance.destination
            item.save()
