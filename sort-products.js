/**
 * Preserves the legacy defect for the recording: converting prices to strings
 * puts "125" before "19.99" in an ascending sort.
 */
export function sortPricesAsStrings(products, direction = "asc") {
  const multiplier = direction === "desc" ? -1 : 1;

  return [...products].sort(
    (first, second) =>
      multiplier *
      String(first.price).localeCompare(String(second.price))
  );
}

export function sortProductsByPrice(products, direction = "asc") {
  const multiplier = direction === "desc" ? -1 : 1;

  return [...products].sort(
    (first, second) =>
      multiplier * (first.price - second.price)
  );
}
