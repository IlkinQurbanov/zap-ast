# Zapçast Premium Visual Refresh

This is an updated version of the original static website. Open `index.html` with a local web server or deploy these files to GitHub Pages; no build step required.

## What changed

- Four photography-based home slider backgrounds (the slider remains functional)
- Photographic seasonal promotion and corporate marketing banner
- Premium category images for all seven categories
- Four editorial/article thumbnails and three video-thumbnail covers
- Cohesive, bright studio-composited imagery for all 42 demo product cards, retaining each original demo product render and label
- New `css/premium.css` with responsive styling overrides for the homepage, catalog cards, editorial cards, and marketing sections
- Updated image references in `js/modules/home.js`, `js/data/products.js` and `index.html`
- Original assets kept unchanged under `assets/images/products/`

## Usage

From the project folder:

```bash
python3 -m http.server 8000
```
Then open http://localhost:8000/.

The project uses placeholder products, prices, stocks, brands, and a demo checkout. **The generated promotional photography is illustrative, not a representation of specific merchandise being sold.** Product render composites retain original demo artwork but are not verified real product photos. Replace these visuals with manufacturer/supplier-approved images of the exact SKU and confirm rights before using in a live store.

## Files

- `assets/images/premium/hero-*.webp`: generated cinematic hero/marketing photos
- `assets/images/premium/categories/`: category photographs
- `assets/images/premium/editorial/`: editorial and video card backgrounds
- `assets/images/premium/products/`: studio-composited demo render packshots

To edit the main homepage look, modify `css/premium.css`. No backend, payment, inventory, or account functionality was added or changed.
