const productDetails =
document.getElementById("productDetails");



const params =
new URLSearchParams(window.location.search);



const id =
params.get("id");



async function getProductDetails(){


    const response =
    await fetch(
        `https://fakestoreapi.com/products/${id}`
    );


    const product =
    await response.json();



    productDetails.innerHTML = `


    <div class="single-product">


        <img 
        src="${product.image}"
        >


        <div>

            <h1>
            ${product.title}
            </h1>


            <h2>
            ₹${product.price}
            </h2>


            <p>
            ${product.description}
            </p>


            <h3>
            Category:
            ${product.category}
            </h3>


            <h3>
            ⭐ ${product.rating.rate}
            </h3>


            <button>
            Add To Cart
            </button>


        </div>


    </div>


    `;


}


getProductDetails();