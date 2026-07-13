export function createSearchBox(productSection, productContainer) {

    const searchInput = document.createElement("input");

    searchInput.type = "text";
    searchInput.id = "searchInput";
    searchInput.placeholder = "🔍 Search Products...";

    productSection.insertBefore(
        searchInput,
        productContainer
    );

    return searchInput;

}