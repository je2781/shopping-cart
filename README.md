# E-commerce Product & Cart Page

This project is a React + Inertia.js implementation of a product catalog with a shopping cart. It allows users to browse products, manage quantities, and add items to the cart. Cart updates are synced with the backend using Inertia.js forms, supporting incrementing quantities and stock validation.

---

## Features

- **Product Listing**: Display all available products with images, names, price, and stock status.
- **Quantity Management**: Increment, decrement, or manually set product quantities.
- **Add to Cart**: Add products to the cart with quantity validation and stock limit checks.
- **Incremental Cart Updates**: Existing cart items are updated rather than replaced.
- **Cart State Sync**: Cart data is automatically synced with the backend via Inertia.js.
- **Responsive UI**: Designed to work on mobile and desktop devices.
- **Notifications**: Uses `react-hot-toast` for success/error messages.
- **User Authentication Integration**: Shows login/logout/register buttons based on user authentication state.

---

## Tech Stack

- **Frontend**:
  - React 18
  - TypeScript
  - Tailwind CSS
  - Lucide Icons
  - Inertia.js
  - react-hot-toast

- **Backend**:
  - Laravel (via Inertia.js)
  - Laravel routes for cart management (`cart.store`, `cart.index`)
  - Authentication handled via Laravel

---

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/je2781/shopping-cart.git
cd shop
