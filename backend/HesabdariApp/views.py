# views.py
from rest_framework import viewsets
from .models import Warehouse, Product, ProductGroup, Unit, ConsumptionType
from .serializer import (
    WarehouseSerializer, ProductSerializer,
    ProductGroupSerializer, UnitSerializer,
    ConsumptionTypeSerializer
)

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
