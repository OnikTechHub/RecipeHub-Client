# 🍲 RecipeHub - Client Application

<div align="center">

![RecipeHub Banner](https://img.shields.io/badge/RecipeHub-Full%20Stack%20Culinary%20Platform-orange?style=for-the-badge&logo=appveyor)

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Better Auth](https://img.shields.io/badge/Better_Auth-Security-blue?style=for-the-badge)](https://better-auth.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payment_Integration-6772E5?style=for-the-badge&logo=stripe)](https://stripe.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

**RecipeHub** is a state-of-the-art full-stack culinary platform built with Next.js App Router. It allows food enthusiasts to discover, create, share, and organize recipes, featuring an **AI Smart Recipe Generator**, **Automated Grocery List with PDF Export**, **Role-Based Access Control**, **Stripe Paywall for Premium Membership**, **OTP-Verified Authentication**, and comprehensive **Admin Analytics**.

[🌐 Live Application](https://recipe-hub-client-two.vercel.app) • [⚙️ Backend Repository](https://github.com/OnikTechHub/RecipeHub-Server) • [💻 Frontend Repository](https://github.com/OnikTechHub/RecipeHub-Client)

</div>

---

## 🌟 Key Features

### 🤖 1. AI Smart Recipe Generator
* **AI-Powered Creation**: Generates complete recipes based on custom user prompts, available ingredients, dietary preferences, or meal types using Google Gemini AI integration.
* **Structured Output**: Automatically formats prep time, cook time, serving count, difficulty, detailed step-by-step instructions, and nutrient breakdown.
* **One-Click Save & Publish**: Users can preview, edit, and directly save AI-generated recipes to their profile or publish them to the community.

### 📋 2. Smart Grocery List & PDF Export
* **Instant Grocery Conversion**: Convert any recipe ingredients into an interactive grocery checklist.
* **Interactive Item Tracking**: Tick off bought items while shopping with instant visual feedback.
* **Professional PDF Generation**: Export grocery lists to formatted, printable PDF documents using `html2pdf.js`/`jsPDF`.

### 🛡️ 3. Role-Based Access Control (RBAC) & Paywall
* **Multi-Tier User System**:
  * **Free User**: Access to recipe browsing, liking, favoriting, and up to 3 free recipe creations.
  * **Premium Member**: Unlimited recipe publishing, exclusive ⭐ Premium Badge, priority AI generation, and ad-free experience.
  * **Admin**: Full control over user accounts, recipe moderation, report resolution, and platform analytics.
* **Stripe Paywall Integration**: Seamless upgrade flow powered by Stripe Checkout with secure payment processing.

### 🔐 4. Enhanced Authentication & Security
* **Better-Auth Framework**: Robust authentication powered by Better Auth.
* **Email OTP Verification**: Registration requires 6-digit email OTP verification before account activation.
* **Terms of Service & Privacy Agreement**: Mandatory Terms of Service and Privacy Policy agreement checkbox on the register page before submitting.
* **Google Social OAuth 2.0**: One-click Google sign-in support.
* **ImageBB Profile Upload**: Instant high-res avatar uploads via ImageBB API.

### 📊 5. API Quota & Admin Analytics
* **Admin Control Center**: Monitor total registered users, active premium subscriptions, total recipes created, and pending community flags.
* **Usage Quotas**: Tracks daily AI generation and recipe post quotas with automated tier enforcement.

### 💬 6. Dynamic Reviews, Ratings & Testimonials
* **Community Interactions**: Like recipes, add to personal favorites, and submit reports for moderation.
* **Interactive Testimonials**: Real-time community feedback carousel showcasing culinary experience stories.

### 🎨 7. Modern Responsive UI/UX
* **Dark / Light Mode**: Seamless theme toggling powered by DaisyUI and Tailwind CSS.
* **Smooth Animations**: Interactive micro-animations powered by Framer Motion.
* **Loading States & Skeleton UI**: Skeleton loaders and spinners for smooth data fetching UX.

---

## 🛠️ Tech Stack

### Frontend Core
* **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
* **Library**: [React 19](https://reactjs.org/)
* **Styling**: [Tailwind CSS 3](https://tailwindcss.com/), [DaisyUI](https://daisyui.com/), [HeroUI](https://heroui.com/)
* **Icons**: React Icons (FontAwesome 6, Feather, Flat Color Icons)

### State & Data Management
* **Data Fetching**: [@tanstack/react-query](https://tanstack.com/query/latest)
* **HTTP Client**: Axios & Fetch API
* **Form & UI Feedback**: [React Hot Toast](https://react-hot-toast.com/), [React Spinners](https://www.npmjs.com/package/react-spinners)

### Authentication & Payments
* **Authentication**: Better Auth & JWT Client
* **Payments**: [@stripe/stripe-js](https://stripe.com/docs/js) & [@stripe/react-stripe-js](https://stripe.com/docs/stripe-js/react)

### Animations & Utilities
* **Animations**: [Framer Motion](https://www.framer.com/motion/)
* **PDF Export**: html2pdf.js / jsPDF

---

## 📁 Directory Structure

```text
recipe-hub-client/
├── public/                     # Static assets, logos, icons, metadata
├── src/
│   ├── app/                    # Next.js App Router pages & API routes
│   │   ├── about/              # About page route
│   │   ├── ai-recipe-generator/# AI Smart Recipe Generator page
│   │   ├── browse-recipes/     # Search & category browse page
│   │   ├── chefs/              # Top chefs showcase page
│   │   ├── contact/            # Contact & query page
│   │   ├── dashboard/          # User & Admin dashboards
│   │   │   ├── add-recipe/     # Create recipe route
│   │   │   ├── admin/          # Admin management (users, recipes, analytics)
│   │   │   ├── my-favorites/   # Saved favorite recipes
│   │   │   ├── my-recipes/     # User published recipes
│   │   │   └── profile/        # User profile settings
│   │   ├── login/              # User authentication login
│   │   ├── pricing/            # Premium subscription & Stripe checkout
│   │   ├── privacy/            # Privacy Policy policy document
│   │   ├── register/           # Registration with OTP & Terms check
│   │   ├── terms/              # Terms of Service legal document
│   │   ├── layout.js           # Root layout with providers & navbar/footer
│   │   ├── globals.css         # Global styles & Tailwind directives
│   │   └── page.js             # Landing page with hero, categories, features
│   ├── components/             # Reusable UI components
│   │   ├── AIRecipeGenerator.jsx # Interactive AI generation interface
│   │   ├── Navbar.jsx          # Dynamic header with theme toggle & user menu
│   │   ├── Footer.jsx          # Site footer with links & social handles
│   │   ├── OtpModal.jsx        # OTP verification modal dialog
│   │   ├── RecipeCard.jsx      # Recipe card display with likes & actions
│   │   ├── Testimonials.jsx    # Community feedback carousel
│   │   └── ThemeController.jsx # Light/Dark mode switcher
│   ├── lib/                    # Helper libraries & client instances
│   │   ├── auth-client.js      # Better-Auth client instance
│   │   └── pdfGenerator.js     # Smart grocery PDF export helper
├── .env.example                # Template for required environment variables
├── next.config.mjs             # Next.js configuration
├── tailwind.config.mjs         # Tailwind CSS configuration
└── package.json                # Frontend dependencies & scripts
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root of `recipe-hub-client`:

```env
# Backend Server API URL
NEXT_PUBLIC_SERVER_URL=http://localhost:5000
NEXT_PUBLIC_API_URL=http://localhost:5000

# Better Auth Configuration
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_better_auth_secret_key

# Image Upload (ImgBB API Key)
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key

# Stripe Payment Gateway (Publishable Key)
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_your_stripe_publishable_key
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
Ensure you have installed:
* [Node.js](https://nodejs.org/) (v18.x or higher)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### 2. Clone the Repository
```bash
git clone https://github.com/OnikTechHub/RecipeHub-Client.git
cd RecipeHub-Client
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy `.env.example` (or create `.env.local`) and insert your local API credentials:
```bash
cp .env.example .env.local
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 6. Build & Production Preview
```bash
# Build the production bundle
npm run build

# Start production server
npm start
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Developed By

**Onik Das**
* 📧 Email: [onikdas.dev@gmail.com](mailto:onikdas.dev@gmail.com)
* 🌐 Portfolio: [https://onikdas-dev.vercel.app](https://onikdas-dev.vercel.app)
* 🐙 GitHub: [@OnikTechHub](https://github.com/OnikTechHub)

---
<div align="center">
  <sub>⭐ If you find RecipeHub useful, please consider giving it a star on GitHub!</sub>
</div>
