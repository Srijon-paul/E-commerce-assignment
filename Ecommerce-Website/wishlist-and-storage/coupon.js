// Coupon and subtotal logic (extracted from cart.js)
(function () {
	function calculateAndShowTotals() {
		const cart = (typeof getCart === 'function') ? getCart() : (JSON.parse(localStorage.getItem('cara_cart')) || []);
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
				const couponInput = document.querySelector('#coupon input');
				if (couponInput) couponInput.value = '';
			});
		}
	}

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

			const cart = (typeof getCart === 'function') ? getCart() : (JSON.parse(localStorage.getItem('cara_cart')) || []);
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

	// Expose functions globally so cart rendering can call them
	window.calculateAndShowTotals = calculateAndShowTotals;
	window.initializeCouponLogic = initializeCouponLogic;

	// Auto-run on DOMContentLoaded
	document.addEventListener('DOMContentLoaded', () => {
		initializeCouponLogic();
		// allow other scripts to render table first and then compute totals
		setTimeout(calculateAndShowTotals, 50);
	});
})();
