// Wishlist & Global Badge Sync Logic
document.addEventListener('DOMContentLoaded', () => {
    // Sync wishlist and cart badges in header
    updateHeaderBadges();

    // Set up wishlist heart icon click handlers on product cards
    initializeWishlistButtons();

    // Render wishlist if on wishlist.html page
    renderWishlistPage();

    // Initialize single product details page
    initializeSingleProductPage();
});

// Render Wishlist Page if on wishlist.html page
function renderWishlistPage() {
    const container = document.getElementById('wishlist-items');
    if (!container) return;

    const wishlist = getWishlist();
    container.innerHTML = '';

    if (wishlist.length === 0) {
        container.innerHTML = `
            <div class="empty-message">
                <i class='bx bx-heart' style="font-size: 64px; color: #a0aec0; margin-bottom: 20px; display: block;"></i>
                <h2>Your Wishlist is Empty</h2>
                <p>Explore our products and save your favorites here!</p>
                <button class="normal" onclick="window.location.href='shop.html'" style="margin-top: 15px;">Shop Now</button>
            </div>
        `;
        container.style.display = 'block';
        return;
    }

    wishlist.forEach(item => {
        const productCard = document.createElement('div');
        productCard.className = 'pro';
        productCard.setAttribute('data-id', item.id);

        // Wishlist page is now at the root, so use the saved image path directly.
        const imgSrc = item.img ? item.img.replace(/^(\.\.\/)+/, '') : '';

        productCard.innerHTML = `
            <i class="bx bxs-heart wishlist-icon active"></i>
            <img class="shirt" src="${imgSrc}" alt="" onclick="window.location.href='sproduct.html?id=${item.id}';">
            <div class="des" onclick="window.location.href='../sproduct.html?id=${item.id}';">
                <span>adidas</span>
                <h5>${item.name}</h5>
                <div class="star">
                    <i class='bx bxs-star'></i>
                    <i class='bx bxs-star'></i>
                    <i class='bx bxs-star'></i>
                    <i class='bx bxs-star'></i>
                    <i class='bx bxs-star'></i>
                </div>
                <h4>₹${item.price}</h4>
            </div>
            <a href="#" class="add-to-cart-btn"><i class='bx bx-cart cart'></i></a>
        `;

        productCard.querySelector('.wishlist-icon').addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();

            let currentList = getWishlist();
            const idx = currentList.findIndex(i => i.id === item.id);
            if (idx > -1) {
                currentList.splice(idx, 1);
                saveWishlist(currentList);
                showToast(`${item.name} removed from wishlist`);
                renderWishlistPage();
            }
        });

        productCard.querySelector('.add-to-cart-btn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            addToCart(item.id, item.name, item.price, item.img);
            showToast(`${item.name} added to cart!`);
        });

        container.appendChild(productCard);
    });
}

// Get wishlist items from localStorage
function getWishlist() {
    return JSON.parse(localStorage.getItem('cara_wishlist')) || [];
}

// Save wishlist items to localStorage
function saveWishlist(wishlist) {
    localStorage.setItem('cara_wishlist', JSON.stringify(wishlist));
    updateHeaderBadges();
}

// Get cart items from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cara_cart')) || [];
}

// Update badges on cart and wishlist icons
function updateHeaderBadges() {
    const wishlist = getWishlist();
    const cart = getCart();

    // Wishlist badges
    const wlBadges = [
        document.getElementById('wishlist-badge'),
        document.getElementById('wishlist-badge-mobile')
    ];
    wlBadges.forEach(badge => {
        if (badge) {
            if (wishlist.length > 0) {
                badge.innerText = wishlist.length;
                badge.style.display = 'inline-block';
            } else {
                badge.style.display = 'none';
            }
        }
    });

    // Cart badges
    const cartBadges = [
        document.getElementById('cart-badge'),
        document.getElementById('cart-badge-mobile')
    ];
    cartBadges.forEach(badge => {
        if (badge) {
            const totalItems = cart.reduce((sum, item) => sum + parseInt(item.qty || 1), 0);
            if (totalItems > 0) {
                badge.innerText = totalItems;
                badge.style.display = 'inline-block';
            } else {
                badge.style.display = 'none';
            }
        }
    });
}

// Setup heart icons on any product card (.pro) on the page
function initializeWishlistButtons() {
    const products = document.querySelectorAll('#product1 .pro');
    const wishlist = getWishlist();

    products.forEach((pro, index) => {
        if (pro.querySelector('.wishlist-icon')) return;

        const imgEl = pro.querySelector('img');
        let img = imgEl ? imgEl.getAttribute('src') : '';

        // If image src starts with '../' (meaning we are running on wishlist.html inside a subdirectory),
        // strip the '../' when saving to localStorage so it works on other pages.
        let savedImgPath = img;
        if (img.startsWith('../')) {
            savedImgPath = img.substring(3);
        }

        const titleEl = pro.querySelector('.des h5');
        const name = titleEl ? titleEl.innerText : 'Product ' + index;

        const priceEl = pro.querySelector('.des h4');
        const priceText = priceEl ? priceEl.innerText : '₹0';
        const price = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;

        let id = pro.getAttribute('data-id');
        if (!id) {
            id = savedImgPath ? savedImgPath.substring(savedImgPath.lastIndexOf('/') + 1, savedImgPath.lastIndexOf('.')) : 'pro-' + index;
            pro.setAttribute('data-id', id);
        }

        const heart = document.createElement('i');
        heart.className = 'bx bx-heart wishlist-icon';

        if (wishlist.some(item => item.id === id)) {
            heart.className = 'bx bxs-heart wishlist-icon active';
        }

        pro.appendChild(heart);

        heart.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();

            let currentList = getWishlist();
            const existsIndex = currentList.findIndex(item => item.id === id);

            if (existsIndex > -1) {
                currentList.splice(existsIndex, 1);
                heart.className = 'bx bx-heart wishlist-icon';
                showToast(`${name} removed from wishlist`);
            } else {
                currentList.push({ id, name, price, img: savedImgPath });
                heart.className = 'bx bxs-heart wishlist-icon active';
                showToast(`${name} added to wishlist!`);
            }
            saveWishlist(currentList);
        });

        const cartBtn = pro.querySelector('.cart');
        if (cartBtn) {
            cartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                addToCart(id, name, price, savedImgPath);
                showToast(`${name} added to cart!`);
            });
        }
    });
}

// Add item to cart and update
function addToCart(id, name, price, img, qty = 1) {
    let cart = getCart();
    const existingIndex = cart.findIndex(item => item.id === id);

    if (existingIndex > -1) {
        cart[existingIndex].qty = parseInt(cart[existingIndex].qty) + parseInt(qty);
    } else {
        cart.push({ id, name, price, img, qty: parseInt(qty) });
    }

    localStorage.setItem('cara_cart', JSON.stringify(cart));
    updateHeaderBadges();

    if (typeof renderCartTable === 'function') {
        renderCartTable();
    }
}

// Helper to show a modern, clean toast notification
function showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.right = '20px';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '10px';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.style.background = document.body.classList.contains('dark-mode') ? '#1e293b' : '#ffffff';
    toast.style.color = document.body.classList.contains('dark-mode') ? '#f8fafc' : '#1a1a1a';
    toast.style.borderLeft = '4px solid #088178';
    toast.style.padding = '12px 24px';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    toast.style.borderRadius = '4px';
    toast.style.fontFamily = '"Spartan", sans-serif';
    toast.style.fontSize = '14px';
    toast.style.fontWeight = '600';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.3s ease';

    toast.innerText = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 10);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Setup single product page details Add to Cart
function initializeSingleProductPage() {
    const detailContainer = document.querySelector('.single-pro-details');
    if (!detailContainer) return;

    const btn = detailContainer.querySelector('button');
    const qtyInput = detailContainer.querySelector('input[type="number"]');

    if (btn) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            const name = detailContainer.querySelector('h4').innerText;
            const priceText = detailContainer.querySelector('h2').innerText;
            const price = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;

            const mainImg = document.getElementById('MainImg');
            let img = mainImg ? mainImg.getAttribute('src') : '';

            let savedImgPath = img;
            if (img.startsWith('../')) {
                savedImgPath = img.substring(3);
            }

            const qty = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
            const id = savedImgPath ? savedImgPath.substring(savedImgPath.lastIndexOf('/') + 1, savedImgPath.lastIndexOf('.')) : 'f1';

            addToCart(id, name, price, savedImgPath, qty);
            showToast(`${qty} x ${name} added to cart!`);
        });
    }
}
