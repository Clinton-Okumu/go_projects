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
- PostgreSQL (running locally or remotely)

### Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
```

Or set them as environment variables:

```bash
export DB_HOST=localhost
export DB_PORT=5432
export DB_USER=your_db_user
export DB_PASSWORD=your_db_password
export DB_NAME=your_db_name
```

### Run Locally

```bash
# Clone the repo
git clone https://github.com/Clinton-okumu/go_project.git
cd go_project

# Set environment variables (see above)

# Run the server (migrations run automatically via GORM)
go run main.go
