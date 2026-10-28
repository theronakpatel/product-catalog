import assert from "node:assert/strict";
import test from "node:test";
import { products } from "../products.js";
import { filterProducts, filterProductsBySearch, createDefaultFilterState } from "../search-products.js";
import { sortProductsByPrice } from "../sort-products.js";
import { accessSync } from "node:fs";

test("finds products by name without case sensitivity", () => {
  assert.deepEqual(filterProductsBySearch(products, "MUG").map((product) => product.name), ["Trail Mug"]);
});

test("returns all products when the search is empty", () => {
  assert.equal(filterProductsBySearch(products).length, 6);
});

test("sorts filtered results by numeric price", () => {
  const filteredProducts = filterProductsBySearch(products, "o");

  assert.deepEqual(prices(sortProductsByPrice(filteredProducts)), [5.75, 12.5, 24]);
});

test("filters to in-stock products only", () => {
  assert.deepEqual(filterProducts(products, { inStockOnly: true }).map((product) => product.name), [
    "Camp Lantern", "Trail Mug", "Pocket Compass", "Field Notebook"
  ]);
});

test("filters by an inclusive price range", () => {
  assert.deepEqual(filterProducts(products, { minPrice: "8.5", maxPrice: "19.99" }).map((product) => product.name), [
    "Camp Lantern", "Trail Mug", "Pocket Compass"
  ]);
});

test("combines search, stock, and price filters", () => {
  assert.deepEqual(filterProducts(products, {
    searchTerm: "compass",
    inStockOnly: true,
    minPrice: "10",
    maxPrice: "20"
  }).map((product) => product.name), ["Pocket Compass"]);
});

test("returns no products when the price range matches nothing", () => {
  assert.deepEqual(filterProducts(products, { minPrice: "200" }), []);
});

test("returns all products when no filters are selected", () => {
  assert.equal(filterProducts(products).length, 6);
});

test("included products at both price range boundries", () => {
  const matches = filterProducts(products, {minPrice: "8.5", maxPrice: "19.99"});
  assert.deepEqual(matches.map((product) => product.name),[
    "Camp Lantern",
    "Trail Mug",
    "Pocket Compass"
  ]);
});

test("allows a minimum price without a maximum",() =>{
 const matches = filterProducts(products, { minPrice: "100"});
 assert.deepEqual(matches.map((product) => product.name),["Summit Pack"]);
});

test("filters products by category", () =>{
  const matches = filterProducts(products, {category: "Camping"});
  assert.deepEqual(matches.map((product) => product.name), ["Camp Lantern"]);
});

test("returns no products for an unknown category", () => {
  const matches = filterProducts(products, {category: "Footwear"});
  assert.deepEqual(matches, []);
});

test("combines category and in-stock filters", () => {
 const matches = filterProducts(products, {
   category: "Camping",
   inStockOnly: true
 })
});

test("provides the default cleared filter values", () => {
  assert.deepEqual(createDefaultFilterState(),{
    searchTerm: "",
    category: "",
    inStockOnly: false,
    minPrice: "",
    maxPrice: "",
    direction: undefined
  })
});

test("returns produts in catalog order after filters are cleared", () => {
  const defaultFilters = createDefaultFilterState();
  const matches = filterProducts(products, defaultFilters);

  assert.deepEqual(
    matches.map((product) => product.id),
    products.map((product) => product.id)
  )

})

function prices(items) {
  return items.map((item) => item.price);
}
