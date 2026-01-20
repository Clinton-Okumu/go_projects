package routes

import (
	"go_project/internal/app"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
)

func SetUpRoutes(app *app.Application) *chi.Mux {
	r := chi.NewRouter()

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))

	r.Get("/", app.Welcome)
	r.Get("/health", app.HealthChecker)

	r.Route("/api", func(r chi.Router) {
		r.Use(app.Middleware.Authenticate)

		r.Get("/me", app.Middleware.RequireUser(app.Me))

		r.Get("/workout/{id}", app.Middleware.RequireUser(app.WorkoutHandler.HandleGetWorkoutByID))
		r.Post("/workout", app.Middleware.RequireUser(app.WorkoutHandler.HandleCreateWorkout))
		r.Put("/workout/{id}", app.Middleware.RequireUser(app.WorkoutHandler.HandleUpdateByID))
		r.Delete("/workout/{id}", app.Middleware.RequireUser(app.WorkoutHandler.HandleDeleteWorkoutByID))
	})

	// Clerk owns authentication. Legacy user/password routes intentionally not mounted.
	return r
}
