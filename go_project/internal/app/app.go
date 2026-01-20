package app

import (
	"database/sql"
	"fmt"
	"go_project/internal/api"
	"go_project/internal/middleware"
	"go_project/internal/store"
	"log"
	"net/http"
	"os"
)

type Application struct {
	Logger         *log.Logger
	WorkoutHandler *api.WorkoutHandler
	UserHandler    *api.UserHandler
	TokenHandler   *api.TokenHandler
	Middleware     middleware.UserMiddleware
	DB             *sql.DB
}

func NewApplication() (*Application, error) {
	gormDB, err := store.Open()
	if err != nil {
		return nil, err
	}

	err = store.AutoMigrate(gormDB)
	if err != nil {
		panic(err)
	}

	sqlDB, err := gormDB.DB()
	if err != nil {
		panic(err)
	}

	logger := log.New(os.Stdout, "", log.Ldate|log.Ltime)

	// stores will go here
	workoutStore := store.NewPostgresWorkoutStore(gormDB)
	userStore := store.NewPostgresUserStore(gormDB)
	tokenStore := store.NewPostgresTokenStore(gormDB)

	// handlers
	workoutHandler := api.NewWorkoutHandler(workoutStore, logger)
	userHandler := api.NewUserHandler(userStore, logger)
	tokenHandler := api.NewTokenHandler(tokenStore, userStore, logger)
	midlewareHHandler := middleware.UserMiddleware{UserStore: userStore}

	app := &Application{
		Logger:         logger,
		WorkoutHandler: workoutHandler,
		UserHandler:    userHandler,
		TokenHandler:   tokenHandler,
		Middleware:     midlewareHHandler,
		DB:             sqlDB,
	}

	return app, nil
}

func (a *Application) HealthChecker(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Status is available\n")
}

func (a *Application) Welcome(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Welcome to the ForgeFit API\n")
}
