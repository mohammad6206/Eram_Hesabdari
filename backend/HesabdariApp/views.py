# views.py
from rest_framework import viewsets
from .models import( 
    Warehouse, Product, ProductGroup, Unit,
    ConsumptionType,Device,Personnel,generate_unique_personnel_code,
    Seller,Buyer,BuyInvoice,BuyInvoiceItem,
    SellInvoice,SellInvoiceItem)
from .serializer import (
    WarehouseSerializer, ProductSerializer,
    ProductGroupSerializer, UnitSerializer,
    ConsumptionTypeSerializer,DeviceSerializer,
    PersonnelSerializer,BuyerSerializer,SellerSerializer,
    BuyInvoiceSerializer,BuyInvoiceItemSerializer,
    SellInvoiceItemSerializer,SellInvoiceSerializer
)
from rest_framework.decorators import api_view,action
from django.apps import apps
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



# views.py
class DeviceViewSet(viewsets.ModelViewSet):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer

    @action(detail=True, methods=["get"])
    def products(self, request, pk=None):
        """
        لیست نام کالاهایی که به این دستگاه تعلق دارند
        """
        device = self.get_object()
        product_names = list(device.product_set.values_list("name", flat=True))
        return Response({"device_id": device.id, "device_title": device.title, "product_names": product_names})




class PersonnelViewSet(viewsets.ModelViewSet):
    queryset =Personnel.objects.all()
    serializer_class = PersonnelSerializer




@api_view(["GET"])
def generate_personnel_code(request):
    code = generate_unique_personnel_code()
    return Response({"personnel_code": code})







class SellerViewSet(viewsets.ModelViewSet):
    queryset = Seller.objects.all()
    serializer_class = SellerSerializer



class BuyerViewSet(viewsets.ModelViewSet):
    queryset = Buyer.objects.all()
    serializer_class = BuyerSerializer





class BuyInvoiceViewSet(viewsets.ModelViewSet):
    queryset = BuyInvoice.objects.all()
    serializer_class = BuyInvoiceSerializer


class BuyInvoiceItemViewSet(viewsets.ModelViewSet):
    queryset = BuyInvoiceItem.objects.all()
    serializer_class = BuyInvoiceItemSerializer


class SellInvoiceViewSet(viewsets.ModelViewSet):
    queryset = SellInvoice.objects.all()
    serializer_class = SellInvoiceSerializer


class SellInvoiceItemViewSet(viewsets.ModelViewSet):
    queryset = SellInvoiceItem.objects.all()
    serializer_class = SellInvoiceItemSerializer