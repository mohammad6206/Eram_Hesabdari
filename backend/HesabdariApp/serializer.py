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
        fields = '__all__'



class SellerSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Seller
        fields = '__all__'


class BuyerSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Buyer
        fields = '__all__'




class BuyInvoiceSerializer(serializers.ModelSerializer):

    seller = serializers.CharField(source="seller.name", read_only=True)
    buyer = serializers.CharField(source="buyer.full_name", read_only=True)
    destination = serializers.CharField(source="destination.name", read_only=True)

    class Meta:
        model = models.BuyInvoice
        fields = [
            "id",
            "invoice_number",
            "seller",
            "buyer",
            "destination",
            "invoice_file",
            "total_amount",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["total_amount", "created_at", "updated_at"]




class BuyInvoiceItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.BuyInvoiceItem
        fields = [
            "id",
            "buy_invoice",
            "row_number",
            "product",
            "product_code",
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

    seller = serializers.CharField(source="seller.name", read_only=True)
    buyer = serializers.CharField(source="buyer.name", read_only=True)
    destination = serializers.CharField(source="destination.name", read_only=True)


    class Meta:
        model = models.SellInvoice
        fields = [
            "id",
            "invoice_number",
            "seller",
            "buyer",
            "destination",
            "invoice_file",
            "total_amount",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["total_amount", "created_at", "updated_at"]




class SellInvoiceItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.SellInvoiceItem
        fields = [
            "id",
            "sell_invoice",
            "row_number",
            "product",
            "product_code",
            "quantity",
            "unit_price",
            "total_amount",
            "tax_rate",
            "tax_amount",
            "final_amount",
            "description",
        ]
        read_only_fields = ["row_number", "total_amount", "tax_amount", "final_amount"]






