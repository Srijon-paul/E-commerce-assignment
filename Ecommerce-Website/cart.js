// Load dynamic product details on sproduct.html page load
const selectedProduct = JSON.parse(localStorage.getItem("selectedProduct"));
if (selectedProduct && document.getElementById("MainImg") && document.querySelector(".single-pro-details h4")) {
    document.getElementById("MainImg").src = selectedProduct.image;
    document.querySelector(".single-pro-details h4").innerText = selectedProduct.name;
    document.querySelector(".single-pro-details h2").innerText = selectedProduct.price;
    
    // Update the first thumbnail image to match the selected product
    const smallImgs = document.getElementsByClassName("small-img");
    if (smallImgs.length > 0) {
        smallImgs[0].src = selectedProduct.image;
    }
}

// Add to Cart handler on sproduct.html (Single Product Page)
const addToCartBtn = document.querySelector(".single-pro-details button.normal");
if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
        const nameEl = document.querySelector(".single-pro-details h4");
        const priceEl = document.querySelector(".single-pro-details h2");
        const imgEl = document.getElementById("MainImg");
        const qtyEl = document.querySelector(".single-pro-details input");

        if (nameEl && priceEl && imgEl) {
            const product = {
                name: nameEl.innerText.trim(),
                price: priceEl.innerText.trim(),
                image: imgEl.src,
                quantity: qtyEl ? Number(qtyEl.value) : 1
            };

            // Get old cart data
            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            // Add new product or increment quantity if it already exists (matching both name and image)
            const existingProductIndex = cart.findIndex(item => item.name === product.name && item.image === product.image);
            if (existingProductIndex > -1) {
                cart[existingProductIndex].quantity += product.quantity;
            } else {
                cart.push(product);
            }

            // Save again
            localStorage.setItem("cart", JSON.stringify(cart));
            alert("Product Added Successfully!");
        }
    });
}

// Add event listeners to product cards globally on index.html and shop.html
const products = document.querySelectorAll(".pro");
products.forEach(pro => {
    pro.addEventListener("click", (e) => {
        // Find if user clicked on the cart/basket icon or its link
        const cartLink = e.target.closest("a");
        const hasCartIcon = cartLink && (cartLink.querySelector(".cart") || cartLink.classList.contains("cart") || e.target.classList.contains("cart"));

        // Extract product info
        const imgEl = pro.querySelector("img");
        const nameEl = pro.querySelector(".des h5");
        const priceEl = pro.querySelector(".des h4");

        if (!imgEl || !nameEl || !priceEl) return;

        const name = nameEl.innerText.trim();
        const price = priceEl.innerText.trim();
        const image = imgEl.src;

        if (hasCartIcon) {
            e.preventDefault();
            e.stopPropagation();

            // Add to cart directly (matching both name and image)
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            const existingProductIndex = cart.findIndex(item => item.name === name && item.image === image);
            if (existingProductIndex > -1) {
                cart[existingProductIndex].quantity++;
            } else {
                cart.push({
                    name: name,
                    price: price,
                    image: image,
                    quantity: 1
                });
            }
            localStorage.setItem("cart", JSON.stringify(cart));
            alert("Product Added Successfully!");
            return;
        }

        // Otherwise, redirect to single product details page
        const product = { name, price, image };
        localStorage.setItem("selectedProduct", JSON.stringify(product));
        window.location.href = "sproduct.html";
    });
});

const cartItems = document.getElementById("cart-items");

if (cartItems) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    console.log(cart);

    cart.forEach((product, index) => {

        cartItems.innerHTML += `
            <tr>
                <td>
                    <i class='bx bx-x-circle remove-btn' data-index="${index}"></i>
                </td>

                <td>
                    <img src="${product.image}" width="70">
                </td>

                <td>${product.name}</td>

                <td>${product.price}</td>

                <td>
                    <button class="minus" data-index="${index}">-</button>

                    <span class="qty">${product.quantity}</span>

                    <button class="plus" data-index="${index}">+</button>
                </td>

                <td>
                    ₹${parseInt(product.price.replace(/[^0-9]/g, "")) * product.quantity}
                </td>
            </tr>
        `;

    });

    const removeButtons = document.querySelectorAll(".remove-btn");

    removeButtons.forEach((button) => {

        button.addEventListener("click", () => {

            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            const index = button.dataset.index;

            cart.splice(index, 1);

            localStorage.setItem("cart", JSON.stringify(cart));

            location.reload();

        });

    });

    const plusButtons = document.querySelectorAll(".plus");

    plusButtons.forEach((button) => {

        button.addEventListener("click", () => {

            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            const index = button.dataset.index;

            cart[index].quantity++;

            localStorage.setItem("cart", JSON.stringify(cart));

            location.reload();

        });

    });

    const minusButtons = document.querySelectorAll(".minus");

    minusButtons.forEach((button) => {

        button.addEventListener("click", () => {

            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            const index = button.dataset.index;

            if (cart[index].quantity > 1) {
                cart[index].quantity--;

                localStorage.setItem("cart", JSON.stringify(cart));

                location.reload();
            }

        });

    });
}

const checkoutBtn = document.getElementById("checkoutBtn");

if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }
        // Store cart data for checkout page
        localStorage.setItem("checkoutCart", JSON.stringify(cart));
        // Navigate to checkout page
        window.location.href = "checkout.html";
    });
}

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let total = 0;

cart.forEach(product => {
    total += parseInt(product.price.replace(/[^0-9]/g, "")) * product.quantity;
});

const subtotal = document.getElementById("cart-subtotal");
const grandTotal = document.getElementById("cart-total");

if (subtotal && grandTotal) {
    subtotal.innerText = "₹" + total;
    grandTotal.innerText = "₹" + total;
}