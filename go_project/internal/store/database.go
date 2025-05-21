package store

import (
	"database/sql"
	"fmt"

	_ "github.com/jackc/pgx/v4/stdlib"
)

func Open() (*sql.DB, error) {
	db, err := sql.Open("pgx", "host=localhost user=postgres password=postgres dbname=postgres port=5433 sslmode=disable")
	if err != nil {
		return nil, fmt.Errorf("error connecting to postgres: %w", err)
	}

	fmt.Println("connected to database")
	return db, nil
}
