<div align="center">

#  MERN Stack Boilerplate

### Production-Ready • Secure • Scalable • Dockerized

A **production-ready, industry-grade MERN stack boilerplate** with authentication, role-based access control, validation, file uploads, and full Docker support.

</div>

---

# 🧱 Tech Stack

## Backend
- Node.js 20
- Express 5
- MongoDB 7 + Mongoose 8
- JWT (Access + Refresh Tokens)
- Zod Validation
- Bcrypt.js
- Multer + Cloudinary
- Helmet, CORS, HPP
- Express Rate Limit

## Frontend
- React 19
- Vite 6
- Tailwind CSS v4
- Shadcn UI
- Redux Toolkit
- RTK Query
- React Router 7
- Sonner (Toast Notifications)

## DevOps
- Docker
- Docker Compose
- Nginx
- Vercel Ready

---

# ✨ Features

## 🔐 Authentication
- Access + Refresh Token pattern
- HTTP-only secure cookies
- Auto token refresh (RTK Query)
- Secure logout

## 🛡️ Authorization
- Role-Based Access Control (User / Admin)
- Ownership-based route protection

## 📤 File Upload
- Multer middleware
- Cloudinary integration

## ✅ Validation
- Frontend validation
- API validation using Zod
- Database validation using Mongoose

## 🔒 Security
- Helmet security headers
- CORS configuration
- HPP protection
- NoSQL injection prevention
- Rate limiting (Auth & General routes)

## 📊 Other
- Pagination & filtering
- Centralized error handling
- Graceful shutdown
- Health check endpoint
- Service pattern architecture
- Fully Dockerized

---

# 📁 Project Structure

```bash
mern-boilerplate/
│
├── docker-compose.yml
├── .env
├── README.md
│
├── backend/
│   ├── docker/
│   │   └── mongo-init.js
│   │
│   ├── src/
│   │   ├── config/
│   │   │   ├── cloudinary.config.js
│   │   │   ├── cors.config.js
│   │   │   ├── db.config.js
│   │   │   ├── env.config.js
│   │   │   └── multer.config.js
│   │   │
│   │   ├── constants/
│   │   │   └── index.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   └── user.controller.js
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   ├── rateLimiter.middleware.js
│   │   │   └── validate.middleware.js
│   │   │
│   │   ├── models/
│   │   │   └── user.model.js
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   └── index.js
│   │   │
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   └── user.service.js
│   │   │
│   │   ├── utils/
│   │   │   ├── ApiError.js
│   │   │   ├── ApiResponse.js
│   │   │   ├── asyncHandler.js
│   │   │   └── logger.js
│   │   │
│   │   ├── validators/
│   │   │   ├── auth.validator.js
│   │   │   └── user.validator.js
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── .dockerignore
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── Dockerfile
│   ├── nodemon.json
│   └── package.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── app/
    │   │   └── store.js
    │   │
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── Header.jsx
    │   │   │   ├── Footer.jsx
    │   │   │   └── Layout.jsx
    │   │   │
    │   │   ├── shared/
    │   │   │   ├── ProtectedRoute.jsx
    │   │   │   ├── PublicRoute.jsx
    │   │   │   └── LoadingSpinner.jsx
    │   │   │
    │   │   └── ui/
    │   │       ├── button.jsx
    │   │       ├── card.jsx
    │   │       ├── input.jsx
    │   │       └── label.jsx
    │   │
    │   ├── features/
    │   │   └── auth/
    │   │       ├── authApi.js
    │   │       └── authSlice.js
    │   │
    │   ├── hooks/
    │   │   └── useAuth.js
    │   │
    │   ├── lib/
    │   │   └── utils.js
    │   │
    │   ├── pages/
    │   │   ├── auth/
    │   │   │   ├── LoginPage.jsx
    │   │   │   └── RegisterPage.jsx
    │   │   ├── HomePage.jsx
    │   │   ├── AboutPage.jsx
    │   │   ├── ContactPage.jsx
    │   │   └── NotFoundPage.jsx
    │   │
    │   ├── router/
    │   │   └── index.jsx
    │   │
    │   ├── utils/
    │   │   └── constants.js
    │   │
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    │
    ├── .dockerignore
    ├── .env
    ├── .env.example
    ├── .gitignore
    ├── components.json
    ├── Dockerfile
    ├── nginx.conf
    ├── vercel.json
    ├── vite.config.js
    └── package.json
```

---

# 🚀 Quick Start

## Prerequisites
- Node.js ≥ 18
- MongoDB (Atlas or Local)
- Cloudinary Account
- Docker (optional)

---

## Backend Setup

```bash
git clone https://github.com/your-username/mern-boilerplate.git
cd mern-boilerplate/backend

npm install
cp .env.example .env
npm run dev
```

---

## Frontend Setup

```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev
```

---

# 🐳 Docker Setup

```bash
docker-compose up --build
```

---

# 📄 License

MIT License
