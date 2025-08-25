from rest_framework.response import Response
from rest_framework.decorators import api_view

# Create your views here.

@api_view(['GET'])
def index_view(request):

    return Response({'message': 'Hello, world!'})



#warehouse_views
def warehouse_view(request):
    return Response({'message': 'Hello, warehouse!'})

def create_warehouse_view(request):
    return Response({'message': 'Hello, create warehouse!'})

def update_warehouse_view(request):
    return Response({'message': 'Hello, update warehouse!'})

def delete_warehouse_view(request):
    return Response({'message': 'Hello, delete warehouse!'})



#product_views
def product_view(request):  
    return Response({'message': 'Hello, product!'})

def create_product_view(request):
    return Response({'message': 'Hello, create product!'})

def update_product_view(request):
    return Response({'message': 'Hello, update product!'})

def delete_product_view(request):
    return Response({'message': 'Hello, delete product!'})



#product_Group_views
def Product_Group_view(request):
    return Response({'message': 'Hello, product type!'})

def create_Product_Group_view(request):

    return Response({'message': 'Hello, create product type!'})

def update_Product_Group_view(request):
    return Response({'message': 'Hello, update product type!'})

def delete_Product_Group_view(request):
    return Response({'message': 'Hello, delete product type!'})




#Unit_views
def Unit_view(request): 
    return Response({'message': 'Hello, unit!'})

def create_Unit_view(request):
    return Response({'message': 'Hello, create unit!'})

def update_Unit_view(request):
    return Response({'message': 'Hello, update unit!'})

def delete_Unit_view(request):
    return Response({'message': 'Hello, delete unit!'})



#ConsumptionType_views

def consumption_type_view(request):
    return Response({'message': 'Hello, consumtion!'})

def create_consumption_type_view(request):
    return Response({'message': 'Hello, create consumtion!'})

def update_consumption_type_view(request):
    return Response({'message': 'Hello, update consumtion!'})

def delete_consumption_type_view(request):
    return Response({'message': 'Hello, delete consumtion!'})
