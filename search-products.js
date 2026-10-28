export function filterProductsBySearch(products, searchTerm = "") {
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  if (!normalizedSearchTerm) {
    return [...products];
  }

  return products.filter((product) => product.name.toLowerCase().includes(normalizedSearchTerm));
}

export function createDefaultFilterState(){
  return {
    searchTerm: "",
    category: "",
    inStockOnly: false,
    minPrice: "",
    maxPrice: "",
    direction: undefined
  }
}

export function filterProducts(products, { searchTerm = "", inStockOnly = false, category = "", minPrice, maxPrice } = {}) {
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const minimum = minPrice === "" || minPrice == null ? -Infinity : Number(minPrice);
  const maximum = maxPrice === "" || maxPrice == null ? Infinity : Number(maxPrice);

  return products.filter((product) =>
    product.name.toLowerCase().includes(normalizedSearchTerm) &&
    (category === "" || product.category === category) &&
    (!inStockOnly || product.inStock) &&
    product.price >= minimum && product.price <= maximum
  );
}
