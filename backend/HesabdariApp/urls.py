from django.urls import path
from . import views

urlpatterns = [
    
    #index
    path('',views.index_view),
    
    #warehouse
    path('warehouse/',views.warehouse_view),
    path('create_warehouse/',views.create_warehouse_view),   
    path('update_warehouse/<int:id>/',views.update_warehouse_view),
    path('delete_warehouse/<int:id>/',views.delete_warehouse_view),
    
    #product
    path('product/',views.product_view),
    path('create_product/',views.create_product_view),
    path('update_product/<int:id>/',views.update_product_view),
    path('delete_product/<int:id>/',views.delete_product_view),

    #product group
    path('product_group/',views.Product_Group_view),
    path('create_product_group/',views.create_Product_Group_view),
    path('update_product_group/<int:id>/',views.update_Product_Group_view),
    path('delete_product_group/<int:id>/',views.delete_Product_Group_view),

    
    #unit
    path('unit/',views.Unit_view),
    path('create_unit/',views.create_Unit_view),
    path('update_unit/<int:id>/',views.update_Unit_view),
    path('delete_unit/<int:id>/',views.delete_Unit_view),

    
    #consumption type
    path('consumption_type/',views.consumption_type_view),
    path('create_consumption_type/',views.create_consumption_type_view),
    path('update_consumption_type/<int:id>/',views.update_consumption_type_view),
    path('delete_consumption_type/<int:id>/',views.delete_consumption_type_view),

]