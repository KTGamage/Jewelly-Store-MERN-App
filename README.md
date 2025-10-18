# LuxuryJewellery - Luxury Jewellery E-Commerce Platform

![MERN Stack](https://img.shields.io/badge/MERN-Stack-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-success)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-informational)

A sophisticated full-stack e-commerce platform specializing in luxury jewellery, built with modern web technologies to deliver an exceptional online shopping experience.

## 🚀 Live Demo

- **Main Store**: [https://luxuryjewellery.com](https://luxuryjewellery.com)
- **Admin Dashboard**: [https://admin.luxuryjewellery.com](https://admin.luxuryjewellery.com)
- **API Documentation**: [https://api.luxuryjewellery.com/docs](https://api.luxuryjewellery.com/docs)

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 🛍️ Customer Features
- **User Authentication**: Secure registration and login with email/password or Google OAuth
- **Advanced Product Discovery**: Smart filtering by price ranges, categories, and multiple sorting options
- **AI Shopping Assistant**: Integrated chatbot for personalized product recommendations and customer support
- **Responsive Design**: Mobile-first approach ensuring seamless experience across all devices
- **Shopping Cart**: Intuitive cart management with persistent storage
- **Wishlist**: Save favorite items for later purchase
- **Order Tracking**: Real-time order status updates

### 🎛️ Admin Features
- **Dashboard Analytics**: Comprehensive sales metrics and business insights
- **Product Management**: Complete CRUD operations for inventory management
- **Order Management**: Streamlined order processing and status updates
- **User Management**: Customer database and profile administration
- **Inventory Control**: Stock level monitoring and alerts
- **Sales Reporting**: Detailed revenue and performance analytics

## 🛠 Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks and functional components
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API communication
- **Context API** - State management for authentication and cart

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB Atlas** - Cloud database service
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Passport.js** - Authentication middleware
- **bcryptjs** - Password hashing
- **Cloudinary** - Image and media management

### Additional Services
- **Google OAuth 2.0** - Social authentication
- **OpenAI API** - AI-powered chatbot
- **MongoDB Atlas** - Cloud database cluster

## 📁 Project Structure

```
luxuryjewellery-app/
├── backend/
│   ├── config/          # Database and third-party configurations
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware (auth, validation)
│   ├── models/          # MongoDB schemas and models
│   ├── routes/          # API route definitions
│   └── server.js        # Express server entry point
├── frontend/
│   ├── public/          # Static assets
│   └── src/
│       ├── components/  # Reusable React components
│       ├── pages/       # Page-level components
│       ├── context/     # React context for state management
│       ├── hooks/       # Custom React hooks
│       ├── utils/       # Utility functions and API configuration
│       └── styles/      # Tailwind CSS and custom styles
├── admin-dashboard/
│   └── src/             # Admin React application
├── scripts/
│   ├── load-env.js      # Environment configuration loader
│   └── ensure-indexes.js # Database index management
└── package.json         # Root package configuration
```

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Google OAuth credentials
- OpenAI API key

### Step-by-Step Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/luxuryjewellery-app.git
   cd luxuryjewellery-app
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Update with your actual credentials
   - Run environment setup:
     ```bash
     npm run setup:env
     ```

4. **Database Setup**
   ```bash
   npm run ensure-indexes
   ```

5. **Start Development Servers**
   ```bash
   # Start all services concurrently
   npm run dev

   # Or start individually
   npm run dev:backend    # Backend API (port 5000)
   npm run dev:frontend   # Customer frontend (port 3000)
   npm run dev:admin      # Admin dashboard (port 3001)
   ```

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Backend Configuration
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
OPENAI_API_KEY=your_openai_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Frontend Configuration
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id

# Admin Dashboard Configuration
ADMIN_APP_API_URL=http://localhost:5000
ADMIN_APP_GOOGLE_CLIENT_ID=your_google_client_id

# Application URLs
CLIENT_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth initiation
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/admin/products` - Create product (Admin)
- `PUT /api/admin/products/:id` - Update product (Admin)
- `DELETE /api/admin/products/:id` - Delete product (Admin)

### Orders
- `GET /api/orders/my-orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details

### AI Chatbot
- `POST /api/chatbot` - AI-powered shopping assistance

## 🚀 Deployment

### Production Build
```bash
# Build frontend and admin applications
npm run build:frontend
npm run build:admin

# Start production server
npm start
```

### Deployment Platforms
- **Frontend**: Vercel, Netlify, or AWS S3
- **Backend**: Heroku, AWS EC2, or DigitalOcean
- **Database**: MongoDB Atlas
- **File Storage**: Cloudinary

## 🤝 Contributing

We welcome contributions to enhance LuxuryJewellery! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow React best practices and hooks conventions
- Use Tailwind CSS for styling
- Ensure responsive design across all devices
- Write clean, documented code
- Test thoroughly before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Your Name** - Full Stack Developer - [GitHub](https://github.com/yourusername)

## 📞 Support

For support and queries:
- Email: support@luxuryjewellery.com
- GitHub Issues: [Create an issue](https://github.com/yourusername/luxuryjewellery-app/issues)

## 🙏 Acknowledgments

- React community for excellent documentation
- Tailwind CSS for the utility-first framework
- MongoDB for robust database solutions
- OpenAI for AI integration capabilities

---

<div align="center">

**Built with ❤️ using the MERN Stack**

*Elevating online jewellery shopping experiences*

</div>
