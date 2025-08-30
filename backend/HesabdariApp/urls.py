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

urlpatterns = [
    path('personnels/generate_code/', views.generate_personnel_code, name='generate-personnel-code'),
    path('next-number/<str:model_name>/', views.next_number, name='next-number'),
    path('', include(router.urls)),
]
