// Data Storage
let products = [];
let cart = [];
let orders = [];
let settings = {
    homeDeliveryPrice: 500,
    municipalityDeliveryPrice: 300,
    contactInfo: {
        phone: '0123456789',
        instagram: 'https://instagram.com/shomoukh',
        facebook: 'https://facebook.com/shomoukh',
        tiktok: 'https://tiktok.com/@shomoukh'
    }
};

// Algerian Wilayas
const wilayas = [
    'أدرار', 'الشلف', 'الأغواط', 'أم البواقي', 'باتنة', 'بجاية', 'بسكرة', 'بشار', 'البليدة', 'البويرة',
    'تمنراست', 'تبسة', 'تلمسان', 'تيارت', 'تيزي وزو', 'الجزائر', 'الجلفة', 'جيجل', 'سطيف', 'سعيدة',
    'سكيكدة', 'سيدي بلعباس', 'عنابة', 'قالمة', 'قسنطينة', 'المدية', 'مستغانم', 'المسيلة', 'معسكر', 'ورقلة',
    'وهران', 'البيض', 'إليزي', 'برج بوعريريج', 'بومرداس', 'الطارف', 'تندوف', 'تيسمسيلت', 'الوادي', 'خنشلة',
    'سوق أهراس', 'تيبازة', 'ميلة', 'عين الدفلى', 'النعامة', 'عين تموشنت', 'غرداية', 'غليزان'
];

// DOM Elements
const productsContainer = document.getElementById('productsContainer');
const cartIcon = document.getElementById('cartIcon');
const cartModal = document.getElementById('cartModal');
const closeCartModal = document.getElementById('closeCartModal');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const closeCheckoutModal = document.getElementById('closeCheckoutModal');
const backToCartBtn = document.getElementById('backToCartBtn');
const checkoutForm = document.getElementById('checkoutForm');
const wilayaSelect = document.getElementById('wilaya');
const homeDelivery = document.getElementById('homeDelivery');
const municipalityDelivery = document.getElementById('municipalityDelivery');
const municipalityGroup = document.getElementById('municipalityGroup');
const productsTotalCheckout = document.getElementById('productsTotalCheckout');
const deliveryFee = document.getElementById('deliveryFee');
const orderTotal = document.getElementById('orderTotal');
const confirmationModal = document.getElementById('confirmationModal');
const continueShopping = document.getElementById('continueShopping');
const adminPanel = document.getElementById('adminPanel');
const phoneNumber = document.getElementById('phoneNumber');

// Admin Elements
const adminLoginModal = document.getElementById('adminLoginModal');
const adminLoginForm = document.getElementById('adminLoginForm');
const closeAdminLoginModal = document.getElementById('closeAdminLoginModal');
const logoutBtn = document.getElementById('logoutBtn');
const productsList = document.getElementById('productsList');
const addProductBtn = document.getElementById('addProductBtn');
const productModal = document.getElementById('productModal');
const closeProductModal = document.getElementById('closeProductModal');
const productForm = document.getElementById('productForm');
const productModalTitle = document.getElementById('productModalTitle');
const productId = document.getElementById('productId');
const homeDeliveryPrice = document.getElementById('homeDeliveryPrice');
const municipalityDeliveryPrice = document.getElementById('municipalityDeliveryPrice');
const saveDeliverySettings = document.getElementById('saveDeliverySettings');
const adminPhone = document.getElementById('adminPhone');
const adminInstagram = document.getElementById('adminInstagram');
const adminFacebook = document.getElementById('adminFacebook');
const adminTiktok = document.getElementById('adminTiktok');
const saveContactInfo = document.getElementById('saveContactInfo');
const ordersList = document.getElementById('ordersList');

// Initialize the application
function init() {
    loadDataFromLocalStorage();
    populateWilayaOptions();
    renderProducts();
    updateCartCount();
    displayContactInfo();
    
    // Add event listeners with debugging
    console.log('Adding event listeners...');
    
    // Ensure cartIcon exists before adding event listener
    if (cartIcon) {
        console.log('Cart icon found. Adding click event.');
        
        // Add event listener directly to the icon or its parent
        const cartIconParent = document.querySelector('.cart-icon');
        if (cartIconParent) {
            cartIconParent.addEventListener('click', function(e) {
                console.log('Cart icon clicked!');
                openCartModal();
            });
        }
    } else {
        console.error('Cart icon not found!');
    }
    
    // Other event listeners
    if (closeCartModal) closeCartModal.addEventListener('click', closeModal);
    if (closeCheckoutModal) closeCheckoutModal.addEventListener('click', closeModal);
    if (backToCartBtn) backToCartBtn.addEventListener('click', backToCart);
    if (checkoutBtn) checkoutBtn.addEventListener('click', proceedToCheckout);
    if (homeDelivery) homeDelivery.addEventListener('change', updateDeliveryOption);
    if (municipalityDelivery) municipalityDelivery.addEventListener('change', updateDeliveryOption);
    if (checkoutForm) checkoutForm.addEventListener('submit', placeOrder);
    if (continueShopping) continueShopping.addEventListener('click', closeModal);
    
    // Admin-related event listeners
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.altKey && e.key === 'a') {
            openAdminLoginModal();
        }
    });
    
    if (closeAdminLoginModal) closeAdminLoginModal.addEventListener('click', closeModal);
    if (adminLoginForm) adminLoginForm.addEventListener('submit', adminLogin);
    if (logoutBtn) logoutBtn.addEventListener('click', adminLogout);
    if (addProductBtn) addProductBtn.addEventListener('click', openAddProductModal);
    if (closeProductModal) closeProductModal.addEventListener('click', closeModal);
    if (productForm) productForm.addEventListener('submit', saveProduct);
    if (saveDeliverySettings) saveDeliverySettings.addEventListener('click', saveDeliveryPrices);
    if (saveContactInfo) saveContactInfo.addEventListener('click', saveContactInformation);
    
    // Pre-populate admin form fields
    if (settings) {
        if (homeDeliveryPrice) homeDeliveryPrice.value = settings.homeDeliveryPrice;
        if (municipalityDeliveryPrice) municipalityDeliveryPrice.value = settings.municipalityDeliveryPrice;
        
        if (settings.contactInfo) {
            if (adminPhone) adminPhone.value = settings.contactInfo.phone;
            if (adminInstagram) adminInstagram.value = settings.contactInfo.instagram;
            if (adminFacebook) adminFacebook.value = settings.contactInfo.facebook;
            if (adminTiktok) adminTiktok.value = settings.contactInfo.tiktok;
        }
    }
    
    console.log('Initialization completed');
}

// Populate Wilaya dropdown
function populateWilayaOptions() {
    wilayas.forEach(wilaya => {
        const option = document.createElement('option');
        option.value = wilaya;
        option.textContent = wilaya;
        wilayaSelect.appendChild(option);
    });
}

// Load data from local storage
function loadDataFromLocalStorage() {
    const savedProducts = localStorage.getItem('products');
    const savedCart = localStorage.getItem('cart');
    const savedOrders = localStorage.getItem('orders');
    const savedSettings = localStorage.getItem('settings');
    
    if (savedProducts) products = JSON.parse(savedProducts);
    if (savedCart) cart = JSON.parse(savedCart);
    if (savedOrders) orders = JSON.parse(savedOrders);
    if (savedSettings) settings = JSON.parse(savedSettings);
    
    // Initialize with demo products if none exist
    if (products.length === 0) {
        products = [
            {
                id: 1,
                name: 'فستان سهرة أنيق',
                price: 5000,
                image: 'https://i.pinimg.com/564x/f9/4c/cf/f94ccf1b5ff2ef4ae3c71e99f6c21acd.jpg'
            },
            {
                id: 2,
                name: 'فستان زفاف فاخر',
                price: 15000,
                image: 'https://i.pinimg.com/564x/9c/d2/7d/9cd27df9971abe862133e2a7a5d189f8.jpg'
            },
            {
                id: 3,
                name: 'فستان سهرة مطرز',
                price: 7500,
                image: 'https://i.pinimg.com/564x/e2/1e/25/e21e25ba7f804d42bd3a4c5f3c07f7a1.jpg'
            },
            {
                id: 4,
                name: 'فستان تقليدي جزائري',
                price: 8200,
                image: 'https://i.pinimg.com/564x/e0/f9/b3/e0f9b3e094e29a7a13e40bd7e9c4dbb8.jpg'
            }
        ];
        saveProductsToLocalStorage();
    }
}

// Save data to local storage
function saveProductsToLocalStorage() {
    localStorage.setItem('products', JSON.stringify(products));
}

function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function saveOrdersToLocalStorage() {
    localStorage.setItem('orders', JSON.stringify(orders));
}

function saveSettingsToLocalStorage() {
    localStorage.setItem('settings', JSON.stringify(settings));
}

// Render products on the page
function renderProducts() {
    productsContainer.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        
        productCard.innerHTML = `
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">${product.price} دج</p>
                <button class="add-to-cart" data-id="${product.id}">إضافة إلى السلة</button>
            </div>
        `;
        
        productsContainer.appendChild(productCard);
    });
    
    // Add event listeners to the "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Add a product to the cart
function addToCart(event) {
    const productId = parseInt(event.target.dataset.id);
    const product = products.find(p => p.id === productId);
    
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        saveCartToLocalStorage();
        updateCartCount();
        
        // إضافة تأثير بصري محسن عند الإضافة للسلة
        cartIcon.classList.add('added');
        
        // تحريك السلة للفت الانتباه
        const cartIconParent = document.querySelector('.cart-icon');
        if (cartIconParent) {
            cartIconParent.classList.add('shake');
            setTimeout(() => {
                cartIconParent.classList.remove('shake');
            }, 500);
        }
        
        setTimeout(() => {
            cartIcon.classList.remove('added');
        }, 600);
        
        // إظهار رسالة تأكيد للمستخدم
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = "✓ تمت الإضافة";
        button.style.backgroundColor = 'var(--bronze)';
        button.style.color = 'var(--matte-black)';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
            button.style.color = '';
        }, 1000);
    }
}

// Update the cart count in the header
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
}

// Open the cart modal
function openCartModal() {
    console.log('Opening cart modal...');
    
    if (!cartModal) {
        console.error('Cart modal not found!');
        return;
    }
    
    renderCartItems();
    cartModal.style.display = 'flex';
    
    // إضافة تأخير بسيط لضمان التنفيذ السلس للانتقالات
    setTimeout(() => {
        cartModal.classList.add('active');
    }, 10);
    
    document.body.style.overflow = 'hidden';
    
    // تسجيل حدث فتح السلة للتتبع
    console.log('Cart opened successfully');
}

// Close any open modal
function closeModal() {
    const modals = [cartModal, checkoutModal, confirmationModal, adminLoginModal, productModal];
    
    modals.forEach(modal => {
        if (modal && modal.style.display === 'flex') {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    });
    
    document.body.style.overflow = 'auto';
}

// Render the items in the cart
function renderCartItems() {
    // إظهار مؤشر التحميل
    const cartLoading = document.getElementById('cartLoading');
    if (cartLoading) {
        cartLoading.style.display = 'block';
        cartItems.innerHTML = '';
    }
    
    // تأخير بسيط لإظهار التحميل (للتأثير البصري فقط)
    setTimeout(() => {
        if (cartLoading) {
            cartLoading.style.display = 'none';
        }
        
        cartItems.innerHTML = '';
        let total = 0;
        
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-basket" style="font-size: 3rem; color: var(--bronze); margin-bottom: 15px;"></i>
                    <p>سلة المشتريات فارغة</p>
                    <p style="font-size: 0.9rem; opacity: 0.7; margin-top: 10px;">أضف بعض المنتجات الرائعة!</p>
                </div>
            `;
            checkoutBtn.disabled = true;
            checkoutBtn.style.opacity = '0.5';
        } else {
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-info">
                        <h3 class="cart-item-name">${item.name}</h3>
                        <p class="cart-item-price">${item.price} دج</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn increase" data-id="${item.id}">+</button>
                    </div>
                    <i class="fas fa-trash remove-item" data-id="${item.id}"></i>
                `;
                
                cartItems.appendChild(cartItem);
                // تطبيق تأثير ظهور تدريجي للعناصر
                setTimeout(() => {
                    cartItem.style.opacity = '1';
                }, 100 * cartItems.children.length);
                
                total += item.price * item.quantity;
            });
            
            checkoutBtn.disabled = false;
            checkoutBtn.style.opacity = '1';
            
            // Add event listeners for quantity and remove buttons
            document.querySelectorAll('.quantity-btn.decrease').forEach(button => {
                button.addEventListener('click', decreaseQuantity);
            });
            
            document.querySelectorAll('.quantity-btn.increase').forEach(button => {
                button.addEventListener('click', increaseQuantity);
            });
            
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', removeFromCart);
            });
        }
        
        cartTotal.textContent = total;
    }, 300);
}

// Decrease item quantity
function decreaseQuantity(event) {
    const itemId = parseInt(event.target.dataset.id);
    const cartItem = cart.find(item => item.id === itemId);
    
    if (cartItem) {
        if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
        } else {
            const index = cart.findIndex(item => item.id === itemId);
            cart.splice(index, 1);
        }
        
        saveCartToLocalStorage();
        updateCartCount();
        renderCartItems();
    }
}

// Increase item quantity
function increaseQuantity(event) {
    const itemId = parseInt(event.target.dataset.id);
    const cartItem = cart.find(item => item.id === itemId);
    
    if (cartItem) {
        cartItem.quantity += 1;
        saveCartToLocalStorage();
        updateCartCount();
        renderCartItems();
    }
}

// Remove item from cart
function removeFromCart(event) {
    const itemId = parseInt(event.target.dataset.id);
    const index = cart.findIndex(item => item.id === itemId);
    
    if (index !== -1) {
        cart.splice(index, 1);
        saveCartToLocalStorage();
        updateCartCount();
        renderCartItems();
    }
}

// Proceed to checkout
function proceedToCheckout() {
    if (cart.length === 0) return;
    
    cartModal.classList.remove('active');
    setTimeout(() => {
        cartModal.style.display = 'none';
        checkoutModal.style.display = 'flex';
        setTimeout(() => {
            checkoutModal.classList.add('active');
        }, 10);
    }, 300);
    
    const productsTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    productsTotalCheckout.textContent = productsTotal;
    
    // Set default delivery fee
    deliveryFee.textContent = settings.homeDeliveryPrice;
    orderTotal.textContent = productsTotal + settings.homeDeliveryPrice;
}

// Back to cart from checkout
function backToCart() {
    checkoutModal.classList.remove('active');
    setTimeout(() => {
        checkoutModal.style.display = 'none';
        cartModal.style.display = 'flex';
        setTimeout(() => {
            cartModal.classList.add('active');
        }, 10);
    }, 300);
}

// Update delivery option and price
function updateDeliveryOption() {
    if (homeDelivery.checked) {
        municipalityGroup.style.display = 'none';
        deliveryFee.textContent = settings.homeDeliveryPrice;
        const productsTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        orderTotal.textContent = productsTotal + settings.homeDeliveryPrice;
    } else {
        municipalityGroup.style.display = 'block';
        deliveryFee.textContent = settings.municipalityDeliveryPrice;
        const productsTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        orderTotal.textContent = productsTotal + settings.municipalityDeliveryPrice;
    }
}

// Place an order
function placeOrder(event) {
    event.preventDefault();
    
    const productsTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryType = homeDelivery.checked ? 'home' : 'municipality';
    const deliveryPrice = homeDelivery.checked ? settings.homeDeliveryPrice : settings.municipalityDeliveryPrice;
    
    const order = {
        id: Date.now(),
        date: new Date().toISOString(),
        customer: {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            phone: document.getElementById('phone').value,
            wilaya: document.getElementById('wilaya').value,
            deliveryType: deliveryType,
            municipality: deliveryType === 'municipality' ? document.getElementById('municipality').value : ''
        },
        items: [...cart],
        productsTotal: productsTotal,
        deliveryPrice: deliveryPrice,
        totalPrice: productsTotal + deliveryPrice
    };
    
    orders.push(order);
    saveOrdersToLocalStorage();
    
    // Clear the cart
    cart = [];
    saveCartToLocalStorage();
    updateCartCount();
    
    // Show confirmation modal
    checkoutModal.classList.remove('active');
    setTimeout(() => {
        checkoutModal.style.display = 'none';
        confirmationModal.style.display = 'flex';
        setTimeout(() => {
            confirmationModal.classList.add('active');
        }, 10);
    }, 300);
    
    // Reset form
    checkoutForm.reset();
}

// Display contact information
function displayContactInfo() {
    phoneNumber.textContent = settings.contactInfo.phone;
    
    document.querySelector('.social-link.instagram').href = settings.contactInfo.instagram;
    document.querySelector('.social-link.facebook').href = settings.contactInfo.facebook;
    document.querySelector('.social-link.tiktok').href = settings.contactInfo.tiktok;
}

// Admin Functions
// Open admin login modal
function openAdminLoginModal() {
    adminLoginModal.style.display = 'flex';
    setTimeout(() => {
        adminLoginModal.classList.add('active');
    }, 10);
}

// Admin login
function adminLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    // For demo purposes, using a simple hardcoded authentication
    if (username === 'admin' && password === 'admin123') {
        adminLoginModal.classList.remove('active');
        setTimeout(() => {
            adminLoginModal.style.display = 'none';
            adminPanel.style.display = 'block';
        }, 300);
        renderAdminProducts();
        renderOrders();
    } else {
        alert('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
}

// Admin logout
function adminLogout() {
    adminPanel.style.display = 'none';
}

// Render products in admin panel
function renderAdminProducts() {
    productsList.innerHTML = '';
    
    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        
        productItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-item-info">
                <div class="product-item-name">${product.name}</div>
                <div class="product-item-price">${product.price} دج</div>
            </div>
            <div class="product-actions">
                <button class="edit-product" data-id="${product.id}"><i class="fas fa-edit"></i></button>
                <button class="delete-product" data-id="${product.id}"><i class="fas fa-trash"></i></button>
            </div>
        `;
        
        productsList.appendChild(productItem);
    });
    
    // Add event listeners
    document.querySelectorAll('.edit-product').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            openEditProductModal(id);
        });
    });
    
    document.querySelectorAll('.delete-product').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            deleteProduct(id);
        });
    });
}

// Open add product modal
function openAddProductModal() {
    productModalTitle.textContent = 'إضافة منتج جديد';
    productId.value = '';
    productForm.reset();
    document.getElementById('imagePreview').innerHTML = '';
    
    // Add event listener for image preview
    document.getElementById('productImage').addEventListener('change', previewImage);
    
    productModal.style.display = 'flex';
    setTimeout(() => {
        productModal.classList.add('active');
    }, 10);
}

// Open edit product modal
function openEditProductModal(id) {
    const product = products.find(p => p.id === id);
    
    if (product) {
        productModalTitle.textContent = 'تعديل المنتج';
        productId.value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        
        // Show current image
        const imagePreview = document.getElementById('imagePreview');
        imagePreview.innerHTML = `<img src="${product.image}" alt="${product.name}">`;
        
        // Add event listener for image preview
        document.getElementById('productImage').addEventListener('change', previewImage);
        
        productModal.style.display = 'flex';
        setTimeout(() => {
            productModal.classList.add('active');
        }, 10);
    }
}

// Preview uploaded image
function previewImage(event) {
    const file = event.target.files[0];
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imagePreview = document.getElementById('imagePreview');
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="Image Preview">`;
        };
        reader.readAsDataURL(file);
    }
}

// Save product
function saveProduct(event) {
    event.preventDefault();
    
    const productIdValue = productId.value;
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const imageFile = document.getElementById('productImage').files[0];
    
    if (!name || isNaN(price) || (!productIdValue && !imageFile)) {
        alert('يرجى ملء جميع الحقول المطلوبة');
        return;
    }
    
    const processProductSave = (imageUrl) => {
        if (productIdValue) {
            // Update existing product
            const index = products.findIndex(p => p.id === parseInt(productIdValue));
            
            if (index !== -1) {
                products[index].name = name;
                products[index].price = price;
                
                if (imageUrl) {
                    products[index].image = imageUrl;
                }
            }
        } else {
            // Add new product
            const newProduct = {
                id: Date.now(),
                name: name,
                price: price,
                image: imageUrl
            };
            
            products.push(newProduct);
        }
        
        saveProductsToLocalStorage();
        renderProducts();
        renderAdminProducts();
        productModal.style.display = 'none';
    };
    
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            processProductSave(e.target.result);
        };
        reader.readAsDataURL(imageFile);
    } else {
        // If editing and no new image selected, keep the existing image
        processProductSave(null);
    }
}

// Delete product
function deleteProduct(id) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        const index = products.findIndex(p => p.id === id);
        
        if (index !== -1) {
            products.splice(index, 1);
            saveProductsToLocalStorage();
            renderProducts();
            renderAdminProducts();
        }
    }
}

// Save delivery prices
function saveDeliveryPrices() {
    const homeDPrice = parseFloat(homeDeliveryPrice.value);
    const municipalityDPrice = parseFloat(municipalityDeliveryPrice.value);
    
    if (isNaN(homeDPrice) || isNaN(municipalityDPrice)) {
        alert('يرجى إدخال أسعار صحيحة');
        return;
    }
    
    settings.homeDeliveryPrice = homeDPrice;
    settings.municipalityDeliveryPrice = municipalityDPrice;
    saveSettingsToLocalStorage();
    
    alert('تم حفظ إعدادات التوصيل بنجاح');
}

// Save contact information
function saveContactInformation() {
    settings.contactInfo.phone = adminPhone.value;
    settings.contactInfo.instagram = adminInstagram.value;
    settings.contactInfo.facebook = adminFacebook.value;
    settings.contactInfo.tiktok = adminTiktok.value;
    
    saveSettingsToLocalStorage();
    displayContactInfo();
    
    alert('تم حفظ معلومات التواصل بنجاح');
}

// Render orders in admin panel
function renderOrders() {
    ordersList.innerHTML = '';
    
    if (orders.length === 0) {
        ordersList.innerHTML = '<p>لا توجد طلبات حتى الآن</p>';
        return;
    }
    
    orders.forEach(order => {
        const orderDate = new Date(order.date);
        const formattedDate = orderDate.toLocaleDateString('ar-EG');
        const formattedTime = orderDate.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
        
        const orderItem = document.createElement('div');
        orderItem.classList.add('order-item');
        
        orderItem.innerHTML = `
            <div class="order-item-info">
                <div class="order-id">رقم الطلب: ${order.id}</div>
                <div class="order-date">التاريخ: ${formattedDate} - ${formattedTime}</div>
                <div class="order-customer">العميل: ${order.customer.firstName} ${order.customer.lastName}</div>
                <div class="order-phone">الهاتف: ${order.customer.phone}</div>
                <div class="order-total">المبلغ: ${order.totalPrice} دج</div>
            </div>
            <button class="view-order" data-id="${order.id}"><i class="fas fa-eye"></i></button>
        `;
        
        ordersList.appendChild(orderItem);
    });
    
    // Add event listeners
    document.querySelectorAll('.view-order').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            viewOrderDetails(id);
        });
    });
}

// View order details
function viewOrderDetails(id) {
    const order = orders.find(o => o.id === id);
    
    if (order) {
        let itemsHtml = '';
        order.items.forEach(item => {
            itemsHtml += `
                <div class="order-detail-item">
                    <span>${item.name}</span>
                    <span>${item.quantity} × ${item.price} دج</span>
                </div>
            `;
        });
        
        const orderDate = new Date(order.date);
        const formattedDate = orderDate.toLocaleDateString('ar-EG');
        const formattedTime = orderDate.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
        
        const deliveryType = order.customer.deliveryType === 'home' ? 'إلى المنزل' : 'إلى البلدية';
        const municipality = order.customer.deliveryType === 'municipality' ? `<p>البلدية: ${order.customer.municipality}</p>` : '';
        
        const orderDetailsHtml = `
            <div class="order-details">
                <h3>تفاصيل الطلب #${order.id}</h3>
                <div class="order-details-section">
                    <h4>معلومات العميل</h4>
                    <p>الاسم: ${order.customer.firstName} ${order.customer.lastName}</p>
                    <p>الهاتف: <a href="tel:${order.customer.phone}" class="phone-link">${order.customer.phone}</a></p>
                    <p>الولاية: ${order.customer.wilaya}</p>
                    <p>طريقة التوصيل: ${deliveryType}</p>
                    ${municipality}
                </div>
                <div class="order-details-section">
                    <h4>وقت الطلب</h4>
                    <p>${formattedDate} ${formattedTime}</p>
                </div>
                <div class="order-details-section">
                    <h4>المنتجات</h4>
                    ${itemsHtml}
                </div>
                <div class="order-details-section">
                    <h4>التكلفة</h4>
                    <p>سعر المنتجات: ${order.productsTotal} دج</p>
                    <p>سعر التوصيل: ${order.deliveryPrice} دج</p>
                    <p class="order-total-price">المجموع: ${order.totalPrice} دج</p>
                </div>
            </div>
        `;
        
        // Create a custom modal for order details
        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.style.display = 'flex';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>تفاصيل الطلب</h2>
                    <span class="close">&times;</span>
                </div>
                <div class="modal-body">
                    ${orderDetailsHtml}
                </div>
                <div class="modal-footer">
                    <button class="btn copy-info">نسخ معلومات العميل</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listener to close button
        modal.querySelector('.close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        // Add event listener to copy info button
        modal.querySelector('.copy-info').addEventListener('click', () => {
            const info = `الاسم: ${order.customer.firstName} ${order.customer.lastName}
الهاتف: ${order.customer.phone}
الولاية: ${order.customer.wilaya}
طريقة التوصيل: ${deliveryType}
${order.customer.deliveryType === 'municipality' ? 'البلدية: ' + order.customer.municipality : ''}`;
            
            navigator.clipboard.writeText(info)
                .then(() => alert('تم نسخ معلومات العميل بنجاح'))
                .catch(err => console.error('فشل في نسخ النص: ', err));
        });
    }
}

// Make sure the initialization happens when the DOM is loaded
document.addEventListener('DOMContentLoaded', init); 