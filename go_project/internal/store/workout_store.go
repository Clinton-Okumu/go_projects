package store

import (
	"gorm.io/gorm"
)

type Workout struct {
	ID                int            `gorm:"primaryKey" json:"id"`
	UserID            int            `gorm:"not null" json:"user_id"`
	Title             string         `gorm:"not null" json:"title"`
	Description       string         `json:"description"`
	DurationInMinutes int            `gorm:"not null" json:"duration_in_minutes"`
	CaloriesBurned    int            `gorm:"not null" json:"calories_burned"`
	Entries           []WorkoutEntry `gorm:"foreignKey:WorkoutID" json:"entries"`
	User              User           `gorm:"foreignKey:UserID" json:"-"`
}

type WorkoutEntry struct {
	ID                int      `gorm:"primaryKey" json:"id"`
	WorkoutID         int      `gorm:"not null" json:"workout_id"`
	ExerciseName      string   `gorm:"not null" json:"exercise_name"`
	Sets              int      `gorm:"not null" json:"sets"`
	Reps              *int     `json:"reps"`
	DurationInSeconds *int     `json:"duration_in_seconds"`
	Weight            *float64 `json:"weight"`
	Notes             string   `json:"notes"`
	OrderIndex        int      `gorm:"not null" json:"order_index"`
	Workout           Workout  `gorm:"foreignKey:WorkoutID" json:"-"`
}

type PostgresWorkoutStore struct {
	db *gorm.DB
}

func NewPostgresWorkoutStore(db *gorm.DB) *PostgresWorkoutStore {
	return &PostgresWorkoutStore{db: db}
}

type WorkoutStore interface {
	CreateWorkout(*Workout) (*Workout, error)
	GetWorkoutByID(id int64) (*Workout, error)
	UpdateWorkout(*Workout) error
	DeleteWorkout(id int64) error
	GetWorkoutOwner(id int64) (int, error)
}

func (pg *PostgresWorkoutStore) CreateWorkout(workout *Workout) (*Workout, error) {
	return workout, pg.db.Create(workout).Error
}

func (pg *PostgresWorkoutStore) GetWorkoutByID(id int64) (*Workout, error) {
	var workout Workout
	err := pg.db.Preload("Entries").First(&workout, int(id)).Error
	if err == gorm.ErrRecordNotFound {
		return nil, nil
	}
	return &workout, err
}

func (pg *PostgresWorkoutStore) UpdateWorkout(workout *Workout) error {
	return pg.db.Transaction(func(tx *gorm.DB) error {
		// Check if workout exists
		var existing Workout
		if err := tx.First(&existing, workout.ID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return gorm.ErrRecordNotFound
			}
			return err
		}

		// Update the workout
		if err := tx.Model(workout).Updates(map[string]interface{}{
			"title":               workout.Title,
			"description":         workout.Description,
			"duration_in_minutes": workout.DurationInMinutes,
			"calories_burned":     workout.CaloriesBurned,
		}).Error; err != nil {
			return err
		}

		// Delete existing entries
		if err := tx.Where("workout_id = ?", workout.ID).Delete(&WorkoutEntry{}).Error; err != nil {
			return err
		}

		// Insert new entries
		for i := range workout.Entries {
			workout.Entries[i].WorkoutID = workout.ID
			if err := tx.Create(&workout.Entries[i]).Error; err != nil {
				return err
			}
		}

		return nil
	})
}

func (pg *PostgresWorkoutStore) DeleteWorkout(id int64) error {
	return pg.db.Transaction(func(tx *gorm.DB) error {
		// Delete entries first
		if err := tx.Where("workout_id = ?", id).Delete(&WorkoutEntry{}).Error; err != nil {
			return err
		}

		// Delete workout
		result := tx.Delete(&Workout{}, id)
		if result.RowsAffected == 0 {
			return gorm.ErrRecordNotFound
		}
		return result.Error
	})
}

func (pg *PostgresWorkoutStore) GetWorkoutOwner(workoutID int64) (int, error) {
	var workout Workout
	err := pg.db.Select("user_id").First(&workout, workoutID).Error
	if err == gorm.ErrRecordNotFound {
		return 0, err
	}
	return int(workout.UserID), err
}
