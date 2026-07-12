export function displayProducts(products, productContainer) {

    productContainer.innerHTML = "";


    if (products.length === 0) {

        productContainer.innerHTML = `

            <h2 style="text-align:center;width:100%;">
                No Products Found
            </h2>

        `;

        return;

    }


    products.forEach(product => {

        productContainer.innerHTML += `

        <div class="pro" data-id="${product.id}">

            <img 
            src="${product.image}" 
            alt="${product.title}"
            >


            <div class="des">

                <span>
                    No Brand
                </span>


                <h5>
                    ${product.title}
                </h5>


                <div class="star">
                    ⭐ ${product.rating.rate}
                </div>


                <h4>
                    ₹${product.price}
                </h4>


                <p>
                    ${product.category}
                </p>


            </div>


            <a href="#" class="cart">
                <i class='bx bx-cart'></i>
            </a>


        </div>

        `;

    });


//product click


    document
    .querySelectorAll(".pro")
    .forEach(card => {


        card.addEventListener("click", function(e){


            // Don't open details when cart button clicked
            if(e.target.closest(".cart")){
                return;
            }


            const productId =
                this.dataset.id;


            window.location.href =
            `product_details.html?id=${productId}`;


        });


    });


}