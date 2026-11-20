# LIMEKO — інтернет-магазин (HTML + CSS + vanilla JS)

Запуск: відкрийте `index.html` у браузері (або `npx serve` / Live Server у VS Code).

## Структура
```
limeko/
├── index.html          # шапка, підвал, контейнер #app
├── css/style.css       # усі стилі (+ адаптив)
├── js/data.js          # товари, категорії, розміри, ціна  ← редагуйте тут
├── js/app.js           # роутер (#/...), сторінки, кошик, улюблене
└── images/
    ├── hero.jpg
    ├── categories/     # bracelets|rings|earrings|pendants .jpg
    └── products/       # <id>.jpg, id з data.js
```
## Маршрути
`#/` головна · `#/catalog` · `#/category/bracelets` · `#/product/b01` · `#/size/b01` · `#/cart` · `#/favorites` · `#/checkout` · `#/search/текст`

## Примітки
- Картинки нарізані зі скриншотів макетів (≈700px) — для продакшну замініть на оригінали з Figma.
- Кошик і улюблене зберігаються в localStorage.
- Крок «доставка» і відправка замовлення не реалізовані (немає в макетах): див. TODO в `js/app.js`.
