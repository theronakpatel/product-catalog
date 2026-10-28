export function filterProductsBySearch(products, searchTerm = "") {
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  if (!normalizedSearchTerm) {
    return [...products];
  }

  return products.filter((product) => product.name.toLowerCase().includes(normalizedSearchTerm));
}

export function filterProducts(products, { searchTerm = "", inStockOnly = false, minPrice, maxPrice } = {}) {
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const minimum = minPrice === "" || minPrice == null ? -Infinity : Number(minPrice);
  const maximum = maxPrice === "" || maxPrice == null ? Infinity : Number(maxPrice);

  return products.filter((product) =>
    product.name.toLowerCase().includes(normalizedSearchTerm) &&
    (!inStockOnly || product.inStock) &&
    product.price >= minimum && product.price <= maximum
  );
}
