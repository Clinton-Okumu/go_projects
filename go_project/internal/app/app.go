package app

import (
	"fmt"
	"go_project/internal/api"
	"log"
	"net/http"
	"os"
)

type Application struct {
	Logger *log.Logger
	WorkoutHandler *api.WorkoutHandler
}

func NewApplication() (*Application, error) {
	logger := log.New(os.Stdout, "", log.Ldate|log.Ltime)

	//handler
	workoutHandler := api.NewWorkoutHandler()

	app := &Application{
		Logger: logger,
		WorkoutHandler: workoutHandler,
	}

	return app, nil
}

func (a *Application) HealthChecker(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Status is available\n")
}
