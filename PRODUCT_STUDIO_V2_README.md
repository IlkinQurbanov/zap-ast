# Zapçast.az — Product Studio 2.0

This updated package was built from the user-uploaded **Zapcast_Premium_Updated_Website (1).zip**.

## What changed

- Replaced all **42** product images at `assets/images/premium/products/*.webp`.
- Kept exact product IDs and filenames: `t1…t17`, `b1…b10`, `o1…o10`, `r1…r2`, `p1…p3`.
- Introduced clearer merchandising, brighter background lighting and consistent catalogue product sizing.
- Used enhanced photorealistic concept packshots for the demo products `t3` (Arcadia tyre), `b5` (Voltacore AGM battery), `r2` (Forgia alloy wheel), `p3` (Partwell brake pads).
- Kept the original 42 transparent demo renders in `assets/images/products/` so they can be compared or restored.
- Updated `css/premium.css` with small, non-destructive media styling and documentation comment in `js/data/products.js`.

## Preview

Open `index.html` in Chrome, or from the site directory run:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` and scroll to the products section. All product-detail pages also use the new assets.

## Important

**The catalogue is demo data.** These images are *visual prototypes*, not verified photographs of genuine manufacturer products. The demo brands, prices, and inventory are not actual sale offers. Before launching a store, replace images with licensed photos corresponding to the exact SKU, size, DOT/packaging, and manufacturer specifications.

No cart, search, checkout, or data logic has been changed.
