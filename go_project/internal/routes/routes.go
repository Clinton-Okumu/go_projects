package routes

import (
	"go_project/internal/app"

	"github.com/go-chi/chi/v5"
)

func SetUpRoutes(app *app.Application) *chi.Mux {
	r := chi.NewRouter()

	r.Get("/health", app.HealthChecker)
	r.Get("/workout/{id}", app.WorkoutHandler.HandleGetWorkoutByID)
	r.Post("/workout", app.WorkoutHandler.HandleCreateWorkout)
	r.Put("/workout/{id}", app.WorkoutHandler.HandleUpdateByID)
	r.Delete("/workout/{id}", app.WorkoutHandler.HandleDeleteByID)

	r.Post("/users", app.UserHandler.HandleRegisterUser)
	return r
}
