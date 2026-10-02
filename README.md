# ShopEase — Full Stack E-commerce Store

A complete full-stack e-commerce web application built for the **CodeAlpha Full Stack Development Internship — Task 1 (Simple E-commerce Store)**.

ShopEase lets users browse products, view detailed product pages, register/login, manage a shopping cart, check out with a shipping form, place orders, and track order history — backed by a real Express + MongoDB REST API with JWT authentication. It also includes an admin dashboard for managing products, orders, and users.

---

## Features

- 🛍️ Product catalog with search, category filters, price filters, sorting, and pagination
- 📄 Detailed product pages with related products
- 🔐 JWT-based authentication (register/login) with bcrypt password hashing
- 🛒 Fully working shopping cart (add/remove/update quantity, live totals)
- 💳 Checkout flow with shipping form + Cash on Delivery / simulated online payment
- 📦 Order placement, order history, and an order-success confirmation page
- 👤 User profile management
- 🛠️ Admin dashboard: manage products (CRUD), manage orders (status updates), manage users, view store stats
- 📱 Fully responsive UI (mobile, tablet, desktop) built with Bootstrap 5
- 🔒 Backend validation, protected routes, and role-based authorization (user vs admin)

---

## Technology Stack

**Frontend:** HTML5, CSS3, Vanilla JavaScript, Bootstrap 5, Font Awesome
**Backend:** Node.js, Express.js
**Database:** MongoDB with Mongoose
**Auth:** JSON Web Tokens (JWT), bcryptjs
**Other:** dotenv, CORS, custom Express middleware

---

## Folder Structure

```
ShopEase/
├── backend/
│   ├── config/db.js
│   ├── controllers/         # authController, productController, orderController, userController
│   ├── middleware/          # authMiddleware, adminMiddleware, errorMiddleware
│   ├── models/              # User, Product, Order (Mongoose schemas)
│   ├── routes/              # authRoutes, productRoutes, orderRoutes, adminRoutes
│   ├── seed/seed.js         # seeds admin + demo users + 20 products
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── index.html, products.html, product-details.html
│   ├── login.html, register.html
│   ├── cart.html, checkout.html, order-success.html
│   ├── orders.html, profile.html, admin.html
│   ├── css/style.css
│   ├── js/                  # config, api, auth, cart, ui-helpers, + one file per page
│   └── assets/
│
├── .env.example
├── .gitignore
└── README.md
```

---

## Installation & Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) v18+
- A MongoDB database — either [MongoDB Community Server](https://www.mongodb.com/try/download/community) running locally, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 2. Clone / download the project
```bash
git clone https://github.com/<your-username>/CodeAlpha_Simple-Ecommerce-Store.git
cd CodeAlpha_Simple-Ecommerce-Store
```

### 3. Configure environment variables
Copy the example env file and fill in real values:
```bash
cp .env.example backend/.env
```
Edit `backend/.env`:
```
MONGO_URI=mongodb://127.0.0.1:27017/shopease
JWT_SECRET=some_long_random_secret_string
PORT=5000
```
> If using MongoDB Atlas, `MONGO_URI` will look like `mongodb+srv://<user>:<password>@cluster.mongodb.net/shopease`.
> **Never commit your real `.env` file.**

### 4. Install backend dependencies
```bash
cd backend
npm install
```

### 5. Seed the database (creates admin, demo users, and 20 products)
```bash
npm run seed
```
This prints demo login credentials to the console:
- **Admin:** `admin@shopease.com` / `Admin@123`
- **User:** `riya@example.com` / `User@123`

### 6. Run the backend
```bash
npm run dev    # with nodemon (auto-restarts on changes)
# or
npm start
```
The API will run at `http://localhost:5000/api`.

### 7. Run the frontend
The backend already serves the `frontend/` folder as static files, so once the backend is running you can simply open:
```
http://localhost:5000
```
Alternatively, open `frontend/index.html` directly with a tool like VS Code's Live Server — `frontend/js/config.js` automatically points to `http://localhost:5000/api` when running on `localhost`.

---

## API Documentation

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and receive a JWT |
| GET | `/api/auth/profile` | Private | Get current user's profile |
| PUT | `/api/auth/profile` | Private | Update current user's profile |

### Products
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/products` | Public | List products (supports `search`, `category`, `minPrice`, `maxPrice`, `sort`, `page`, `limit`) |
| GET | `/api/products/:id` | Public | Get one product + related products |
| GET | `/api/products/category/:category` | Public | Get products in a category |
| POST | `/api/products` | Admin | Create a product |
| PUT | `/api/products/:id` | Admin | Update a product |
| DELETE | `/api/products/:id` | Admin | Delete a product |

### Orders
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/orders` | Private | Place a new order |
| GET | `/api/orders/my-orders` | Private | Get the logged-in user's orders |
| GET | `/api/orders/:id` | Private | Get one order (owner or admin) |

### Admin
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/admin/orders` | Admin | List all orders |
| PUT | `/api/admin/orders/:id/status` | Admin | Update an order's status |
| GET | `/api/admin/users` | Admin | List all users |
| GET | `/api/admin/users/:id` | Admin | Get one user |
| DELETE | `/api/admin/users/:id` | Admin | Delete a user |
| GET | `/api/admin/dashboard` | Admin | Get dashboard stats |

All private/admin routes require an `Authorization: Bearer <token>` header.

---

## Testing Checklist

- [ ] Register with a new email → success
- [ ] Register with an existing email → shows duplicate email error
- [ ] Login with correct / incorrect credentials
- [ ] Browse products, use search, category filter, price filter, sorting, pagination
- [ ] Open a product's detail page and view related products
- [ ] Add to cart, update quantity, remove item, clear cart
- [ ] Checkout with COD and with simulated online payment
- [ ] Confirm order appears on Order Success page and in "My Orders"
- [ ] Login as admin → confirm dashboard stats, add/edit/delete a product, update an order's status, view/delete a user
- [ ] Confirm a normal user gets a 403 if they try to call an `/api/admin/*` or product write endpoint directly
- [ ] Resize the browser / test on mobile to confirm responsive layout and hamburger menu

---

## GitHub Upload Instructions

```bash
git init
git add .
git commit -m "Initial commit: ShopEase full-stack e-commerce store"
git branch -M main
git remote add origin https://github.com/<your-username>/CodeAlpha_Simple-Ecommerce-Store.git
git push -u origin main
```
`.gitignore` already excludes `node_modules/` and `.env`, so credentials are never pushed.

---

## Deployment Notes

- Backend reads `PORT`, `MONGO_URI`, and `JWT_SECRET` from environment variables — ready for hosts like Render, Railway, or Cyclic.
- Frontend's `js/config.js` automatically switches its API base URL between `localhost` and the deployed origin, so no hardcoded URLs need to change if the frontend is served from the same domain as the backend.
- For MongoDB, use [MongoDB Atlas](https://www.mongodb.com/atlas) for a free cloud-hosted database in production.

---

## Screenshots

_Add screenshots of the Home page, Products page, Product Details, Cart, Checkout, and Admin Dashboard here before submitting._

---

## Future Improvements

- Wishlist / saved items
- Product reviews and ratings by users
- Real payment gateway integration (Razorpay/Stripe)
- Email notifications on order status changes
- Image upload for admin product management (instead of image URLs)

---

## Author

Chandra Nath Mandal — BCA Student, Calcutta Institute of Engineering and Management
Built for the CodeAlpha Full Stack Development Internship, Task 1.
