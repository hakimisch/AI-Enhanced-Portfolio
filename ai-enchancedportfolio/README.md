# AI Enhanced Artist Portfolio — ArtSpace

A full-stack Next.js + MongoDB platform for digital artists to showcase artwork, sell merchandise, publish blog posts, and interact with fans through AI-powered chat and support systems.

This project combines a portfolio website, e-commerce store, blogging platform, and artist management dashboard into a single scalable web application.

## Live Website

The project is deployed and accessible here:

**https://ai-artspace.vercel.app/**

Visit the site to explore the full platform including the artist portfolio, artwork gallery, blog, store, AI chatbot, and dashboards.

## Screenshots

| | |
|---|---|
| **Homepage** | ![](public/homepage.png) |
| **Artwork Gallery** | ![](public/artwork.png) |
| **Artist Dashboard** | ![](public/dashboard.png) |
| **Merchandise** | ![](public/shop.png) |
| **Chatbot** | ![](public/chatbot.png) |
| **Chatbot Settings** | ![](public/settings.png) |

## Features

### Artist Portfolio
- Public artist profile pages
- Artwork gallery with detailed artwork pages
- Blog posts and artist updates
- Artist contact system
- Artist listing directory

### Artwork System
- Upload and manage artworks
- Artwork detail pages
- Public artwork browsing
- Artwork metadata storage in MongoDB
- Image handling via Cloudinary

### E-Commerce Store
A built-in online store allowing artists to sell merchandise.

**Store Features**
- Product catalog
- Shopping cart
- Checkout system
- Order history
- PayPal payment integration
- Customer order tracking

**Customer Capabilities**
- Add items to cart
- Checkout via PayPal
- View previous orders
- Track order status

### Artist Dashboard
Artists have access to a private dashboard where they can manage their content and business.

**Artist Tools**
- Manage artworks
- Publish blog posts
- Manage merchandise products
- View merchandise orders
- Respond to fan contact requests
- Update profile information
- Track activity summary

### Admin Dashboard
The admin panel provides complete platform oversight.

**Admin Capabilities**
- Manage users
- Manage artworks
- Manage products
- Manage orders
- Manage hero homepage content
- View analytics
- Monitor chatbot activity
- Manage support tickets

### AI Chatbot System
An integrated chatbot allows visitors to interact with the artist or platform.

**Chatbot Features**
- AI-assisted conversation via Google Gemini
- Chat session storage
- Chat analytics tracking
- Configurable chatbot settings (system prompt, FAQs, temperature)
- Admin analytics dashboard
- Intent-based routing (general / artist / admin)
- Action suggestions (link to shop, support, artists)

### Support Ticket System
Visitors and artists can submit support requests.

**Features**
- Ticket creation
- Admin ticket management
- Artist ticket management
- Ticket status updates (open / waiting / closed)
- Conversation threads
- Read/unread tracking

### Blog / CMS
Artists can publish blog posts to share updates, tutorials, or news.

**Blog Features**
- Create and edit posts
- Public blog listing
- Individual blog pages
- MongoDB post storage

### Authentication
User authentication is handled with NextAuth.

**Authentication Features**
- User registration
- Login system
- Session management
- Protected routes
- Role-based access (Admin / Artist / User)

## Technical Stack

### Frontend
- Next.js 15 (App Router)
- React 19
- Tailwind CSS 4
- Chart.js for analytics
- Lucide React icons
- React Toastify for notifications

### Backend
- Next.js API Routes
- MongoDB
- Mongoose ODM
- NextAuth.js for authentication

### External Services
- **PayPal API** — payment processing
- **Cloudinary** — image storage and CDN delivery
- **Google Gemini API** — AI chatbot

## Project Structure Overview

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
├── context          # Global state management (cart)
├── libs             # Database and service utilities
├── models           # MongoDB models
```

## Database Models

The application uses MongoDB collections for:

- Users
- Products
- Orders
- Artworks
- Blog posts
- Support tickets
- Artist messages
- Chat sessions
- Chat analytics
- Chatbot configuration
- Hero section settings

## API Capabilities

The API layer provides endpoints for:

### Authentication
- `/api/auth/[...nextauth]`
- `/api/register`
- `/api/login`

### Artists
- `/api/artists/public`
- `/api/artist/profile`
- `/api/artist/summary`

### Artworks
- `/api/artworks`
- `/api/artworks/public`
- `/api/artworks/upload`
- `/api/artworks/delete/[id]`

### Products
- `/api/products`
- `/api/products/[id]`
- `/api/products/upload`
- `/api/products/artist`

### Orders
- `/api/orders`
- `/api/orders/[id]`
- `/api/orders/admin`
- `/api/orders/admin/[id]`

### Chatbot
- `/api/chatbot`
- `/api/chatbot/config`
- `/api/chatbot/analytics`
- `/api/chatbot/test`

### Support System
- `/api/support`
- `/api/support/[id]`
- `/api/support/[id]/reply`
- `/api/support/[id]/status`
- `/api/support/[id]/close`
- `/api/support/[id]/read`
- `/api/artist-support`
- `/api/artist-support/[id]`
- `/api/artist-support/[id]/reply`
- `/api/artist-support/[id]/status`
- `/api/artist-support/[id]/read`

### Payments
- `/api/paypal/create-order`
- `/api/paypal/capture-order`

### Admin
- `/api/admin/summary`
- `/api/admin/hero`
- `/api/admin/hero/upload`

### General
- `/api/posts`
- `/api/posts/[id]`
- `/api/hero`
- `/api/profile`
- `/api/users`
- `/api/test-db`

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/ai-enhanced-portfolio.git
cd ai-enhanced-portfolio
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file:

```env
MONGODB_URI=
NEXTAUTH_SECRET=
NEXTAUTH_URL=

PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

GEMINI_API_KEY=
```

### 4. Run the development server

```bash
npm run dev
```

The application will run at:

**http://localhost:3000**
