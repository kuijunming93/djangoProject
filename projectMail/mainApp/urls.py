from django.urls import path

from .views import HomeView, MenuListView, menu_detail_view, CategoryListView, UserOrderListView, update_order, retrieve_menu, category_detail_view

app_name = 'mainApp'

urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('menu/', MenuListView.as_view(), name='menu'),
    path('menu/<int:pk>', menu_detail_view, name='menu_detail'),
    path('category/', CategoryListView.as_view(), name='category'),
    path('category/<int:pk>', category_detail_view, name='category_detail'),
    path('orderhistory/', UserOrderListView.as_view(), name='order_history'),
    path('service/update_order/', update_order, name='update_order'),
    path('service/retrieve_menu/', retrieve_menu, name='retrieve_menu'),
    
]