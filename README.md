# Novera E-Commerce Platform 🛍️✨

Novera is a modern, luxury e-commerce web application designed for premium fashion items. Built with **Next.js 16 (App Router)** and **TypeScript**, it features a sleek dark-themed design, smooth animations, a secure user/guest shopping experience, and integration with Stripe and PayPal payment gateways.

---

## 📖 Table of Contents
- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Directory Structure](#-directory-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Project](#running-the-project)
- [Architecture & Custom Flows](#-architecture--custom-flows)
  - [Authentication & JWT Interceptors](#1-authentication--jwt-interceptors)
  - [Guest & User Shopping Cart](#2-guest--user-shopping-cart)
  - [Multi-Gateway Payment Integration](#3-multi-gateway-payment-integration)
- [Contributing](#-contributing)

---

## 🌟 Project Overview
Novera is designed to offer a seamless luxury shopping experience. Customers can browse premium collections (e.g., Italian wool suits, leather jackets, silk shirts), manage their cart, maintain a wishlist, and checkout securely using either Stripe or PayPal. An admin dashboard is integrated to allow managers to control products, orders, and site analytics.

---

## ⚡ Key Features

- 👤 **Secure Authentication**: 
  - Dual login options: Email/Password credentials and **Google OAuth**.
  - Automated JWT token renewal (Access & Refresh tokens).
  - Secure role-based route protection (`Admin` vs `Customer`).
  - Forgot & Reset Password system.
- 🛍️ **Dynamic Product Catalog**:
  - Filterable tabs showcasing "Featured" and "Trending" products.
  - Interactive search sidebar (`SearchSeaction`) with real-time query results.
  - Comprehensive single-product pages (`ProductPage`) featuring size/color selection and product reviews.
- 🛒 **Hybrid Cart Management**:
  - Automatically handles **guest carts** utilizing a unique device-ID (`DeviceIDProvider`) stored in LocalStorage.
  - Syncs or links directly to user accounts upon authentication.
- ❤️ **Wishlist**: Allows users to save favorite items for future consideration.
- 💳 **Advanced Checkout & Payments**:
  - Shipping information validation via **React Hook Form** & **Zod**.
  - Multi-payment support: **Stripe** checkout session redirects and **PayPal** order capture workflows.
- 📦 **Order Tracking & History**: User-friendly orders modal showcasing previous purchases, total amounts, and payment statuses (`paid`, `pending`, `cancelled`).
- 📊 **Admin Dashboard**: A secure portal for store admins to manage inventory, view statistics, and update order statuses.

---

## 🛠️ Tech Stack

### Frontend & Core
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) (React 19)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with PostCSS
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

### State Management & Data Fetching
- **Server State**: [TanStack React Query v5](https://tanstack.com/query/latest) (for caching, synchronizing, and fetching server data)
- **HTTP Client**: [Axios](https://axios-http.com/) (with custom request/response interceptors)

### Forms & Validation
- **Form Handling**: [React Hook Form](https://react-hook-form.com/)
- **Schema Validation**: [Zod](https://zod.dev/)

---

## 📁 Directory Structure

```text
novera/
├── api/                    # API request functions grouped by module (auth, cart, products, etc.)
├── app/                    # Next.js App Router (Pages, layout, global styles)
│   ├── cart/               # Cart page
│   ├── dashboard/          # Admin Dashboard
│   ├── forgot-password/    # Forgot password pages
│   ├── login/              # Login page
│   ├── payment-cancel/     # Payment cancelled page
│   ├── payment-success/    # Payment success page
│   ├── products/           # Product pages
│   ├── reset-password/     # Reset password page
│   ├── shop/               # Shop/Store catalogue
│   ├── signup/             # Signup page
│   ├── wishlist/           # Wishlist page
│   ├── globals.css         # Global tailwind styles
│   └── layout.tsx          # Root layout with Query & Auth providers
├── components/             # Reusable UI React components (Header, Hero, CartPage, etc.)
├── hooks/                  # Custom React Hooks wrapper around React Query mutations/queries
├── lib/                    # Configuration files (apiClient.ts, storage.ts)
├── public/                 # Static assets (images, icons, etc.)
├── type/                   # TypeScript interfaces and type definitions
├── utils/                  # Helper utilities, routing protections, validation schemas
├── postcss.config.mjs      # PostCSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Scripts & project dependencies
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18.x or above recommended) along with `npm` (or `yarn` / `pnpm`).

### Installation
1. Clone the repository and navigate to the project directory:
   ```bash
   cd novera
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```

### Environment Variables
Create a `.env.local` file in the root directory and add the following configuration:
```env
NEXT_PUBLIC_BASE_URL=https://web-production-1ab2d.up.railway.app/api/
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id-here
```

### Running the Project
* **Development Mode**: Runs the local development server at `http://localhost:3000`.
  ```bash
  npm run dev
  ```
* **Build for Production**: Compiles the application for production deployment.
  ```bash
  npm run build
  ```
* **Start Production Server**: Starts the built app locally.
  ```bash
  npm run start
  ```
* **Linting**: Runs ESLint checks across the codebase.
  ```bash
  npm run lint
  ```

---

## 🔄 Architecture & Custom Flows

### 1. Authentication & JWT Interceptors
The application uses JSON Web Tokens (JWT) for authentication. 
- Access tokens are attached to every authenticated API request header: `Authorization: Bearer <token>`.
- The `apiClient` ([apiClient.ts](file:///d:/Newfolder/front/Web/complete/novera/lib/apiClient.ts)) implements an Axios **Response Interceptor**. If an API request returns a `401 Unauthorized` status (due to token expiration), the interceptor automatically pauses the requests, calls the `/auth/token/refresh/` endpoint, updates the local storage tokens, and retries the original requests seamlessly.

### 2. Guest & User Shopping Cart
To allow customers to shop without logging in first:
- A unique guest ID is generated and stored locally via [DeviceIDProvider.tsx](file:///d:/Newfolder/front/Web/complete/novera/components/DeviceIDProvider.tsx).
- When a guest edits their cart, the HTTP request sends `x-Device-ID` in the headers.
- Once the user logs in, the cart is synced or associated directly with the authenticated user profile.

### 3. Multi-Gateway Payment Integration
The system integrates both:
- **Stripe**: Sends order details to the backend to create a Stripe checkout session and redirects the customer to a secure Stripe hosted payment page.
- **PayPal**: Creates a PayPal order using the SDK/API and processes the capture phase locally. The [PaymentProcessor.tsx](file:///d:/Newfolder/front/Web/complete/novera/components/PaymentProcessor.tsx) checks URL queries for PayPal tokens on redirect, captures the order, and updates database records.

---

## 🤝 Contributing
1. Fork the project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.
