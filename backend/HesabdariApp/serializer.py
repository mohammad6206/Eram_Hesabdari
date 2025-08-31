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