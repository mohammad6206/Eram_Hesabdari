from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'warehouses', views.WarehouseViewSet, basename='warehouse')
router.register(r'products', views.ProductViewSet, basename='product')
router.register(r'product-groups', views.ProductGroupViewSet, basename='product-group')
router.register(r'units', views.UnitViewSet, basename='unit')
router.register(r'consumption-types', views.ConsumptionTypeViewSet, basename='consumption-type')
router.register(r'devices',views.DeviceViewSet, basename='device')
router.register(r'personnels', views.PersonnelViewSet, basename='personnel')
router.register(r'documents', views.PersonnelDocumentViewSet, basename='document')
router.register(r'sellers', views.SellerViewSet, basename='seller')
router.register(r'buyers', views.BuyerViewSet, basename='buyer')
router.register(r'buy-invoices', views.BuyInvoiceViewSet, basename='buy-invoice')
router.register(r'buy-invoice-items', views.BuyInvoiceItemViewSet, basename='buy-invoice-item')
router.register(r'sell-invoices', views.SellInvoiceViewSet, basename='sell-invoice')
router.register(r'sell-invoice-items', views.SellInvoiceItemViewSet, basename='sell-invoice-item')
router.register(r'inventory-items',views.InventoryItemviewSet, basename='inventory-item')
router.register(r'inventory-out-items',views.InventoryOutItemViewSet, basename='inventory-out-item')

urlpatterns = [
    path('personnels/generate_code/', views.generate_personnel_code, name='generate-personnel-code'),
    path('next-number/<str:model_name>/', views.next_number, name='next-number'),
    path('check-inventory/',views.check_inventory, name='check_inventory'),
    path('product_units/', views.product_units, name='product_units'),
    path('', include(router.urls)),
]
