package routes

import (
	"go_project/internal/app"

	"github.com/go-chi/chi/v5"
)

func SetUpRoutes(app *app.Application) *chi.Mux {
	r := chi.NewRouter()

	r.Group(func(r chi.Router) {
		r.Use(app.Middleware.Authenticate)

		r.Get("/workout/{id}", app.Middleware.RequireUser(app.WorkoutHandler.HandleGetWorkoutByID))
		r.Post("/workout", app.Middleware.RequireUser(app.WorkoutHandler.HandleCreateWorkout))
		r.Put("/workout/{id}", app.Middleware.RequireUser(app.WorkoutHandler.HandleUpdateByID))
		r.Delete("/workout/{id}", app.Middleware.RequireUser(app.WorkoutHandler.HandleDeleteWorkoutByID))
	})
	r.Get("/", app.Welcome)
	r.Get("/health", app.HealthChecker)
	r.Post("/users", app.UserHandler.HandleRegisterUser)
	r.Post("/tokens/authentication", app.TokenHandler.HandleCreateToken)
	return r
}
