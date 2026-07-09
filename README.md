# 🍲 RecipeHub - Recipe Sharing Platform

RecipeHub is a modern full-stack recipe sharing platform where food enthusiasts can create, discover, and manage delicious recipes. Users can interact with the community by liking, favoriting, and reporting recipes, while premium members enjoy additional publishing features and exclusive badges.

## 🌐 Live Demo

- 🚀 **Live Website:** https://recipe-hub-client-two.vercel.app
- 💻 **Client Repository:** https://github.com/OnikTechHub/RecipeHub-Client
- ⚙️ **Server Repository:** https://github.com/OnikTechHub/RecipeHub-Server

---

# ✨ Features

### 🔐 Authentication & Security

- JWT Authentication with HTTP-only Cookies
- Better Auth Authentication
- Google Sign-In
- Protected Routes
- Role-Based Access Control (Admin/User)

### 🍽️ Recipe Management

- Create Recipes
- Update Recipes
- Delete Recipes
- View Recipe Details
- Unlimited Publishing for Premium Users

### ❤️ Community Features

- Like Recipes
- Favorite Recipes
- Report Recipes
- Search Recipes
- Filter Recipes by Category

### 💎 Premium Membership

- Stripe Checkout Integration
- Premium Badge
- Unlimited Recipe Publishing

### 📊 Admin Dashboard

- Manage Users
- Manage Recipes
- Handle Reports
- User Role Management

### 🎨 User Experience

- Fully Responsive Design
- Dark & Light Theme
- Beautiful Animations with Framer Motion
- Loading Skeletons
- Toast Notifications

---

# 🛠️ Tech Stack

## Frontend

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- DaisyUI
- HeroUI
- TanStack Query
- Framer Motion
- Better Auth
- Stripe

## Backend

- Node.js
- Express.js
- JWT Authentication

## Database & Services

- MongoDB
- ImgBB API
- Stripe API
- Vercel Deployment

---

# ⚙️ Installation

## 1️⃣ Clone the repositories

```bash
git clone https://github.com/OnikTechHub/RecipeHub-Client.git
git clone https://github.com/OnikTechHub/RecipeHub-Server.git
```

---

## 2️⃣ Install Dependencies

### Client

```bash
cd RecipeHub-Client
npm install
```

### Server

```bash
cd RecipeHub-Server
npm install
```

---

## 3️⃣ Environment Variables

### Client (.env.local)

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# Better Auth
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_better_auth_secret

# MongoDB
MONGO_DB_URI=your_mongodb_connection_string
AUTH_DB_NAME=your_database_name

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Image Upload (ImgBB)
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_publishable_key
```

### Server (.env)

```env
# Server Configuration
PORT=5000
CLIENT_URL=http://localhost:3000

# MongoDB
MONGO_DB_URI=your_mongodb_connection_string
AUTH_DB_NAME=your_database_name

# Better Auth
BETTER_AUTH_URL=http://localhost:5000
BETTER_AUTH_SECRET=your_better_auth_secret

```

> ⚠️ **Security Note:** Never commit your actual `.env` or `.env.local` files to GitHub. Store all sensitive credentials securely and only commit `.env.example` files.

---

# ▶️ Running the Project

### Client

```bash
npm run dev
```

### Server

```bash
npm run start
```

or

```bash
npm run dev
```

---

# 🔍 Core Functionalities

- User Authentication
- Google Login
- Premium Membership
- Stripe Payment
- Recipe CRUD
- Favorites
- Likes
- Reporting System
- Search & Filter
- Admin Dashboard
- Protected Routes
- Role Management
- Responsive UI

---

# 📦 Dependencies

### Frontend

- next
- react
- tailwindcss
- daisyui
- @tanstack/react-query
- better-auth
- framer-motion
- axios
- stripe

### Backend

- express
- mongodb
- jsonwebtoken
- cookie-parser
- cors
- dotenv
- stripe
- multer

---

# 🚀 Deployment

### Client

Deploy using **Vercel**

### Server

Deploy using **Vercel**

---

## 🎯 Challenge Requirements Implemented

✅ Dark / Light Theme Toggle

✅ JWT Authentication with HTTP-Only Cookies

✅ Better Auth Integration

✅ Google Authentication

✅ Server-Side Pagination

✅ Stripe Payment Integration

✅ Framer Motion Animations

✅ Role-Based Access Control

✅ CRUD Operations

✅ Search & Filtering

✅ Responsive Design

---

## 🔮 Future Improvements

* Recipe Comments System
* Recipe Rating & Reviews
* Social Sharing Features
* User Following System
* AI-Powered Recipe Recommendations
* PWA Support

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push to your branch

```bash
git push origin feature-name
```

5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍🍳 Developed By

**Onik Das**

📧 [onikdas.dev@gmail.com](mailto:your-email@example.com)

🌐 Portfolio:https://onikdas-dev.vercel.app

⭐ If you like this project, don't forget to give it a star on GitHub!
