import assert from "node:assert/strict";
import test from "node:test";
import { products } from "../products.js";
import { sortPricesAsStrings, sortProductsByPrice } from "../sort-products.js";

const prices = (items) => items.map((item) => item.price);

test("sorts product prices numerically from low to high", () => {
  assert.deepEqual(prices(sortProductsByPrice(products)), [5.75, 8.5, 12.5, 19.99, 24, 125]);
});

test("sorts product prices numerically from high to low", () => {
  assert.deepEqual(prices(sortProductsByPrice(products, "desc")), [125, 24, 19.99, 12.5, 8.5, 5.75]);
});
