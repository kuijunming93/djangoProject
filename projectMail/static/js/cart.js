ACTION_ENDPOINT = '/mainApp/service'

//CRSF TOKEN SETUP
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

// AUXILIARY FUNCTIONS
function clearCart(){
    localStorage.clear();
}

//SENDING REQUEST INTO BACKEND
function updateOrder(payload){ //checkout cart
    let url = '/update_order/';
    fetch(ACTION_ENDPOINT + url, {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({
            'payload': payload
        })
    })
    .then((response) => {
        return response.json();
    })
    .then((redirectURL)=>{
        location.replace(redirectURL);
        clearCart();
    })
}

function retrieveMenu(){
    let url = '/retrieve_menu/';
    fetch(ACTION_ENDPOINT + url, {
        method: 'GET',
        headers:{
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        }
    })
    .then((response) => {
        return response.json();
    })
    .then((menuItems)=>{
        if (!localStorage.getItem('cacheMenu'))
            localStorage.setItem("cacheMenu", menuItems);
    })
}

// USER ACTION
function addToCart(productId){
    let imgPath = "";
    let name = "";
    let price = "";
    let cartItems = localStorage.getItem('mainCart');
    if (!localStorage.getItem('cacheMenu')) retrieveMenu();
    let cacheMenu = JSON.parse(localStorage.getItem('cacheMenu'));
    for (let i = 0; i < cacheMenu.length; i++){
        if (cacheMenu[i].pk == productId){
            imgPath = cacheMenu[i].fields.imgPath;
            name = cacheMenu[i].fields.name;
            price = cacheMenu[i].fields.price;
            id = productId;
        }
    }
    cartItems = JSON.parse(cartItems);
    if (cartItems != null){ 
        if (cartItems[productId] == undefined){
            cartItems={...cartItems,
                [productId]:{
                    "qty": 0,
                    "imgPath": imgPath,
                    "name": name,
                    "price": price,
                    "id": id
                }};
        };
        cartItems[productId].qty += 1;
    } else {
        cacheMenu
        cartItems={...cartItems,
            [productId]:{
                "qty": 1,
                "imgPath": imgPath,
                "name": name,
                "price": price,
                "id": id
            }};
    };
    console.log(JSON.stringify(cartItems));
    localStorage.setItem("mainCart", JSON.stringify(cartItems));
    initializeUpdateBtns();
}

function deleteFromCart(productId){
    let cartItems = JSON.parse(localStorage.getItem('mainCart'));
    if (cartItems != null){ 
        if (cartItems[productId] != undefined){
            cartItems[productId].qty -= 1;
            if (cartItems[productId].qty <= 0){
                // cartItems={
                //     [productId]: removedProperty, ...cartItems
                // };
                delete cartItems[productId];
            }
        };
    }
    console.log(JSON.stringify(cartItems));
    localStorage.setItem("mainCart", JSON.stringify(cartItems));
}

function updateCartCount() {
    let cartItems = JSON.parse(localStorage.getItem('mainCart'));
    if(cartItems!=null){
        keys = Object.keys(cartItems)
        payload = {}
        for (let index in keys){
            key = keys[index]
            value = cartItems[key]?.qty
            payload={...payload,
                [key]:value
            };
        }
        localStorage.setItem("cartCount", JSON.stringify(payload));
    }
}

function updateCartUI() {
    updateCartCount();
    let mainCart = localStorage.getItem('cartCount');
    cartItems = JSON.parse(mainCart);
    cartUI = 0
    if (cartItems!=null){
        for (let i = 0; i < Object.values(cartItems).length; i++){
            cartUI += Object.values(cartItems)[i]
        }
    }
    document.querySelector('.cart-btn-class span').textContent = cartUI;
    // animateCart();
}

function updateCartView(){
    //functionality here
    let cartItems = JSON.parse(localStorage.getItem('mainCart'));
    let jsInjection = document.querySelector(".jsInjection");
    if(cartItems && jsInjection){
        console.log(Object.values(cartItems))
        
        jsInjection.innerHTML = '';
        Object.values(cartItems).map(item => {
            jsInjection.innerHTML += `
            <div class="row d-flex align-items-center">
                <span class="col-7">${item.name} <button data-product="${item.id}" data-action= "delete" 
                type="button" class="update-cart" style="font-size: 12px;padding: 0;border: none;background: none;">
                <i class="fa-regular fa-trash-can"></i></button></span>
                <span class="col-2 d-flex justify-content-center">S$${item.price}</span>
                <span class="col-1 d-flex justify-content-center">${item.qty}</span>
                <span class="col-2 d-flex justify-content-center">$${(item.price*item.qty).toFixed(2)}</span>
            </div>
            `
        });
    }
    initializeUpdateBtns();
}

function showHideButton(identifier, booleanShow){
    let injectionIdentifier = ".js-itemToggle-"+identifier.toString();
    console.log(injectionIdentifier);
    let jsInjection = document.querySelector(injectionIdentifier);
    if (jsInjection){
        jsInjection.innerHTML = '';
        if (booleanShow){
            jsInjection.innerHTML = `
                <button data-product="${identifier}" data-action= "add" 
                type="button" class="btn btn-warning update-cart">Add To Cart <i class="fa-solid fa-plus"></i></button>
            `;
        }
    }
}//toggling isworking but data is not transferred for data-product
// shopping cart is not fixed to screen - tofix..

//TODO
/*
-DELETE ONE
*/

// INITIALZING
let checkoutBtn = document.getElementsByClassName('checkout-cart');
let cartButton = document.getElementsByClassName('cart-btn-class');
let toggleButton = document.getElementsByClassName('js-toggle-btn');

function initializeToggleBtns(){
    for (i=0; i < toggleButton.length; i++){
        if(!toggleButton[i].classList.contains('event-assigned')){
            toggleButton[i].classList.add('event-assigned');
            toggleButton[i].addEventListener('click', function(){
                let productId = this.dataset.product;
                let action = this.dataset.action;
                if (action === 'toggle') showHideButton(productId, true);
            }
        )
        }
        // else{
        //     toggleButton[i].classList.remove('event-assigned');
        //     toggleButton[i].addEventListener('click', function(){
        //         let productId = this.dataset.product;
        //         let action = this.dataset.action;
        //         if (action === 'toggle') showHideButton(productId.toString(), false);
        //     }
        // )
        // }
    }
}
initializeToggleBtns();

function initializeUpdateBtns(){
    if (document.querySelector(".checkout-msg") !== null)
        document.querySelector(".checkout-msg").innerHTML = '';
    let updateBtns = document.getElementsByClassName('update-cart');
    for (i=0; i < updateBtns.length; i++){
        if(!updateBtns[i].classList.contains('event-assigned')){
            updateBtns[i].classList.add('event-assigned');
            updateBtns[i].addEventListener('click', function(){
                let productId = this.dataset.product;
                let action = this.dataset.action;
                if (action === 'add') addToCart(productId.toString());
                if (action === 'delete') deleteFromCart(productId.toString());
                animateCartButton();
                updateCartUI();
                updateCartView();
            }
        )
        }
    }
}

function animateCartButton(){
    let cartButton = document.getElementById('cart-button');
    if (cartButton.classList.contains('animateSelect') != true){
        cartButton.classList.add("animateSelect");
    };
    setTimeout(function(){
        cartButton.classList.remove("animateSelect");
    }, 1000);    
}


for (i=0; i < checkoutBtn.length; i++){
    checkoutBtn[i].addEventListener('click', function(){
            let cartItems = JSON.parse(localStorage.getItem('mainCart'));
            if (cartItems!=null){
                keys = Object.keys(cartItems)
                payload = {}
                for (let index in keys){
                    key = keys[index]
                    value = cartItems[key]?.qty
                    payload={...payload,
                        [key]:value
                    };
                }
                updateOrder(JSON.stringify(payload));
            }else{
                document.querySelector(".checkout-msg").innerHTML = `
                <div class="alert alert-warning" role="alert">
                    <span class="" style="color: black;">There is no item in your cart.</span>
                </div>
                `;
            }
        }
    )
}



for (i=0;i<cartButton.length;i++){
    cartButton[i].addEventListener('click', function(){
        updateCartView();
    })
}

initializeUpdateBtns();
updateCartUI();
retrieveMenu();