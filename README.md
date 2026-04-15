# Simple E-Commerce (Supplier + Shopper MVP)

Interview-case MVP using `Laravel API` + `React SPA`.

## Tech Stack

- Backend: Laravel 13, Sanctum, SQLite (default)
- Frontend: React + Vite
- DB: Relational (SQLite for fastest local setup)

## Project Structure

- `backend` - API, auth, products, cart, orders
- `frontend` - SPA for supplier/customer flows
- `tech-task.md` - original assignment brief

## Run Locally

### 1) Backend

```bash
cd backend
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve
```

Backend runs on `http://127.0.0.1:8000`.

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://127.0.0.1:5173`.

Vite proxy is configured, so frontend calls `/api/*` and forwards to backend.

## Demo Accounts

- Supplier A: `supplier1@example.com` / `password`
- Supplier B: `supplier2@example.com` / `password`
- Customer A: `customer1@example.com` / `password`
- Customer B: `customer2@example.com` / `password`

## Validation Steps (Requirement Coverage)

### Supplier environment

1. Register/login as supplier.
2. Create, edit, and delete own products from supplier UI.
3. Verify authorization boundary:
   - Login as Supplier B and try to update/delete Supplier A product.
   - Expected: request denied (`403`).
4. Open "My Buyers":
   - After purchases, verify customer/product records appear only for this supplier.

### Shopping environment

1. Register/login as customer.
2. Confirm catalog includes products from multiple suppliers.
3. Add items to cart, increment/decrement quantity, remove item.
4. Checkout.
   - Expected: order created, cart cleared.
5. Open order history.
   - Expected: only current customer orders are shown.
6. Verify data isolation:
   - Login as Customer B and confirm Customer A orders are not visible.

## Key API Endpoints

- Auth:
  - `POST /api/register`
  - `POST /api/login`
  - `POST /api/logout` (auth)
  - `GET /api/me` (auth)
- Public catalog:
  - `GET /api/products`
- Supplier:
  - `GET /api/supplier/products`
  - `POST /api/supplier/products`
  - `PUT /api/supplier/products/{product}`
  - `DELETE /api/supplier/products/{product}`
  - `GET /api/supplier/customers`
- Customer:
  - `GET /api/cart`
  - `POST /api/cart/items`
  - `PUT /api/cart/items/{item}`
  - `DELETE /api/cart/items/{item}`
  - `POST /api/checkout`
  - `GET /api/orders`

## Architecture Decisions (What and Why)

1. Separate API and SPA
   - Clear separation of concerns and easier backend security testing.
2. Single users table with `role`
   - Faster MVP implementation while still enforcing strict role boundaries.
3. Sanctum token auth
   - Minimal setup for API-first flow and easy manual/API testing.
4. Transactional checkout
   - Prevents partial order creation and keeps data consistent.
5. Order item snapshots (`product_name`, `price`)
   - Preserves historical correctness after product updates.
6. DB-backed cart
   - Server-authoritative checkout and consistent behavior.

## Live-Coding Explanation Cheat Sheet

- "I optimized for requirement coverage first, then security boundaries."
- "Role checks are enforced at API level, not only in UI."
- "I used one users table to avoid overengineering under 6-8 hour constraints."
- "Checkout is transactional to avoid partial writes."
- "I intentionally used SQLite for frictionless reviewer setup."

## What I Would Improve With More Time

- Feature tests for each acceptance flow
- Better form validation and error UX
- Pagination/search/sorting for catalog
- Inventory reservation strategy and payment integration
- Docker and hosted deployment pipeline

## Deploy on VPS with Docker

This repository now includes production Docker setup:

- `backend/Dockerfile` - Laravel app container (SQLite by default)
- `backend/docker/entrypoint.sh` - boot script (`key:generate`, `migrate --force`, cache)
- `frontend/Dockerfile` - Vite build + nginx runtime
- `frontend/docker/nginx.conf` - SPA routing + `/api/*` proxy to backend container
- `docker-compose.yml` - launches both services

### 1) Clone on VPS

```bash
mkdir -p /opt/simple-e-commerce
cd /opt/simple-e-commerce
git clone <YOUR_REPO_URL> .
```

### 2) Optional: configure backend `.env`

The backend container auto-creates `.env` from `.env.example` if missing.
If you need custom values, create `backend/.env` before first start:

```bash
cp backend/.env.example backend/.env
```

Recommended production values:

- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_URL=https://shop.your-domain.com`

For SQLite (default in this setup), keep:

- `DB_CONNECTION=sqlite`
- `DB_DATABASE=/var/www/html/database/database.sqlite`

### 3) Start containers

```bash
docker compose up -d --build
```

App endpoints after start:

- Frontend container: `http://<server-ip>:8080` (or your custom `FRONTEND_PORT`)
- Backend container: internal only, reached via frontend nginx `/api`

### 4) Put behind your existing reverse proxy

If you already run Nginx Proxy Manager / Traefik / nginx in Docker:

- Route `shop.your-domain.com` to this app's frontend container (`:8080`)
- Enable HTTPS certificate for the domain

You do **not** need a separate public API domain in this setup, because frontend nginx already proxies:

- `https://shop.your-domain.com/api/*` -> `backend:8000/api/*`

This avoids CORS complexity and works with the current frontend API calls.

### 5) Updating after new commits

```bash
git pull
docker compose up -d --build
```

### 6) Helpful commands

```bash
docker compose logs -f
docker compose ps
docker compose exec backend php artisan migrate --force
```

### Optional: separate API domain

If you prefer `api.shop.your-domain.com`, set `VITE_API_BASE_URL` at frontend build time and route that domain to backend directly.
The frontend now supports this via `VITE_API_BASE_URL` in `frontend/src/api/httpClient.js`.
