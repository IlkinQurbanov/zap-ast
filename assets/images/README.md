# Şəkillər

Real məhsul fotoları buraya qoyulur. Fayl yoxdursa və ya yüklənmirsə, sayt avtomatik olaraq
məhsulun SVG illüstrasiyasını göstərir.

## Məhsul fotoları

1. Faylı `assets/images/products/` qovluğuna qoyun, adı məhsul kodu ilə: `t1-1.webp`, `t1-2.webp`, `b4-1.webp`.
   - Tövsiyə: kvadrat (1:1), ən azı 800×800 px, şəffaf və ya açıq fon, WebP.
2. `js/data/products.js` faylında həmin məhsulun `images` sahəsinə yolları yazın:

```js
images: ["assets/images/products/t1-1.webp", "assets/images/products/t1-2.webp"],
```

Birinci foto kartda və qalereyanın əsas şəklində göstərilir; təkərlər üçün EU etiketi
görünüşü qalereyada saxlanılır.

## Banner və loqo

`assets/images/banners/` — kampaniya bannerləri (tövsiyə 1600×700 px).
