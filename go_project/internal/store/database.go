package store

import (
	"fmt"
	"os"
	"time"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Open() (*gorm.DB, error) {
	// Load .env file
	err := godotenv.Load()
	if err != nil {
		return nil, fmt.Errorf("error loading .env file: %w", err)
	}

	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable", host, user, password, dbname, port)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("error connecting to postgres: %w", err)
	}

	fmt.Println("connected to database")
	return db, nil
}

type Token struct {
	ID     int       `gorm:"primaryKey"`
	Hash   []byte    `gorm:"uniqueIndex;not null"`
	UserID int       `gorm:"not null"`
	Expiry time.Time `gorm:"not null"`
	Scope  string    `gorm:"not null"`
	User   User      `gorm:"foreignKey:UserID"`
}

func AutoMigrate(db *gorm.DB) error {
	return db.AutoMigrate(&User{}, &Workout{}, &WorkoutEntry{}, &Token{})
}
