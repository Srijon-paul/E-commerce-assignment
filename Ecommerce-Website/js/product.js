// Product selection and Add-to-Cart (site-wide)
// This file focuses on selecting products and adding them to the shared `cara_cart` storage

// If a product was selected (from product list), populate single product page
const selectedProduct = JSON.parse(localStorage.getItem("selectedProduct"));
if (selectedProduct && document.getElementById("MainImg") && document.querySelector(".single-pro-details h4")) {
    document.getElementById("MainImg").src = selectedProduct.image;
    document.querySelector(".single-pro-details h4").innerText = selectedProduct.name;
    document.querySelector(".single-pro-details h2").innerText = selectedProduct.price;
    const smallImgs = document.getElementsByClassName("small-img");
    if (smallImgs.length > 0) smallImgs[0].src = selectedProduct.image;
}

// Note: adding items to `cara_cart` is handled by `wishlist-and-storage/wishlist.js`.
// This file only handles product selection/navigation and single-product population.

// Add to cart from product cards on index/shop pages
document.querySelectorAll('.pro').forEach(pro => {
    pro.addEventListener('click', (e) => {
        const cartLink = e.target.closest('a');
        const clickedCart = cartLink && (cartLink.querySelector('.cart') || cartLink.classList.contains('cart') || e.target.classList.contains('cart'));

        const imgEl = pro.querySelector('img');
        const nameEl = pro.querySelector('.des h5');
        const priceEl = pro.querySelector('.des h4');
        if (!imgEl || !nameEl || !priceEl) return;

        const name = nameEl.innerText.trim();
        const price = parseInt(priceEl.innerText.replace(/[^0-9]/g, '')) || 0;
        const img = imgEl.src;
        const id = img ? img.substring(img.lastIndexOf('/') + 1, img.lastIndexOf('.')) : ('p-' + Date.now());

        if (clickedCart) {
            // Let the dedicated wishlist/cart script handle cart icon clicks to avoid double-adds
            return;
        }

        // otherwise navigate to single product
        localStorage.setItem('selectedProduct', JSON.stringify({ name, price: '₹' + price, image: img }));
        window.location.href = 'sproduct.html';
    });
});