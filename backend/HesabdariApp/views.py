# views.py
from rest_framework import viewsets
from .models import Warehouse, Product, ProductGroup, Unit, ConsumptionType,Device
from .serializer import (
    WarehouseSerializer, ProductSerializer,
    ProductGroupSerializer, UnitSerializer,
    ConsumptionTypeSerializer,DeviceSerializer
)
from django.apps import apps
from rest_framework.decorators import api_view
from rest_framework.response import Response

class WarehouseViewSet(viewsets.ModelViewSet):
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer

class ProductGroupViewSet(viewsets.ModelViewSet):
    queryset = ProductGroup.objects.all()
    serializer_class = ProductGroupSerializer

class UnitViewSet(viewsets.ModelViewSet):
    queryset = Unit.objects.all()
    serializer_class = UnitSerializer

class ConsumptionTypeViewSet(viewsets.ModelViewSet):
    queryset = ConsumptionType.objects.all()
    serializer_class = ConsumptionTypeSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer





class DeviceViewSet(viewsets.ModelViewSet):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer





@api_view(['GET'])
def next_number(request, model_name):
    try:
        Model = apps.get_model('HesabdariApp', model_name)  # نام اپ خودت
    except LookupError:
        return Response({"error": "مدل پیدا نشد"}, status=404)

    number_field = "number"
    last_obj = Model.objects.exclude(**{f"{number_field}__isnull": True}) \
                            .exclude(**{number_field: ""}) \
                            .order_by("-id").first()
    if last_obj and str(getattr(last_obj, number_field, "")).isdigit():
        next_number = int(getattr(last_obj, number_field)) + 1
    else:
        next_number = 1

    return Response({"next_number": next_number})





