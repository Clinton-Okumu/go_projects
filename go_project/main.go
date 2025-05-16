package main

import (
	"fmt"
	"go_project/internal/app"
	"net/http"
	"time"
	"flag"
	"go_project/internal/routes"
)

func main() {
	var port int
	flag.IntVar(&port, "port", 8080, "Go backend server port")
	flag.Parse()

	app, err := app.NewApplication()
	if err != nil {
		panic(err)
	}
	
	r := routes.SetUpRoutes(app)

	server :=
		&http.Server{
			Addr:         fmt.Sprintf(":%d", port),
			Handler:      r,
			IdleTimeout:  time.Minute,
			ReadTimeout:  10 * time.Second,
			WriteTimeout: 30 * time.Second,
		}

	app.Logger.Printf("Starting server on port %d", port)
	err = server.ListenAndServe()
	if err != nil {
		app.Logger.Fatal(err)
	}
}

