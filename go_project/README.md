# 🏋️ Go Workouts API

A RESTful API for managing user workouts, built with Go, the Chi router, and a modular architecture. This API supports user registration, authentication via tokens, and full CRUD operations for workout entries.

---

## 📁 Project Structure


---

## 🚀 Features

- ✅ User registration
- ✅ Token-based authentication (JWT or similar)
- ✅ Authenticated workout routes
  - Create, read, update, delete workouts
- ✅ Health check endpoint
- ✅ Modular architecture (clean separation of concerns)

---

## 🔐 API Routes

| Method | Endpoint                     | Description                    | Auth Required |
|--------|------------------------------|--------------------------------|---------------|
| `GET`  | `/workout/{id}`              | Get workout by ID              | ✅            |
| `POST` | `/workout`                   | Create new workout             | ✅            |
| `PUT`  | `/workout/{id}`              | Update workout by ID           | ✅            |
| `DELETE` | `/workout/{id}`            | Delete workout by ID           | ✅            |
| `GET`  | `/health`                    | Health check                   | ❌            |
| `POST` | `/users`                     | Register new user              | ❌            |
| `POST` | `/tokens/authentication`     | Generate auth token (login)    | ❌            |

---

## 🛠️ Setup Instructions

### Prerequisites

- Go 1.20+
- Docker (for DB)
- PostgreSQL (or your configured DB)

### Run Locally

```bash
# Clone the repo
git clone https://github.com/Clinton-okumu/go_project.git
cd go_project

# Start DB service
docker-compose up -d

# Run migrations (assuming you're using something like golang-migrate or goose)
# migrate -path ./migrations -database "postgres://..." up

# Run the server
go run main.go
