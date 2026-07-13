// Cart Page Logic (cart.html)
document.addEventListener('DOMContentLoaded', () => {
    // Only run if cart-items tbody exists
    if (document.getElementById('cart-items')) {
        renderCartTable();
        // coupon logic moved to wishlist-and-storage/coupon.js
    }
});

// Render the cart table rows from localStorage
function renderCartTable() {
    const tbody = document.getElementById('cart-items');
    if (!tbody) return;

    const cart = getCart();
    tbody.innerHTML = '';

    if (cart.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="padding: 40px; text-align: center; font-size: 18px;">
                    Your cart is empty. <a href="shop.html" style="color: #088178; font-weight: bold; text-decoration: underline;">Go Shopping</a>
                </td>
            </tr>
        `;
        updateSubtotal(0);
        return;
    }

    cart.forEach((item, index) => {
        const tr = document.createElement('tr');
        const itemSubtotal = item.price * item.qty;

        tr.innerHTML = `
            <td><a href="#" class="remove-cart-item" data-id="${item.id}"><i class='bx bx-x-circle'></i></a></td>
            <td><img src="${item.img}" alt="${item.name}"></td>
            <td>${item.name}</td>
            <td>₹${item.price}</td>
            <td><input type="number" class="cart-qty-input" data-id="${item.id}" value="${item.qty}" min="1"></td>
            <td class="item-subtotal-cell">₹${itemSubtotal}</td>
        `;

        // Quantity change listener
        const qtyInput = tr.querySelector('.cart-qty-input');
        qtyInput.addEventListener('change', (e) => {
            const newQty = parseInt(e.target.value) || 1;
            updateItemQuantity(item.id, newQty);
        });

        // Remove item listener
        const removeBtn = tr.querySelector('.remove-cart-item');
        removeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            removeCartItem(item.id);
        });

        tbody.appendChild(tr);
    });

    // calculateAndShowTotals is provided by wishlist-and-storage/coupon.js
    if (typeof calculateAndShowTotals === 'function') calculateAndShowTotals();
}

// Update the quantity of a cart item
function updateItemQuantity(id, qty) {
    let cart = getCart();
    const idx = cart.findIndex(item => item.id === id);
    if (idx > -1) {
        cart[idx].qty = qty;
        localStorage.setItem('cara_cart', JSON.stringify(cart));
        renderCartTable();
        // Update the header badge as well
        if (typeof updateHeaderBadges === 'function') {
            updateHeaderBadges();
        }
    }
}

// Remove an item from the cart
function removeCartItem(id) {
    let cart = getCart();
    const idx = cart.findIndex(item => item.id === id);
    if (idx > -1) {
        const itemName = cart[idx].name;
        cart.splice(idx, 1);
        localStorage.setItem('cara_cart', JSON.stringify(cart));
        renderCartTable();
        if (typeof showToast === 'function') {
            showToast(`${itemName} removed from cart`);
        }
        if (typeof updateHeaderBadges === 'function') {
            updateHeaderBadges();
        }
    }
}

// Calculate subtotals, apply coupons, and show them in subtotal container
function calculateAndShowTotals() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // Check if there is an active coupon applied in localStorage
    const activeCoupon = JSON.parse(localStorage.getItem('cara_active_coupon'));
    let discount = 0;

    if (activeCoupon && subtotal > 0) {
        if (activeCoupon.type === 'percent') {
            discount = subtotal * (activeCoupon.value / 100);
        } else if (activeCoupon.type === 'flat') {
            discount = Math.min(activeCoupon.value, subtotal);
        }
    }

    const total = Math.max(0, subtotal - discount);
    updateSubtotal(subtotal, discount, total, activeCoupon);
}

// Update UI fields under Cart Total
function updateSubtotal(subtotal, discount = 0, total = 0, activeCoupon = null) {
    const subtotalTable = document.querySelector('#subtotal table');
    if (!subtotalTable) return;

    let rowsHTML = `
        <tr>
            <td>Cart Subtotal</td>
            <td>₹${subtotal}</td>
        </tr>
    `;

    if (discount > 0 && activeCoupon) {
        rowsHTML += `
            <tr style="color: #088178; font-weight: 600;">
                <td>Discount (${activeCoupon.code}) <a href="#" id="remove-coupon-btn" style="color: #ef4444; margin-left: 5px; font-size: 12px;">[Remove]</a></td>
                <td>- ₹${discount.toFixed(0)}</td>
            </tr>
        `;
    }

    rowsHTML += `
        <tr>
            <td>Shipping</td>
            <td>Free</td>
        </tr>
        <tr>
            <td><strong>Total</strong></td>
            <td><strong>₹${total.toFixed(0)}</strong></td>
        </tr>
    `;

    subtotalTable.innerHTML = rowsHTML;

    // Set up remove coupon button handler if it exists
    const removeCouponBtn = document.getElementById('remove-coupon-btn');
    if (removeCouponBtn) {
        removeCouponBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('cara_active_coupon');
            calculateAndShowTotals();
            if (typeof showToast === 'function') {
                showToast('Coupon removed');
            }
            // Clear input coupon text
            const couponInput = document.querySelector('#coupon input');
            if (couponInput) couponInput.value = '';
        });
    }
}

// Initialize coupon submission event handler
function initializeCouponLogic() {
    const couponContainer = document.getElementById('coupon');
    if (!couponContainer) return;

    const input = couponContainer.querySelector('input');
    const applyBtn = couponContainer.querySelector('button');

    if (!input || !applyBtn) return;

    // Populate input if a coupon is already active
    const activeCoupon = JSON.parse(localStorage.getItem('cara_active_coupon'));
    if (activeCoupon) {
        input.value = activeCoupon.code;
    }

    applyBtn.addEventListener('click', () => {
        const code = input.value.trim().toUpperCase();

        // Remove previous message if any
        const oldMsg = couponContainer.querySelector('.coupon-message');
        if (oldMsg) oldMsg.remove();

        const msgDiv = document.createElement('div');
        msgDiv.className = 'coupon-message';

        const cart = getCart();
        if (cart.length === 0) {
            msgDiv.className += ' error';
            msgDiv.innerText = 'Add items to your cart first!';
            couponContainer.appendChild(msgDiv);
            return;
        }

        if (code === '') {
            msgDiv.className += ' error';
            msgDiv.innerText = 'Please enter a coupon code.';
            couponContainer.appendChild(msgDiv);
            return;
        }

        // Validate coupon code
        let couponData = null;
        if (code === 'SAVE10') {
            couponData = { code: 'SAVE10', type: 'percent', value: 10 };
        } else if (code === 'FLAT200') {
            couponData = { code: 'FLAT200', type: 'flat', value: 200 };
        } else if (code === 'CARA50') {
            couponData = { code: 'CARA50', type: 'percent', value: 50 };
        }

        if (couponData) {
            localStorage.setItem('cara_active_coupon', JSON.stringify(couponData));
            calculateAndShowTotals();
            msgDiv.className += ' success';
            msgDiv.innerText = `Coupon '${code}' applied successfully!`;
            if (typeof showToast === 'function') {
                showToast(`Coupon '${code}' applied!`);
            }
        } else {
            msgDiv.className += ' error';
            msgDiv.innerText = 'Invalid coupon code. Try SAVE10, FLAT200, or CARA50.';
        }

        couponContainer.appendChild(msgDiv);
    });
}

// Checkout button handler: store cara_cart into checkoutCart and redirect
document.addEventListener('DOMContentLoaded', () => {
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (!checkoutBtn) return;

    checkoutBtn.addEventListener('click', () => {
        const cart = getCart();
        if (!cart || cart.length === 0) {
            if (typeof showToast === 'function') showToast('Your cart is empty!');
            else alert('Your cart is empty!');
            return;
        }

        // Normalize items for checkout page (fields expected by checkout.html)
        const checkoutItems = cart.map(item => ({
            name: item.name,
            price: '₹' + item.price,
            image: item.img,
            quantity: item.qty
        }));

        localStorage.setItem('checkoutCart', JSON.stringify(checkoutItems));
        window.location.href = 'checkout.html';
    });
});
