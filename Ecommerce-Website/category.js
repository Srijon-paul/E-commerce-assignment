export function createCategories(
    allProducts,
    productSection,
    productContainer,
    onCategoryClick
) {

    const categoryContainer = document.createElement("div");

    categoryContainer.id = "categoryContainer";

    categoryContainer.className = "category-container";


    productSection.insertBefore(
        categoryContainer,
        productContainer
    );


    const categories = [
        "All",
        ...new Set(
            allProducts.map(product => product.category)
        )
    ];


    let categoryHTML = "";


    categories.forEach(category => {

        categoryHTML += `

        <div class="category-card"
             data-category="${category}">

            <p>${category}</p>

        </div>

        `;

    });


    categoryContainer.innerHTML = categoryHTML;


    document
    .querySelectorAll(".category-card")
    .forEach(card => {

        card.addEventListener("click", function(){

            document
            .querySelectorAll(".category-card")
            .forEach(c =>
                c.classList.remove("active")
            );


            this.classList.add("active");


            onCategoryClick(
                this.dataset.category
            );

        });

    });

}