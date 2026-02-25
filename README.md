# AssiutCart - Online Store

A simple e-commerce web application built with HTML, CSS, JavaScript, and Bootstrap 5.

## Features

- **User Authentication** – Sign up, log in, and log out (stored in localStorage)
- **Product Browsing** – Browse 100+ products fetched from [DummyJSON API](https://dummyjson.com)
- **Product Slider** – Custom JS slider showing top-rated products
- **Search & Filters** – Search by name, filter by category, price range, brand, and sort
- **Pagination** – Product grid with page navigation
- **Shopping Cart** – Add/remove items, adjust quantities (stored in sessionStorage)
- **Checkout** – Place orders and see order confirmation with total

## Pages

| Page | Description |
|------|-------------|
| `home.html` | Landing page with hero section |
| `html/shop.html` | Main shop with slider, filters, and product grid |
| `html/product.html` | Single product detail page |
| `html/cart.html` | Cart page with item management and checkout |
| `html/order.html` | Order confirmation page |
| `html/login.html` | Login page |
| `html/sign_up.html` | Sign up page |

## Project Structure

```
stitch_create_account/
├── home.html
├── html/
│   ├── shop.html
│   ├── product.html
│   ├── cart.html
│   ├── order.html
│   ├── login.html
│   └── sign_up.html
├── css/
│   ├── bootstrap.min.css
│   └── styles.css
├── js/
│   ├── bootstrap.min.js
│   ├── auth.js
│   ├── cart.js
│   ├── cart-page.js
│   ├── slider.js
│   ├── pagination.js
│   ├── filters.js
│   ├── signup-page.js
│   └── product-page.js
└── images/
```

## Technologies

- HTML5
- CSS3
- JavaScript (ES6)
- Bootstrap 5
- Bootstrap Icons (CDN)
- DummyJSON API

## How to Run

1. Clone the repository
2. Open `home.html` in your browser
3. Create an account or log in to access the shop

## API

Products are fetched from [DummyJSON](https://dummyjson.com/products) — no backend needed.
