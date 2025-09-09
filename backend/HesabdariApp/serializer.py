import json
from rest_framework import serializers
from . import models

class WarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Warehouse
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Product
        fields = '__all__'

class ProductGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ProductGroup
        fields = '__all__'

class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Unit
        fields = '__all__'

class ConsumptionTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ConsumptionType
        fields = '__all__'
            

class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Device
        fields = '__all__'



class PersonnelSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Personnel
        fields = "__all__"


class PersonnelDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.PersonnelDocument
        fields = "__all__"



class SellerSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Seller
        fields = '__all__'


class BuyerSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Buyer
        fields = '__all__'



class BuyInvoiceItemSerializer(serializers.ModelSerializer):
    unit = serializers.PrimaryKeyRelatedField(
        queryset=models.Unit.objects.all(),  # مدل Unit شما
        required=False,
        allow_null=True
    )
    unit_title = serializers.CharField(source="unit.title", read_only=True)  # اضافه شد
    product_name = serializers.CharField(source="product.name", read_only=True)  # 👈 اضافه شد

    class Meta:
        model = models.BuyInvoiceItem
        fields = [
            "id",
            "buy_invoice",
            "row_number",
            "product",
            "product_code",
            "unit",           # اضافه شده
            "unit_title",
            "product_name",
            "quantity",
            "unit_price",
            "total_amount",
            "tax_rate",
            "tax_amount",
            "final_amount",
            "description",
        ]
        read_only_fields = ["row_number", "total_amount", "tax_amount", "final_amount"]


class BuyInvoiceSerializer(serializers.ModelSerializer):
    seller_name = serializers.CharField(source="seller.name", read_only=True)
    buyer_name = serializers.CharField(source="buyer.full_name", read_only=True)
    destination_name = serializers.CharField(source="destination.name", read_only=True)
    
    items = BuyInvoiceItemSerializer(many=True, read_only=True)  # اضافه کردن آیتم‌ها

    seller = serializers.PrimaryKeyRelatedField(queryset=models.Seller.objects.all())
    buyer = serializers.PrimaryKeyRelatedField(queryset=models.Personnel.objects.all())
    destination = serializers.PrimaryKeyRelatedField(queryset=models.Warehouse.objects.all(), required=False, allow_null=True)

    class Meta:
        model = models.BuyInvoice
        fields = [
            "id",
            "invoice_number",
            "seller",
            "seller_name",
            "buyer",
            "buyer_name",
            "destination",
            "destination_name",
            "invoice_file",
            "total_amount",
            "created_at",
            "updated_at",
            "items",  # اضافه شده
        ]
        read_only_fields = ["total_amount"]









class SellInvoiceItemSerializer(serializers.ModelSerializer):

    unit = serializers.PrimaryKeyRelatedField(
        queryset=models.Unit.objects.all(),  # مدل Unit شما
        required=False,
        allow_null=True
    )
    unit_title = serializers.CharField(source="unit.title", read_only=True)  # اضافه شد
    product_name = serializers.CharField(source="product.name", read_only=True)  # 👈 اضافه شد

    class Meta:
        model = models.SellInvoiceItem
        fields = [
            "id",
            "sell_invoice",
            "row_number",
            "product",
            "product_code",
            "unit",
            "unit_title",
            "product_name",           # اضافه شده
            "quantity",
            "unit_price",
            "total_amount",
            "tax_rate",
            "tax_amount",
            "final_amount",
            "description",
        ]
        read_only_fields = ["row_number", "total_amount", "tax_amount", "final_amount"]




class SellInvoiceSerializer(serializers.ModelSerializer):
    seller_name = serializers.CharField(source="seller.name", read_only=True)
    buyer_name = serializers.CharField(source="buyer.name", read_only=True)
    destination_name = serializers.CharField(source="destination.name", read_only=True)
    
    items = SellInvoiceItemSerializer(many=True, read_only=True)  # اضافه کردن آیتم‌ها

    seller = serializers.PrimaryKeyRelatedField(queryset=models.Seller.objects.all())
    buyer = serializers.PrimaryKeyRelatedField(queryset=models.Buyer.objects.all())
    destination = serializers.PrimaryKeyRelatedField(queryset=models.Warehouse.objects.all(), required=False, allow_null=True)

    class Meta:
        model = models.SellInvoice
        fields = [
            "id",
            "invoice_number",
            "seller",
            "seller_name",
            "buyer",
            "buyer_name",
            "destination",
            "destination_name",
            "invoice_file",
            "total_amount",
            "created_at",
            "updated_at",
            "items",
        ]
        read_only_fields = ["total_amount"]   








