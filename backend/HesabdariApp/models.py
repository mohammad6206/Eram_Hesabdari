from django.db import models

class Warehouse(models.Model):
    code = models.CharField("کد انبار", max_length=50, unique=True)
    name = models.CharField("نام انبار", max_length=100)
    phone = models.CharField("تلفن", max_length=20, blank=True, null=True)

    def __str__(self):
        return f"{self.code} - {self.name}"



class ProductGroup(models.Model):
    title = models.CharField("عنوان گروه", max_length=100, unique=True)

    def __str__(self):
        return self.title
    

class Unit(models.Model):
    title = models.CharField("عنوان واحد", max_length=100, unique=True)

    def __str__(self):
        return self.title

 
 

class Product(models.Model):
    code = models.CharField("کد کالا", max_length=50, unique=True)
    name = models.CharField("نام کالا", max_length=200)
    group = models.ForeignKey("ProductGroup", verbose_name="گروه کالا", on_delete=models.CASCADE)
    unit = models.ForeignKey("Unit", verbose_name="واحد کالا", on_delete=models.CASCADE)
    registration_date = models.DateField("تاریخ ثبت", auto_now_add=True)
    min_quantity = models.PositiveIntegerField("حداقل تعداد", default=0)
    max_quantity = models.PositiveIntegerField("حداکثر تعداد", default=0)
    expiration_date = models.DateField("تاریخ انقضا", null=True, blank=True)
    purchase_price = models.DecimalField("قیمت خرید", max_digits=12, decimal_places=2, default=0)
    sale_price = models.DecimalField("قیمت فروش", max_digits=12, decimal_places=2, default=0)
    warehouse = models.ForeignKey(Warehouse,verbose_name="مکان کالا",on_delete=models.SET_NULL,null=True,blank=True)
    discount_percent = models.DecimalField("درصد تخفیف فروش", max_digits=5, decimal_places=2, default=0)
    model = models.CharField("مدل", max_length=100, blank=True, null=True)
    tax_percent = models.DecimalField("درصد مالیات", max_digits=5, decimal_places=2, default=0)
    duty_percent = models.DecimalField("درصد عوارض", max_digits=5, decimal_places=2, default=0)
    final_tax_percent = models.DecimalField("مالیات بر مصرف نهایی", max_digits=5, decimal_places=2, default=0)  
    description = models.TextField("توضیحات", blank=True, null=True)

    def __str__(self):
        return f"{self.code} - {self.name}"



class ConsumptionType(models.Model):
    title = models.CharField("عنوان نوع مصرف", max_length=100, unique=True)

    def __str__(self):
        return self.title
    
