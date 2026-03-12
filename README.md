# AI Enhanced Artist Portfolio

A full-stack **Next.js + MongoDB platform** for digital artists to showcase artwork, sell merchandise, publish blog posts, and interact with fans through AI-powered chat and support systems.

This project combines a **portfolio website, e-commerce store, blogging platform, and artist management dashboard** into a single scalable web application.

Live Website

The project is deployed and accessible here:

https://ai-artspace.vercel.app/

Visit the site to explore the full platform including the artist portfolio, artwork gallery, blog, store, AI chatbot, and dashboards.

---

# Screenshots

## Homepage
![Homepage](ai-enhancedportfolio/screenshots/Homepage.png)

## Artwork Gallery
![Artwork](ai-enhancedportfolio/screenshots/Artwork.png)

## Artist Dashboard
![Dashboard](ai-enhancedportfolio/screenshots/Dashboard.png)

## Store
![Shop](ai-enhancedportfolio/screenshots/Shop.png)

## Chatbot
![Chatbot](ai-enhancedportfolio/screenshots/Chatbot.png)

## Settings
![Settings](ai-enhancedportfolio/screenshots/Setting.png)


# Features

## Artist Portfolio

* Public artist profile pages
* Artwork gallery with detailed artwork pages
* Blog posts and artist updates
* Artist contact system
* Artist listing directory

### Artwork System

* Upload and manage artworks
* Artwork detail pages
* Public artwork browsing
* Artwork metadata storage in MongoDB
* Image handling via Cloudinary

---

# E-Commerce Store

A built-in online store allowing artists to sell merchandise.

### Store Features

* Product catalog
* Shopping cart
* Checkout system
* Order history
* PayPal payment integration
* Customer order tracking

### Customer Capabilities

* Add items to cart
* Checkout via PayPal
* View previous orders
* Track order status

---

# Artist Dashboard

Artists have access to a private dashboard where they can manage their content and business.

### Artist Tools

* Manage artworks
* Publish blog posts
* Manage merchandise products
* View merchandise orders
* Respond to fan contact requests
* Update profile information
* Track activity summary

---

# Admin Dashboard

The admin panel provides complete platform oversight.

### Admin Capabilities

* Manage users
* Manage artworks
* Manage products
* Manage orders
* Manage hero homepage content
* View analytics
* Monitor chatbot activity
* Manage support tickets

---

# AI Chatbot System

An integrated chatbot allows visitors to interact with the artist or platform.

### Chatbot Features

* AI-assisted conversation
* Chat session storage
* Chat analytics tracking
* Configurable chatbot settings
* Admin analytics dashboard

---

# Support Ticket System

Visitors and artists can submit support requests.

### Features

* Ticket creation
* Admin ticket management
* Ticket status updates
* Conversation threads
* Read/unread tracking

---

# Blog / CMS

Artists can publish blog posts to share updates, tutorials, or news.

### Blog Features

* Create and edit posts
* Public blog listing
* Individual blog pages
* MongoDB post storage

---

# Authentication

User authentication is handled with **NextAuth**.

### Authentication Features

* User registration
* Login system
* Session management
* Protected routes
* Role-based access (Admin / Artist / User)

---

# Technical Stack

### Frontend

* Next.js (App Router)
* React
* CSS Modules / Global CSS
* Context API for state management

### Backend

* Next.js API Routes
* MongoDB
* Mongoose ODM

### External Services

* PayPal API (payments)
* Cloudinary (image storage)

### Authentication

* NextAuth

---

# Project Structure Overview

```
src/app
│
├── admin            # Admin dashboard
├── artist           # Artist dashboard
├── artists          # Public artist profiles
├── artworks         # Artwork gallery
├── blog             # Blog system
├── e-commerce       # Storefront and checkout
├── auth             # Login & registration
├── contact          # Contact & support system
│
├── api              # Backend API routes
│
├── context          # Global state management
├── libs             # Database and service utilities
├── models           # MongoDB models
```

---

# Database Models

The application uses MongoDB collections for:

* Users
* Products
* Orders
* Artworks
* Blog posts
* Support tickets
* Artist messages
* Chat sessions
* Chat analytics
* Chatbot configuration
* Hero section settings

---

# API Capabilities

The API layer provides endpoints for:

### Authentication

```
/api/auth
/api/register
```

### Artists

```
/api/artists
/api/artist/profile
/api/artist/summary
```

### Artworks

```
/api/artworks
/api/artworks/upload
/api/artworks/delete
```

### Products

```
/api/products
/api/products/upload
```

### Orders

```
/api/orders
/api/orders/admin
```

### Chatbot

```
/api/chatbot
/api/chatbot/config
/api/chatbot/analytics
```

### Support System

```
/api/support
/api/artist-support
```

### Payments

```
/api/paypal/create-order
/api/paypal/capture-order
```

---

# Installation

### 1. Clone the repository

```
git clone https://github.com/yourusername/ai-enhanced-portfolio.git
cd ai-enhanced-portfolio
```

### 2. Install dependencies

```
npm install
```

### 3. Configure environment variables

Create a `.env.local` file:

```
MONGODB_URI=
NEXTAUTH_SECRET=
NEXTAUTH_URL=

PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### 4. Run the development server

```
npm run dev
```

The application will run at:

```
http://localhost:3000
```

---


