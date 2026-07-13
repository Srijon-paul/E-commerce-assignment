import { getProducts } from "./api.js";

import { createSearchBox } from "./search.js";

import { createCategories } from "./category.js";

import { displayProducts } from "./product.js";


const productContainer =
    document.getElementById("productContainer");


const productSection =
    document.getElementById("product1");


let allProducts = [];

let selectedCategory = "All";


//create search box
const searchInput =
    createSearchBox(
        productSection,
        productContainer
    );


//filter function


function filterProducts(){


    const keyword =
        searchInput.value.toLowerCase();



    const filteredProducts =
        allProducts.filter(product => {



            const searchMatch =
                product.title
                .toLowerCase()
                .includes(keyword);



            const categoryMatch =
                selectedCategory === "All" ||
                product.category === selectedCategory;



            return searchMatch && categoryMatch;



        });



    displayProducts(
        filteredProducts,
        productContainer
    );


}

// search event


searchInput.addEventListener(
    "input",
    filterProducts
);



async function init(){



    allProducts =
        await getProducts();




    createCategories(

        allProducts,

        productSection,

        productContainer,


        function(category){


            selectedCategory =
                category;



            filterProducts();


        }

    );


    displayProducts(

        allProducts,

        productContainer

    );



}


init();