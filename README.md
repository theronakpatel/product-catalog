# Fix and Test Incorrect Product Price Sorting

A compact preparation project for demonstrating how string comparison can sort prices incorrectly, then fixing it with a numeric comparator.

## Run it

1. Open this folder in VS Code.
2. Open the integrated terminal with **Terminal → New Terminal**.
3. Use a current Node.js version (Node 18+), then run `npm test` to execute the tests.
4. Run `npm start` to start the catalog.
5. Open `http://localhost:3000` in your browser. Keep the terminal running while you use the catalog; press `Ctrl+C` in the terminal to stop it.

Do not open `index.html` directly with a `file://` address: browsers block module scripts from that location.

## Recording path

`sortPricesAsStrings` in `sort-products.js` intentionally preserves the defect: it converts prices to text, so `125` is ordered before `19.99`.

`sortProductsByPrice` is the production utility used by the UI. Its numeric subtraction comparator is the minimal fix. The test file documents the legacy bad result and verifies ascending and descending numeric sorting.
