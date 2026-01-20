package main

import (
	"flag"
	"fmt"
	"go_project/internal/app"
	"go_project/internal/routes"
	"net/http"
	"os"
	"time"
)

func main() {
	// 1. Read PORT from env first (deployment standard)
	port := os.Getenv("PORT")
	if port == "" {
		// fallback to flag
		flagPort := flag.Int("port", 8081, "Go backend server port")
		flag.Parse()
		port = fmt.Sprintf("%d", *flagPort)
	}

	application, err := app.NewApplication()
	if err != nil {
		panic(err)
	}
	defer application.DB.Close()

	router := routes.SetUpRoutes(application)

	server := &http.Server{
		Addr:         "0.0.0.0:" + port,
		Handler:      router,
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	// 2. Log the actual backend URL
	application.Logger.Printf(
		"Backend running at http://localhost:%s",
		port,
	)

	err = server.ListenAndServe()
	if err != nil && err != http.ErrServerClosed {
		application.Logger.Fatal(err)
	}
}
