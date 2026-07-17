# 🏠 Estate Platform — Angular + Ruby on Rails

A full-stack real estate / property management application. It pairs a modern
**Angular** single-page frontend with a **Ruby on Rails** JSON API backend,
featuring authentication, a marketing site, and an authenticated dashboard for
managing properties, customers, invoices, and revenue.

---

## 🧱 Tech Stack

| Layer        | Technology                                             |
| ------------ | ------------------------------------------------------ |
| 🎨 Frontend  | Angular 21, TypeScript 5.9, RxJS, Tailwind CSS 4, SCSS |
| ⚙️ Backend   | Ruby on Rails 8.1, Ruby 3.4.7, Puma                    |
| 🗄️ Database  | SQLite 3 (via Active Record)                           |
| 🔐 Auth      | bcrypt password hashing + token-based sessions         |
| 📄 Pagination| Kaminari                                               |
| 🌐 CORS      | rack-cors                                              |

---

## 📁 Project Structure

```
Angular and Ruby project/
├── 🎨 frontend/   → Angular SPA (marketing site + dashboard)
├── ⚙️ backend/    → Rails API (JSON endpoints under /api)
└── 📄 TODO.md     → Design system tasks
```

---

## 🎨 Frontend

An Angular 21 application styled with Tailwind CSS 4 and SCSS. It serves both a
public marketing experience and a protected dashboard.

### ✨ Highlights
- 🧭 **Routing** — public pages plus `/dashboard/*` routes protected by `AuthGuard`.
- 🔌 **API layer** — `ApiService` centralizes all HTTP calls to `/api`, with
  friendly error mapping and lightweight `localStorage` caching for customers/activity.
- 🔑 **Auth** — `AuthService` + `auth.interceptor.ts` attach tokens to requests.
- 🎭 **Design system** — global tokens, grain overlay, and dot-grid backgrounds
  for an "industrial luxury / web3 minimal" look.

### 🗺️ Key Pages
- 🏠 Home, 📦 Product, 📚 Library, 💰 Pricing, 📖 Docs, 🔭 Perspectives,
  🧠 Expertise, 🖼️ Works, ✉️ Contact
- 🔐 Login, 📝 Signup, 🔁 Forgot Password
- 📊 Dashboard: Revenue, Customers, Invoices, Properties (+ detail), Settings, Help

### 🚀 Getting Started
```bash
cd frontend
npm install
npm start          # builds Tailwind, then runs `ng serve` on http://localhost:4200
```

### 🛠️ Useful Scripts
```bash
npm run build            # 🏗️ production build (Tailwind + ng build)
npm run watch            # 👀 dev build with file watching
npm run build:tailwind   # 🎨 compile Tailwind CSS only
npm test                 # ✅ run unit tests
```

> 🔁 API requests are proxied to the backend via `frontend/proxy.conf.json`.

---

## ⚙️ Backend

A Rails 8.1 API-only style backend exposing JSON endpoints under the `/api`
namespace. It handles authentication, content pages, and dashboard resources.

### ✨ Highlights
- 🔐 **Authentication** — signup, login, forgot-password, and logout with bcrypt.
- 📧 **Data hygiene** — emails stored lowercase; passwords require minimum strength.
- 🎟️ **Tokens** — API responses include auth tokens for the SPA.
- 🌐 **CORS** — configured for `localhost:4200/4201` dev origins.
- 📑 **Serializers** — `UserSerializer` and `PropertySerializer` shape JSON output.

### 🗄️ Data Models
- 👤 **User** — `first_name`, `last_name`, `email` (unique), `phone`,
  `password_digest`, `notifications_enabled`.
- 🏘️ **Property** — `title`, `address`, `price`, `bedrooms`, `bathrooms`,
  `square_feet`, `status` (for_sale / for_rent), `featured`, agent contact fields.

### 🔗 API Endpoints (under `/api`)
| Method     | Path                       | Purpose                     |
| ---------- | -------------------------- | --------------------------- |
| POST       | `/signup`                  | 📝 Create account           |
| POST       | `/login`                   | 🔑 Authenticate             |
| POST       | `/forgot_password`         | 🔁 Password reset request   |
| POST       | `/logout`                  | 🚪 End session              |
| GET        | `/home`, `/product`, ...   | 📄 Content pages            |
| GET        | `/dashboard`               | 📊 Dashboard summary        |
| GET        | `/revenue`                 | 💰 Revenue data             |
| GET        | `/customers`               | 👥 Customer list            |
| GET        | `/invoices`                | 🧾 Invoice list             |
| GET/PATCH  | `/settings`                | ⚙️ View / update settings   |
| GET        | `/help`                    | ❓ Help content             |
| CRUD       | `/properties`              | 🏘️ Manage properties        |
| GET        | `/properties/featured`     | ⭐ Featured properties      |
| GET        | `/properties/for_sale`     | 🏷️ Properties for sale      |
| GET        | `/properties/for_rent`     | 🔑 Properties for rent      |
| CRUD       | `/users`                   | 👤 Manage users             |

### 🚀 Getting Started
```bash
cd backend
bundle install
rails db:migrate       # 🗄️ create tables
rails db:seed          # 🌱 populate sample data
rails s                # ▶️ start server on http://localhost:3000
```

Test the login endpoint at 👉 `http://localhost:3000/api/login`.

---

## 🧪 Running the Full Stack

1. ⚙️ Start the backend: `cd backend && rails s` (port **3000**)
2. 🎨 Start the frontend: `cd frontend && npm start` (port **4200**)
3. 🌍 Open `http://localhost:4200` — API calls proxy to the Rails server.

---

## ✅ Requirements Recap
- 👤 Users can sign up and log in with email/password
- 🔒 Passwords hashed with bcrypt and require minimum strength
- 📧 Emails stored lowercase
- 🎟️ API responses include auth tokens
