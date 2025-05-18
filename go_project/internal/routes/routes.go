package routes

import (
	"github.com/go-chi/chi/v5"
	"go_project/internal/app"
)

func SetUpRoutes(app *app.Application) *chi.Mux {
	r := chi.NewRouter()

	r.Get("/health", app.HealthChecker)
	r.Get("/workout/{id}", app.WorkoutHandler.HandleGetWorkoutByID)
	r.Post("/workout", app.WorkoutHandler.HandleCreateWorkout)
	return r
}
