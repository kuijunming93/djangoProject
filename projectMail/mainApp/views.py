from django.http import JsonResponse
from django.shortcuts import render
from django.urls import reverse_lazy
from .models import Category, Menu, UserOrder, UserComments
from django.views.generic import ListView
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core import serializers
from django.db.models import Q
import json

# Create your views here.

class MenuListView(ListView):
    # menu_list.html
    model = Menu
    fields = '__all__'
    context_object_name = 'menu_list'
    
    def get_queryset(self):
        return Menu.objects.order_by('category')

class CategoryListView(ListView):
    model = Category
    fields = '__all__'
    context_object_name = 'category_list'

class UserOrderListView(LoginRequiredMixin, ListView):
    model = UserOrder
    fields = '__all__'
    context_object_name = 'order_list'
    paginate_by = 10
    
    def get_queryset(self):
        return UserOrder.objects.filter(user=self.request.user).order_by('-timeOfOrder')

@login_required
def update_order(request):
    data = json.loads(json.loads(request.body)['payload'])
    # payload = json.loads(data)
    payload = data
    totalCost = 0
    itemList = []
    for k,v in payload.items():
        selected = Menu.objects.get(pk=k)
        itemjson = {
            "item": selected.name,
            "price": str(selected.price),
            "quantity": v
        }
        itemList.append(itemjson)
        totalCost += v*selected.price
    if (len(itemList)>0):
        UserOrder.objects.create(
            items=itemList,
            grandTotal = totalCost,
            user = request.user
            )
        return JsonResponse(reverse_lazy('mainApp:order_history'), safe=False)
    else:
        return JsonResponse(reverse_lazy('mainApp:menu'), safe=False)
    
def retrieve_menu(request):
    back = serializers.serialize("json", Menu.objects.all().order_by('category'))
    return JsonResponse(back, safe=False)

def category_detail_view(request, pk):
    query = Menu.objects.filter(category=pk).all().order_by('name')
    for item in query:
        contextType = item.category
    return render(request, 'mainApp/category_detail.html', context={'object_list':query,'context':contextType})

def menu_detail_view(request, pk):
    paginationSize = 2
    selectedObj = Menu.objects.filter(id=pk).all().order_by('name')

    # For leaving new comments
    if request.POST:
        payload = request.POST.dict()
        # For entering new comments
        if (request.user and payload['id'] != "" and payload['userReview'] != "" and payload['rating'] != ""):
            queryGeneral = UserComments.objects.filter(item=
                                Menu.objects.get(pk=int(payload['id']))).all().order_by('time')
            queryCheck = queryGeneral.filter(user=request.user).filter(comment=payload['userReview'])
            if not (queryCheck):
                UserComments.objects.create(
                    user = request.user,
                    item = Menu.objects.get(pk=int(payload['id'])),
                    comment = payload['userReview'],
                    rating = int(payload['rating'])
                ) 
            if len(queryGeneral) > 6:
                deleted = UserComments.objects.filter(item=Menu.objects.get(pk=int(payload['id']))
                    ).all().order_by('time').values('id')[:1]
                UserComments.objects.get(id=int(deleted[0]['id'])).delete()
                print("Deleted" + str(deleted))
    
    next_page = False
    
    # Pagination to show all records
    if request.GET:
        commentsQuery = UserComments.objects.filter(item=selectedObj[0]).all().order_by('time').reverse()
        next_page = False
    else:
        commentsQuery = UserComments.objects.filter(item=selectedObj[0]).all().order_by('time').reverse()[:paginationSize+1]
        if len(commentsQuery) > paginationSize: next_page = True
    # For displaying comment
    comments_output = []
    rating_score = []
    for item in selectedObj:
        itemName = item.name

    try:
        for comment in commentsQuery:
            stars = [1]*int(comment.rating) + [0]*int(5-comment.rating)
            rating_score.append(int(comment.rating))
            output = {
                "user": comment.user,
                "comment": comment.comment,
                "time": comment.time,
                "rating": stars
            }
            comments_output.append(output)
        rating_average = sum(rating_score)/len(rating_score)

        return render(request, 'mainApp/menu_detail.html', context={'detail_list': selectedObj,'contextName': itemName, 
        'contextId': pk, 'comments_list': comments_output, 'rating_average': rating_average, 'next_page': next_page})
    except:
        return render(request, 'mainApp/menu_detail.html', context={'detail_list': selectedObj,'contextName': itemName, 
        'contextId': pk, 'comments_list': [], 'rating_average': 0, 'rating_stars': [], 'next_page': next_page})
    


