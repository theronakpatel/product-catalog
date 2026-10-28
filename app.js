import { products } from "./products.js";
import { filterProducts, createDefaultFilterState } from "./search-products.js";
import { sortProductsByPrice } from "./sort-products.js";

const productList = document.querySelector("#product-list");
const sortStatus = document.querySelector("#sort-status");
const productSearch = document.querySelector("#product-search");
const inStockOnly = document.querySelector("#in-stock-only");
const productCategory = document.querySelector("#product-category");
const minPrice = document.querySelector("#min-price");
const maxPrice = document.querySelector("#max-price");
const priceError = document.querySelector("#price-error");
const clearFilters = document.querySelector("#clear-filters");
const formatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
let activeDirection;

function renderProducts(items) {
  if (!items.length) {
    const emptyState = document.createElement("p");
    emptyState.textContent = "No products match your search.";
    productList.replaceChildren(emptyState);
    return;
  }

  productList.replaceChildren(
    ...items.map((product) => {
      const card = document.createElement("article");
      card.className = "product";

      const image = document.createElement("img");
      image.className = "product-image";
      image.src = product.image;
      image.alt = product.name;

      const name = document.createElement("h2");
      name.textContent = product.name;

      const category = document.createElement("p");
      category.className = "category";
      category.textContent = product.category;

      const price = document.createElement("p");
      price.className = "price";
      price.textContent = formatter.format(product.price);

      const stockStatus = document.createElement("p");
      stockStatus.className = product.inStock ? "stock-status in-stock" : "stock-status out-of-stock";
      stockStatus.textContent = product.inStock ? "In stock" : "Out stock";

      const productDetails = document.createElement("div");
      productDetails.className = "product-details";
      productDetails.append(name, category);

      card.append(image, productDetails, price, stockStatus);
      return card;
    })
  );
}

function updateCatalog() {
  const minValue = minPrice.value.trim();
  const maxValue = maxPrice.value.trim();

  const priceInputs = [
    {element: minPrice, value: minValue, label: "Minimum"},
    {element: maxPrice, value: maxValue, label: "Maximum"}
  ]
  let validationMessage = "";
  
  for(const {element, value, label} of priceInputs){
    element.removeAttribute("aria-invalid");

    if(value === ""){
      continue;
    }

    if (!/^\d+(?:\.\d{1,2})?$/.test(value)) {
      validationMessage = `${label} price must be non-negative amount with no more than two decimals.`;
      element.setAttribute("aria-invalid","true");
      break;
    }
  }

  if(!validationMessage &&  minValue !== "" && maxValue !== "" && Number(minValue) > Number(maxValue)){
    validationMessage = "Minimum price must be less than or equal to maximum price";
    minPrice.setAttribute("aria-invalid", "true");
    maxPrice.setAttribute("aria-invalid", "true");
  }
  priceError.textContent = validationMessage;
  if(validationMessage){
    return;
  }


  const filteredProducts = filterProducts(products, {
    searchTerm: productSearch.value,
    inStockOnly: inStockOnly.checked,
    category: productCategory.value,
    minPrice: minPrice.value,
    maxPrice: maxPrice.value
  });
  const displayedProducts = activeDirection
    ? sortProductsByPrice(filteredProducts, activeDirection)
    : filteredProducts;

  renderProducts(displayedProducts);
  sortStatus.textContent = activeDirection
    ? `Showing ${displayedProducts.length} product${displayedProducts.length === 1 ? "" : "s"}, sorted by price: ${activeDirection === "asc" ? "low to high" : "high to low"}.`
    : `Showing ${displayedProducts.length} product${displayedProducts.length === 1 ? "" : "s"}.`;
}

function clearCatalogFilters(){
  const defaultFilters = createDefaultFilterState();

  productSearch.value = defaultFilters.searchTerm;
  productCategory.value = defaultFilters.category;
  inStockOnly.checked = defaultFilters.inStockOnly;
  minPrice.value = defaultFilters.minPrice;
  maxPrice.value = defaultFilters.maxPrice;
  activeDirection = defaultFilters.direction;
  
  priceError.textContent = "";
  minPrice.removeAttribute("aria-invalid");
  maxPrice.removeAttribute("aria-invalid");

  updateCatalog();
}

document.querySelectorAll("[data-direction]").forEach((button) => {
  button.addEventListener("click", () => {
    activeDirection = button.dataset.direction;
    updateCatalog();
  });
});

productSearch.addEventListener("input", updateCatalog);
inStockOnly.addEventListener("change", updateCatalog);
productCategory.addEventListener("change",updateCatalog);
minPrice.addEventListener("input", updateCatalog);
maxPrice.addEventListener("input", updateCatalog);
clearFilters.addEventListener("click", clearCatalogFilters);

updateCatalog();
