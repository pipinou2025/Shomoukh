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

// Debug flag - set to true to enable detailed logging
const DEBUG = true;

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
const closeAdminLoginModal = document.querySelector('.close[data-modal="adminLoginModal"]');
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
    if (DEBUG) console.log('Initializing application...');
    
    // تحميل البيانات
    loadDataFromLocalStorage();
    
    // تهيئة واجهة المستخدم
    populateWilayaOptions();
    renderProducts();
    updateCartCount();
    displayContactInfo();
    
    // إعداد الضغط المطول على الشعار للوصول إلى لوحة التحكم
    setupLongPress();
    
    // إعداد زر الوصول إلى لوحة التحكم
    setupAdminButton();
    
    // إضافة منتج افتراضي للاختبار
    if (!products || products.length === 0) {
        console.log('لا توجد منتجات، إضافة منتج افتراضي');
        const defaultProduct = {
            id: Date.now(),
            name: 'فستان سهرة أنيق',
            price: 4500,
            image: 'https://i.pinimg.com/564x/f9/4c/cf/f94ccf1b5ff2ef4ae3c71e99f6c21acd.jpg'
        };
        products.push(defaultProduct);
        saveProductsToLocalStorage();
    }
    
    if (DEBUG) console.log('Application initialized successfully');
}

// تهيئة خاصية الضغط المطول على الشعار
function setupLongPress() {
    const logo = document.querySelector('.logo');
    if (logo) {
        if (DEBUG) console.log('Logo element found. Setting up long press event...');
        let pressTimer;
        
        logo.addEventListener('touchstart', function(e) {
            if (DEBUG) console.log('Logo touchstart event fired');
            pressTimer = setTimeout(function() {
                if (DEBUG) console.log('Logo long press detected!');
                openAdminLoginModal();
            }, 1500); // 1.5 ثانية للضغط المطول
            e.preventDefault(); // منع النقر العادي
        });
        
        logo.addEventListener('touchend', function(e) {
            if (DEBUG) console.log('Logo touchend event fired');
            clearTimeout(pressTimer);
        });
        
        // للأجهزة المكتبية أيضًا
        logo.addEventListener('mousedown', function(e) {
            if (DEBUG) console.log('Logo mousedown event fired');
            pressTimer = setTimeout(function() {
                if (DEBUG) console.log('Logo long press detected!');
                openAdminLoginModal();
            }, 1500);
        });
        
        logo.addEventListener('mouseup', function(e) {
            if (DEBUG) console.log('Logo mouseup event fired');
            clearTimeout(pressTimer);
        });
        
        logo.addEventListener('mouseleave', function(e) {
            if (DEBUG) console.log('Logo mouseleave event fired');
            clearTimeout(pressTimer);
        });
    } else {
        console.error('Logo element not found!');
    }
}

// إعداد زر الوصول إلى لوحة التحكم
function setupAdminButton() {
    const adminAccessBtn = document.getElementById('adminAccessBtn');
    if (adminAccessBtn) {
        if (DEBUG) console.log('Admin access button found. Adding click event...');
        adminAccessBtn.addEventListener('click', function() {
            if (DEBUG) console.log('Admin access button clicked!');
            openAdminLoginModal();
        });
    } else {
        console.error('Admin access button not found!');
    }
}

// Load data from local storage
async function loadDataFromLocalStorage() {
    if (DEBUG) console.log('Loading data...');
    
    try {
        // أولاً: تحميل المنتجات الافتراضية
        await loadDefaultProducts();
        
        // ثانياً: تحميل البيانات المخزنة محلياً
        const savedCart = localStorage.getItem('cart');
        const savedOrders = localStorage.getItem('orders');
        const savedSettings = localStorage.getItem('settings');
        const savedCustomProducts = localStorage.getItem('customProducts');
        
        if (DEBUG) console.log('Custom products from localStorage:', savedCustomProducts);
        
        // دمج المنتجات المخصصة مع المنتجات الافتراضية إذا وجدت
        if (savedCustomProducts) {
            const customProducts = JSON.parse(savedCustomProducts);
            if (Array.isArray(customProducts) && customProducts.length > 0) {
                // إضافة المنتجات المخصصة إلى قائمة المنتجات
                products = [...products, ...customProducts];
                if (DEBUG) console.log('Merged products array:', products);
            }
        }
        
        if (savedCart) cart = JSON.parse(savedCart);
        if (savedOrders) orders = JSON.parse(savedOrders);
        if (savedSettings) settings = JSON.parse(savedSettings);
        
        if (DEBUG) console.log('Data loaded successfully. Products count:', products.length);
    } catch (error) {
        console.error('Error loading data:', error);
        // في حالة الفشل، على الأقل نعرض المنتجات الافتراضية
        await loadDefaultProducts();
    }
}

// تحميل المنتجات الافتراضية من ملف JSON
async function loadDefaultProducts() {
    if (DEBUG) console.log('Loading default products...');
    try {
        const response = await fetch('default-products.json');
        if (!response.ok) {
            throw new Error(`Failed to load default products: ${response.status}`);
        }
        const defaultProducts = await response.json();
        if (DEBUG) console.log('Default products loaded:', defaultProducts);
        
        products = defaultProducts;
        return true;
    } catch (error) {
        console.error('Error loading default products:', error);
        // في حالة الفشل، إعداد مصفوفة منتجات فارغة
        products = [];
        return false;
    }
}

// Save custom products to local storage
function saveProductsToLocalStorage() {
    if (DEBUG) console.log('Saving custom products to localStorage');
    
    // فصل المنتجات المخصصة (التي أضافها المستخدم) عن المنتجات الافتراضية
    const defaultProductIds = [1001, 1002, 1003]; // معرفات المنتجات الافتراضية
    const customProducts = products.filter(product => !defaultProductIds.includes(product.id));
    
    if (DEBUG) console.log('Custom products to save:', customProducts);
    localStorage.setItem('customProducts', JSON.stringify(customProducts));
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
    if (DEBUG) console.log('Rendering products, count:', products ? products.length : 0);
    if (!productsContainer) {
        console.error('Products container not found!');
        return;
    }
    
    productsContainer.innerHTML = '';
    
    if (!products || products.length === 0) {
        if (DEBUG) console.log('No products found, displaying welcome message');
        
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'welcome-message';
        welcomeMessage.innerHTML = `
            <h2>مرحبًا بك في متجر شموخ</h2>
            <p>لا توجد منتجات متوفرة حاليًا</p>
        `;
        productsContainer.appendChild(welcomeMessage);
        return;
    }
    
    if (DEBUG) console.log('Rendering', products.length, 'products');
    
    products.forEach(product => {
        // تأكد من أن المنتج لديه جميع البيانات اللازمة
        if (!product || !product.name || !product.price) {
            console.error('منتج غير صالح:', product);
            return; // تخطي هذا المنتج
        }
        
        // التأكد من وجود صورة صالحة
        let imageUrl = product.image;
        if (!imageUrl || imageUrl === 'undefined' || imageUrl === 'null') {
            console.error('صورة غير صالحة للمنتج:', product.name);
            return; // تخطي المنتج بدون صورة
        }
        
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        
        productCard.innerHTML = `
            <div class="product-image-container">
                <img src="${imageUrl}" alt="${product.name}" class="product-image">
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
    
    if (DEBUG) console.log('Products rendered successfully');
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

// Toggle cart modal
function toggleCartModal() {
    if (cartModal.style.display === 'flex') {
        cartModal.classList.remove('active');
        setTimeout(() => {
            cartModal.style.display = 'none';
        }, 300);
    } else {
        renderCartItems();
        cartModal.style.display = 'flex';
        setTimeout(() => {
            cartModal.classList.add('active');
        }, 10);
    }
}

// Open checkout modal
function openCheckoutModal() {
    cartModal.classList.remove('active');
    setTimeout(() => {
        cartModal.style.display = 'none';
        checkoutModal.style.display = 'flex';
        
        // Calculate and display totals
        const productsTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        productsTotalCheckout.textContent = productsTotal;
        
        // Set default delivery option
        homeDelivery.checked = true;
        municipalityDelivery.checked = false;
        municipalityGroup.style.display = 'none';
        
        // Update delivery fee and total
        deliveryFee.textContent = settings.homeDeliveryPrice;
        orderTotal.textContent = productsTotal + settings.homeDeliveryPrice;
        
        setTimeout(() => {
            checkoutModal.classList.add('active');
        }, 10);
    }, 300);
}

// Close checkout modal
function closeCheckoutModal() {
    checkoutModal.classList.remove('active');
    setTimeout(() => {
        checkoutModal.style.display = 'none';
        cartModal.style.display = 'flex';
        setTimeout(() => {
            cartModal.classList.add('active');
        }, 10);
    }, 300);
}

// Close confirmation modal
function closeConfirmationModal() {
    confirmationModal.classList.remove('active');
    setTimeout(() => {
        confirmationModal.style.display = 'none';
    }, 300);
}

// Show login form (alias for openAdminLoginModal for compatibility)
function showLoginForm() {
    openAdminLoginModal();
}

// Hide login form
function hideLoginForm() {
    adminLoginModal.classList.remove('active');
    setTimeout(() => {
        adminLoginModal.style.display = 'none';
    }, 300);
}

// Open product modal
function openProductModal() {
    // Reset form
    productForm.reset();
    productId.value = '';
    document.getElementById('imagePreview').innerHTML = '';
    
    // Show modal
    productModal.style.display = 'flex';
    setTimeout(() => {
        productModal.classList.add('active');
    }, 10);
}

// Close modal
function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (modal.style.display === 'flex') {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    });
}

// Render cart items
function renderCartItems() {
    if (!cartItems) return;
    
    // Show loading indicator
    document.getElementById('cartLoading').style.display = 'block';
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">سلة المشتريات فارغة</p>';
        updateCartTotal();
        
        // Hide loading indicator
        document.getElementById('cartLoading').style.display = 'none';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        
        if (product) {
            // التأكد من وجود صورة صالحة
            let imageUrl = product.image;
            if (!imageUrl || imageUrl === 'undefined' || imageUrl === 'null') {
                imageUrl = getDefaultImageForProduct(product.name);
            }
            
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            
            cartItem.innerHTML = `
                <img src="${imageUrl}" alt="${product.name}" class="cart-item-image"
                     onerror="this.onerror=null; this.src='https://i.pinimg.com/564x/f9/4c/cf/f94ccf1b5ff2ef4ae3c71e99f6c21acd.jpg';">
                <div class="cart-item-info">
                    <h3 class="cart-item-name">${product.name}</h3>
                    <p class="cart-item-price">${product.price} دج</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease" data-id="${product.id}">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn increase" data-id="${product.id}">+</button>
                </div>
                <i class="fas fa-trash remove-item" data-id="${product.id}"></i>
            `;
            
            cartItems.appendChild(cartItem);
            total += product.price * item.quantity;
        }
    });
    
    cartTotal.textContent = total;
    
    // Add event listeners
    document.querySelectorAll('.decrease').forEach(button => {
        button.addEventListener('click', decreaseQuantity);
    });
    
    document.querySelectorAll('.increase').forEach(button => {
        button.addEventListener('click', increaseQuantity);
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', removeFromCart);
    });
    
    // Hide loading indicator
    document.getElementById('cartLoading').style.display = 'none';
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
async function placeOrder(event) {
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
    
    try {
        if (DEBUG) console.log('Placing order:', order);
        
        // إضافة الطلب إلى قائمة الطلبات
        orders.push(order);
        
        // حفظ في التخزين المحلي
        saveOrdersToLocalStorage();
        
        // مسح سلة التسوق
        cart = [];
        saveCartToLocalStorage();
        updateCartCount();
        
        // إظهار نافذة التأكيد
        const checkoutModal = document.getElementById('checkoutModal');
        const confirmationModal = document.getElementById('confirmationModal');
        
        if (checkoutModal) {
            checkoutModal.classList.remove('active');
            setTimeout(() => {
                checkoutModal.style.display = 'none';
                if (confirmationModal) {
                    confirmationModal.style.display = 'flex';
                    setTimeout(() => {
                        confirmationModal.classList.add('active');
                    }, 10);
                }
            }, 300);
        }
        
        // إعادة تعيين النموذج
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) checkoutForm.reset();
        
        if (DEBUG) console.log('Order placed successfully');
    } catch (error) {
        console.error("فشل في إرسال الطلب:", error);
        alert("حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.");
    }
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
    if (DEBUG) console.log('Opening admin login modal...');
    const adminLoginModal = document.getElementById('adminLoginModal');
    
    if (!adminLoginModal) {
        console.error('Admin login modal not found!');
        return;
    }
    
    if (DEBUG) console.log('Setting admin login modal display to flex');
    adminLoginModal.style.display = 'flex';
    
    setTimeout(() => {
        if (DEBUG) console.log('Adding active class to admin login modal');
        adminLoginModal.classList.add('active');
    }, 10);
    
    if (DEBUG) console.log('Admin login modal should be visible now');
}

// تصدير البيانات (للنسخ الاحتياطي)
function exportData() {
    try {
        const data = {
            products: products,
            orders: orders,
            settings: settings,
            version: '1.0',
            exported: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(data);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'shomoukh-data.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        return true;
    } catch (error) {
        console.error('Error exporting data:', error);
        return false;
    }
}

// استيراد البيانات (لاستعادة النسخ الاحتياطي)
function importData(jsonData) {
    try {
        const data = JSON.parse(jsonData);
        
        if (data.products) {
            products = data.products;
            saveProductsToLocalStorage();
        }
        
        if (data.orders) {
            orders = data.orders;
            saveOrdersToLocalStorage();
        }
        
        if (data.settings) {
            settings = data.settings;
            saveSettingsToLocalStorage();
        }
        
        renderProducts();
        updateCartCount();
        displayContactInfo();
        renderAdminProducts();
        renderOrders();
        
        return true;
    } catch (error) {
        console.error('Error importing data:', error);
        return false;
    }
}

// إضافة وظائف استيراد/تصدير البيانات في لوحة التحكم
function addDataManagementToAdminPanel() {
    const adminPanel = document.getElementById('adminPanel');
    if (!adminPanel) return;
    
    // التحقق من وجود قسم إدارة البيانات
    let dataSection = document.querySelector('.admin-section.data-management');
    
    if (!dataSection) {
        // إنشاء قسم جديد
        dataSection = document.createElement('div');
        dataSection.className = 'admin-section data-management';
        
        dataSection.innerHTML = `
            <h3>إدارة البيانات</h3>
            <div class="data-management-buttons">
                <button id="exportDataBtn" class="btn export-btn">تصدير البيانات</button>
                <div class="form-group">
                    <label for="importDataFile">استيراد البيانات</label>
                    <input type="file" id="importDataFile" accept=".json">
                </div>
            </div>
        `;
        
        // إضافة القسم إلى لوحة التحكم
        const adminSections = adminPanel.querySelector('.admin-sections');
        if (adminSections) {
            adminSections.appendChild(dataSection);
        } else {
            adminPanel.appendChild(dataSection);
        }
        
        // إضافة مستمعات الأحداث
        const exportBtn = document.getElementById('exportDataBtn');
        const importInput = document.getElementById('importDataFile');
        
        if (exportBtn) {
            exportBtn.addEventListener('click', function() {
                if (exportData()) {
                    alert('تم تصدير البيانات بنجاح');
                } else {
                    alert('فشل تصدير البيانات');
                }
            });
        }
        
        if (importInput) {
            importInput.addEventListener('change', function(event) {
                const file = event.target.files[0];
                if (!file) return;
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    const contents = e.target.result;
                    if (importData(contents)) {
                        alert('تم استيراد البيانات بنجاح');
                    } else {
                        alert('فشل استيراد البيانات');
                    }
                };
                reader.readAsText(file);
            });
        }
    }
}

// Admin login
function adminLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
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

// Render orders in admin panel
function renderOrders() {
    if (DEBUG) console.log('Rendering orders, count:', orders.length);
    
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) {
        console.error('Orders list not found!');
        return;
    }
    
    ordersList.innerHTML = '';
    
    if (orders.length === 0) {
        ordersList.innerHTML = '<div class="no-orders">لا توجد طلبات</div>';
        return;
    }
    
    // ترتيب الطلبات من الأحدث للأقدم
    const sortedOrders = [...orders].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    
    sortedOrders.forEach(order => {
        try {
            const orderDate = new Date(order.date);
            const formattedDate = orderDate.toLocaleDateString('ar-SA');
            const formattedTime = orderDate.toLocaleTimeString('ar-SA');
            
            const orderItem = document.createElement('div');
            orderItem.classList.add('order-item');
            
            orderItem.innerHTML = `
                <div class="order-item-info">
                    <div class="order-id">طلب #${order.id}</div>
                    <div class="order-date">${formattedDate} - ${formattedTime}</div>
                    <div class="order-customer">${order.customer.firstName} ${order.customer.lastName}</div>
                    <div class="order-phone"><a href="tel:${order.customer.phone}" class="phone-link">${order.customer.phone}</a></div>
                </div>
                <div class="order-total">${order.totalPrice} دج</div>
                <button class="view-order" data-id="${order.id}">تفاصيل الطلب</button>
            `;
            
            ordersList.appendChild(orderItem);
        } catch (error) {
            console.error("خطأ في عرض الطلب:", error, order);
        }
    });
    
    // Add event listeners to order buttons
    document.querySelectorAll('.view-order').forEach(button => {
        button.addEventListener('click', function() {
            const orderId = parseInt(this.dataset.id);
            viewOrderDetails(orderId);
        });
    });
    
    if (DEBUG) console.log('Orders rendered successfully');
}

// View order details
function viewOrderDetails(id) {
    if (DEBUG) console.log('Viewing order details for ID:', id);
    
    const order = orders.find(o => o.id === id);
    if (!order) {
        console.error('Order not found:', id);
        return;
    }
    
    try {
        // تحويل التاريخ
        const orderDate = new Date(order.date);
        const formattedDate = orderDate.toLocaleDateString('ar-SA');
        const formattedTime = orderDate.toLocaleTimeString('ar-SA');
        
        // تحديد نوع التوصيل
        let deliveryType = '';
        if (order.customer.deliveryType === 'home') {
            deliveryType = 'توصيل إلى المنزل';
        } else {
            deliveryType = 'توصيل إلى البلدية: ' + order.customer.municipality;
        }
        
        // إنشاء HTML للمنتجات
        let itemsHtml = '';
        order.items.forEach(item => {
            itemsHtml += `
                <div class="order-details-product">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="order-details-product-info">
                        <div class="order-details-product-name">${item.name}</div>
                        <div class="order-details-product-price">${item.price} دج × ${item.quantity}</div>
                    </div>
                    <div class="order-details-product-total">${item.price * item.quantity} دج</div>
                </div>
            `;
        });
        
        // إنشاء HTML لتفاصيل الطلب
        const orderDetailsHtml = `
            <div class="order-details">
                <div class="order-details-section">
                    <h4>معلومات العميل</h4>
                    <p>الاسم: ${order.customer.firstName} ${order.customer.lastName}</p>
                    <p>الهاتف: <a href="tel:${order.customer.phone}" class="phone-link">${order.customer.phone}</a></p>
                    <p>الولاية: ${order.customer.wilaya}</p>
                    <p>التوصيل: ${deliveryType}</p>
                </div>
                <div class="order-details-section">
                    <h4>معلومات الطلب</h4>
                    <p>رقم الطلب: ${order.id}</p>
                    <p>التاريخ: ${formattedDate}</p>
                    <p>الوقت: ${formattedTime}</p>
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
        
        // إنشاء نافذة منبثقة لعرض التفاصيل
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
        
        // إضافة مستمع حدث لزر الإغلاق
        modal.querySelector('.close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        // إضافة مستمع حدث لزر نسخ المعلومات
        modal.querySelector('.copy-info').addEventListener('click', () => {
            const info = `الاسم: ${order.customer.firstName} ${order.customer.lastName}
الهاتف: ${order.customer.phone}
الولاية: ${order.customer.wilaya}
التوصيل: ${deliveryType}`;
            
            navigator.clipboard.writeText(info).then(() => {
                alert('تم نسخ المعلومات بنجاح');
            }).catch(err => {
                console.error('فشل في نسخ المعلومات:', err);
                // طريقة بديلة للنسخ
                const textarea = document.createElement('textarea');
                textarea.value = info;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                alert('تم نسخ المعلومات بنجاح');
            });
        });
        
        if (DEBUG) console.log('Order details displayed successfully');
    } catch (error) {
        console.error("خطأ في عرض تفاصيل الطلب:", error);
        alert("حدث خطأ أثناء عرض تفاصيل الطلب");
    }
}

// Load admin panel data
async function loadAdminPanelData() {
    try {
        await loadOrders();
        renderOrders();
        await loadProducts();
        renderAdminProducts();
    } catch (error) {
        console.error("فشل في تحميل بيانات لوحة التحكم:", error);
    }
}

// Toggle admin panel visibility
async function toggleAdminPanel() {
    if (DEBUG) console.log('Toggling admin panel visibility');
    
    const adminPanel = document.getElementById('adminPanel');
    if (!adminPanel) {
        console.error('Admin panel not found!');
        return;
    }
    
    if (adminPanel.style.display === 'block') {
        if (DEBUG) console.log('Hiding admin panel');
        adminPanel.style.display = 'none';
    } else {
        if (DEBUG) console.log('Showing admin panel');
        
        // Load data
        if (DEBUG) console.log('Loading admin panel data');
        loadDataFromLocalStorage();
        renderAdminProducts();
        renderOrders();
        
        // Populate form fields with current settings
        const homeDeliveryPrice = document.getElementById('homeDeliveryPrice');
        const municipalityDeliveryPrice = document.getElementById('municipalityDeliveryPrice');
        const contactPhone = document.getElementById('adminPhone');
        const contactInstagram = document.getElementById('adminInstagram');
        const contactFacebook = document.getElementById('adminFacebook');
        const contactTiktok = document.getElementById('adminTiktok');
        
        if (homeDeliveryPrice) homeDeliveryPrice.value = settings.homeDeliveryPrice;
        if (municipalityDeliveryPrice) municipalityDeliveryPrice.value = settings.municipalityDeliveryPrice;
        if (contactPhone) contactPhone.value = settings.contactInfo.phone;
        if (contactInstagram) contactInstagram.value = settings.contactInfo.instagram;
        if (contactFacebook) contactFacebook.value = settings.contactInfo.facebook;
        if (contactTiktok) contactTiktok.value = settings.contactInfo.tiktok;
        
        // Add data management section
        addDataManagementToAdminPanel();
        
        adminPanel.style.display = 'block';
        if (DEBUG) console.log('Admin panel displayed');
    }
}

// تأكد من تنفيذ الدالة الرئيسية فور تحميل الصفحة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('مباشرة: تهيئة التطبيق');
        setTimeout(function() {
            init();
        }, 100);
    });
} else {
    console.log('الصفحة جاهزة بالفعل: تهيئة التطبيق');
    setTimeout(function() {
        init();
    }, 100);
}

// اختبار localStorage
try {
    localStorage.setItem('test', 'test');
    if (localStorage.getItem('test') !== 'test') {
        console.error('localStorage غير متاح أو لا يعمل بشكل صحيح');
        alert('هناك مشكلة في تخزين البيانات. يرجى تمكين ملفات تعريف الارتباط والتخزين المحلي في المتصفح.');
    }
    localStorage.removeItem('test');
} catch (e) {
    console.error('خطأ في localStorage:', e);
    alert('هناك مشكلة في تخزين البيانات. يرجى تمكين ملفات تعريف الارتباط والتخزين المحلي في المتصفح.');
}

// Update contact display
function updateContactDisplay() {
    if (phoneNumber && settings.contactInfo && settings.contactInfo.phone) {
        phoneNumber.textContent = settings.contactInfo.phone;
        phoneNumber.href = `tel:${settings.contactInfo.phone}`;
    }
    
    // تحديث روابط التواصل الاجتماعي إذا كانت موجودة
    const socialLinks = document.querySelectorAll('.social-links a');
    if (socialLinks.length > 0 && settings.contactInfo) {
        const { instagram, facebook, tiktok } = settings.contactInfo;
        
        socialLinks.forEach(link => {
            if (link.classList.contains('instagram') && instagram) {
                link.href = instagram;
            } else if (link.classList.contains('facebook') && facebook) {
                link.href = facebook;
            } else if (link.classList.contains('tiktok') && tiktok) {
                link.href = tiktok;
            }
        });
    }
}

// Open cart modal - backward compatibility
function openCartModal() {
    console.log('Opening cart modal (legacy function)');
    toggleCartModal();
}

// Populate Wilaya dropdown
function populateWilayaOptions() {
    if (DEBUG) console.log('Populating wilayas dropdown');
    
    const wilayaSelect = document.getElementById('wilaya');
    if (!wilayaSelect) {
        console.error('Wilaya select not found!');
        return;
    }
    
    // تأكد من أن القائمة فارغة أولاً
    while (wilayaSelect.options.length > 1) {
        wilayaSelect.remove(1);
    }
    
    // إضافة الولايات
    wilayas.forEach(wilaya => {
        const option = document.createElement('option');
        option.value = wilaya;
        option.textContent = wilaya;
        wilayaSelect.appendChild(option);
    });
    
    if (DEBUG) console.log('Wilayas populated successfully');
}

// Render admin products
function renderAdminProducts() {
    if (DEBUG) console.log('Rendering admin products, count:', products.length);
    
    const productsList = document.getElementById('productsList');
    if (!productsList) {
        console.error('Products list not found!');
        return;
    }
    
    productsList.innerHTML = '';
    
    if (products.length === 0) {
        productsList.innerHTML = '<div class="no-products">لا توجد منتجات</div>';
        return;
    }
    
    products.forEach(product => {
        try {
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
        } catch (error) {
            console.error("خطأ في عرض المنتج:", error, product);
        }
    });
    
    // Add event listeners to product actions
    document.querySelectorAll('.edit-product').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            openEditProductModal(productId);
        });
    });
    
    document.querySelectorAll('.delete-product').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            deleteProduct(productId);
        });
    });
    
    if (DEBUG) console.log('Admin products rendered successfully');
}

// Open add product modal
function openAddProductModal() {
    if (DEBUG) console.log('Opening add product modal');
    
    const productModalTitle = document.getElementById('productModalTitle');
    const productId = document.getElementById('productId');
    const productForm = document.getElementById('productForm');
    const productModal = document.getElementById('productModal');
    
    if (!productModalTitle || !productId || !productForm || !productModal) {
        console.error('Product modal elements not found!');
        return;
    }
    
    productModalTitle.textContent = 'إضافة منتج جديد';
    productId.value = '';
    productForm.reset();
    document.getElementById('imagePreview').innerHTML = '';
    
    // Add event listener for image preview
    const productImage = document.getElementById('productImage');
    if (productImage) {
        productImage.addEventListener('change', previewImage);
    }
    
    productModal.style.display = 'flex';
    setTimeout(() => {
        productModal.classList.add('active');
    }, 10);
    
    if (DEBUG) console.log('Add product modal opened');
}

// Open edit product modal
function openEditProductModal(id) {
    if (DEBUG) console.log('Opening edit product modal for ID:', id);
    
    const product = products.find(p => p.id === id);
    if (!product) {
        console.error('Product not found:', id);
        return;
    }
    
    const productModalTitle = document.getElementById('productModalTitle');
    const productId = document.getElementById('productId');
    const productName = document.getElementById('productName');
    const productPrice = document.getElementById('productPrice');
    const imagePreview = document.getElementById('imagePreview');
    const productModal = document.getElementById('productModal');
    
    if (!productModalTitle || !productId || !productName || !productPrice || !imagePreview || !productModal) {
        console.error('Product modal elements not found!');
        return;
    }
    
    productModalTitle.textContent = 'تعديل المنتج';
    productId.value = product.id;
    productName.value = product.name;
    productPrice.value = product.price;
    
    // Show current image
    imagePreview.innerHTML = `<img src="${product.image}" alt="${product.name}">`;
    
    // Add event listener for image preview
    const productImage = document.getElementById('productImage');
    if (productImage) {
        productImage.addEventListener('change', previewImage);
    }
    
    productModal.style.display = 'flex';
    setTimeout(() => {
        productModal.classList.add('active');
    }, 10);
    
    if (DEBUG) console.log('Edit product modal opened');
}

// Preview uploaded image
function previewImage(event) {
    if (DEBUG) console.log('Previewing image');
    
    const file = event.target.files[0];
    if (!file) {
        console.error('No file selected');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const imagePreview = document.getElementById('imagePreview');
        if (imagePreview) {
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="Image Preview">`;
        }
    };
    reader.readAsDataURL(file);
    
    if (DEBUG) console.log('Image preview processed');
}

// Save product
async function saveProduct(event) {
    event.preventDefault();
    
    const productIdValue = document.getElementById('productId').value;
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const imageFile = document.getElementById('productImage').files[0];
    
    if (!name || isNaN(price) || (!productIdValue && !imageFile)) {
        alert('يرجى ملء جميع الحقول المطلوبة');
        return;
    }
    
    try {
        if (DEBUG) console.log('Saving product. ID:', productIdValue, 'Name:', name, 'Price:', price);
        
        // تحويل الصورة إلى Data URL
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageData = e.target.result;
                saveProductWithImage(productIdValue, name, price, imageData);
            };
            reader.readAsDataURL(imageFile);
        } else {
            saveProductWithImage(productIdValue, name, price, null);
        }
    } catch (error) {
        console.error("حدث خطأ أثناء حفظ المنتج:", error);
        alert("حدث خطأ أثناء حفظ المنتج. يرجى المحاولة مرة أخرى.");
    }
}

// وظيفة مساعدة لحفظ المنتج بالصورة
function saveProductWithImage(productId, name, price, imageData) {
    try {
        if (productId) {
            // تحديث منتج موجود
            const index = products.findIndex(p => p.id === parseInt(productId));
            
            if (index !== -1) {
                products[index].name = name;
                products[index].price = price;
                
                if (imageData) {
                    products[index].image = imageData;
                }
                
                if (DEBUG) console.log('Updated existing product at index', index);
            }
        } else {
            // إضافة منتج جديد
            const newProduct = {
                id: Date.now(),
                name: name,
                price: price,
                image: imageData
            };
            
            products.push(newProduct);
            if (DEBUG) console.log('Added new product', newProduct.id);
        }
        
        // حفظ في التخزين المحلي
        saveProductsToLocalStorage();
        
        // تحديث واجهة المستخدم
        renderProducts();
        renderAdminProducts();
        
        // إغلاق النموذج
        const productModal = document.getElementById('productModal');
        if (productModal) productModal.style.display = 'none';
        
        alert('تم حفظ المنتج بنجاح');
    } catch (error) {
        console.error("حدث خطأ أثناء حفظ المنتج:", error);
        alert("حدث خطأ أثناء حفظ المنتج. يرجى المحاولة مرة أخرى.");
    }
}

// Delete product
async function deleteProduct(id) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        try {
            if (DEBUG) console.log('Deleting product ID:', id);
            
            // لا نسمح بحذف المنتجات الافتراضية
            const defaultProductIds = [1001, 1002, 1003];
            if (defaultProductIds.includes(id)) {
                alert('لا يمكن حذف المنتجات الافتراضية');
                return;
            }
            
            const index = products.findIndex(p => p.id === id);
            
            if (index !== -1) {
                products.splice(index, 1);
                
                // حفظ في التخزين المحلي
                saveProductsToLocalStorage();
                
                // تحديث واجهة المستخدم
                renderProducts();
                renderAdminProducts();
                
                alert('تم حذف المنتج بنجاح');
            } else {
                alert('المنتج غير موجود');
            }
        } catch (error) {
            console.error("حدث خطأ أثناء حذف المنتج:", error);
            alert("حدث خطأ أثناء حذف المنتج. يرجى المحاولة مرة أخرى.");
        }
    }
}

// Save delivery settings
async function saveDeliverySettings() {
    const homePrice = parseFloat(document.getElementById('homeDeliveryPrice').value);
    const municipalityPrice = parseFloat(document.getElementById('municipalityDeliveryPrice').value);
    
    if (isNaN(homePrice) || isNaN(municipalityPrice)) {
        alert('يرجى إدخال أسعار صحيحة');
        return;
    }
    
    try {
        if (DEBUG) console.log('Saving delivery settings:', homePrice, municipalityPrice);
        
        settings.homeDeliveryPrice = homePrice;
        settings.municipalityDeliveryPrice = municipalityPrice;
        
        // حفظ في التخزين المحلي
        saveSettingsToLocalStorage();
        
        alert('تم حفظ إعدادات التوصيل بنجاح');
    } catch (error) {
        console.error("فشل في حفظ إعدادات التوصيل:", error);
        alert("حدث خطأ أثناء حفظ إعدادات التوصيل. يرجى المحاولة مرة أخرى.");
    }
}

// Save contact info
async function saveContactInfo() {
    const phone = document.getElementById('adminPhone').value;
    const instagram = document.getElementById('adminInstagram').value;
    const facebook = document.getElementById('adminFacebook').value;
    const tiktok = document.getElementById('adminTiktok').value;
    
    if (!phone) {
        alert('يرجى إدخال رقم الهاتف على الأقل');
        return;
    }
    
    try {
        if (DEBUG) console.log('Saving contact info');
        
        settings.contactInfo = {
            phone,
            instagram,
            facebook,
            tiktok
        };
        
        // حفظ في التخزين المحلي
        saveSettingsToLocalStorage();
        
        // تحديث عرض معلومات الاتصال
        updateContactDisplay();
        
        alert('تم حفظ معلومات الاتصال بنجاح');
    } catch (error) {
        console.error("فشل في حفظ معلومات الاتصال:", error);
        alert("حدث خطأ أثناء حفظ معلومات الاتصال. يرجى المحاولة مرة أخرى.");
    }
} 