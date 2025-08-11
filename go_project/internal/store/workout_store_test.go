package store

import (
	"database/sql"
	"testing"

	_ "github.com/jackc/pgx/v4/stdlib"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func setupTestDB(t *testing.T) *sql.DB {
	db, err := sql.Open("pgx", "host=localhost user=postgres password=postgres dbname=postgres port=5433 sslmode=disable")
	if err != nil {
		t.Fatalf("opening test db: %v", err)
	}

	// run the migratoins for our test db
	err = Migrate(db, "../../migrations/")
	if err != nil {
		t.Fatalf("migrating test db error: %v", err)
	}

	_, err = db.Exec(`TRUNCATE users, workouts, workout_entries CASCADE`)
	if err != nil {
		t.Fatalf("truncating tables %v", err)
	}

	return db
}

func TestCreateWorkout(t *testing.T) {
	db := setupTestDB(t)
	defer db.Close()

	store := NewPostgresWorkoutStore(db)
	userStore := NewPostgresUserStore(db)

	testUser := &User{
		Username: "melkey",
		Email:    "melkey@example.com",
	}

	err := testUser.PasswordHash.Set("securepassword")
	require.NoError(t, err)

	err = userStore.CreateUser(testUser)
	require.NoError(t, err)

	tests := []struct {
		name    string
		workout *Workout
		wantErr bool
	}{
		{
			name: "valid workout",
			workout: &Workout{
				UserID:            testUser.ID,
				Title:             "push day",
				Description:       "upper body day",
				DurationInMinutes: 60,
				CaloriesBurned:    200,
				Entries: []WorkoutEntry{
					{
						ExerciseName: "Bench press",
						Sets:         3,
						Reps:         IntPtr(10),
						Weight:       FloatPtr(135.5),
						Notes:        "warm up properly",
						OrderIndex:   1,
					},
				},
			},
			wantErr: false,
		},
		{
			name: "workout with invalid entries",
			workout: &Workout{
				UserID:            testUser.ID,
				Title:             "full body",
				Description:       "complete workout",
				DurationInMinutes: 90,
				CaloriesBurned:    500,
				Entries: []WorkoutEntry{
					{
						ExerciseName: "Plank",
						Sets:         3,
						Reps:         IntPtr(60),
						Notes:        "keep form",
						OrderIndex:   1,
					},
					{
						ExerciseName:      "squats",
						Sets:              4,
						Reps:              IntPtr(12),
						DurationInSeconds: IntPtr(60),
						Weight:            FloatPtr(185.0),
						Notes:             "full depth",
						OrderIndex:        2,
					},
				},
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			createdWorkout, err := store.CreateWorkout(tt.workout)
			if tt.wantErr {
				assert.Error(t, err)
				return
			}

			require.NoError(t, err)
			assert.Equal(t, tt.workout.Title, createdWorkout.Title)
			assert.Equal(t, tt.workout.Description, createdWorkout.Description)
			assert.Equal(t, tt.workout.DurationInMinutes, createdWorkout.DurationInMinutes)

			retrieved, err := store.GetWorkoutByID(int64(createdWorkout.ID))
			require.NoError(t, err)

			assert.Equal(t, createdWorkout.ID, retrieved.ID)
			assert.Equal(t, len(tt.workout.Entries), len(retrieved.Entries))

			for i := range retrieved.Entries {
				assert.Equal(t, tt.workout.Entries[i].ExerciseName, retrieved.Entries[i].ExerciseName)
				assert.Equal(t, tt.workout.Entries[i].Sets, retrieved.Entries[i].Sets)
				assert.Equal(t, tt.workout.Entries[i].OrderIndex, retrieved.Entries[i].OrderIndex)
			}
		})
	}
}

func TestGetWorkoutByID(t *testing.T) {
	db := setupTestDB(t)
	defer db.Close()

	store := NewPostgresWorkoutStore(db)
	userStore := NewPostgresUserStore(db)

	testUser := &User{
		Username: "testuser",
		Email:    "test@example.com",
	}
	err := testUser.PasswordHash.Set("password")
	require.NoError(t, err)
	err = userStore.CreateUser(testUser)
	require.NoError(t, err)

	// Create a workout to retrieve
	workout := &Workout{
		UserID:            testUser.ID,
		Title:             "Morning Run",
		Description:       "Outdoor cardio",
		DurationInMinutes: 30,
		CaloriesBurned:    300,
		Entries: []WorkoutEntry{
			{ExerciseName: "Running", Sets: 1, DurationInSeconds: IntPtr(1800), OrderIndex: 1},
		},
	}
	createdWorkout, err := store.CreateWorkout(workout)
	require.NoError(t, err)
	require.NotNil(t, createdWorkout)

	tests := []struct {
		name      string
		workoutID int64
		wantFound bool
		wantErr   bool
	}{
		{
			name:      "existing workout",
			workoutID: int64(createdWorkout.ID),
			wantFound: true,
			wantErr:   false,
		},
		{
			name:      "non-existent workout",
			workoutID: 9999, // A non-existent ID
			wantFound: false,
			wantErr:   false, // store returns nil, nil for not found
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			retrievedWorkout, err := store.GetWorkoutByID(tt.workoutID)
			if tt.wantErr {
				assert.Error(t, err)
				return
			}
			require.NoError(t, err)

			if tt.wantFound {
				assert.NotNil(t, retrievedWorkout)
				assert.Equal(t, createdWorkout.ID, retrievedWorkout.ID)
				assert.Equal(t, createdWorkout.Title, retrievedWorkout.Title)
				assert.Equal(t, len(createdWorkout.Entries), len(retrievedWorkout.Entries))
			} else {
				assert.Nil(t, retrievedWorkout)
			}
		})
	}
}

func TestUpdateWorkout(t *testing.T) {
	db := setupTestDB(t)
	defer db.Close()

	store := NewPostgresWorkoutStore(db)
	userStore := NewPostgresUserStore(db)

	testUser := &User{
		Username: "updateuser",
		Email:    "update@example.com",
	}
	err := testUser.PasswordHash.Set("password")
	require.NoError(t, err)
	err = userStore.CreateUser(testUser)
	require.NoError(t, err)

	// Create an initial workout
	initialWorkout := &Workout{
		UserID:            testUser.ID,
		Title:             "Old Workout",
		Description:       "Initial description",
		DurationInMinutes: 45,
		CaloriesBurned:    250,
		Entries: []WorkoutEntry{
			{ExerciseName: "Pushups", Sets: 3, Reps: IntPtr(15), OrderIndex: 1},
		},
	}
	createdWorkout, err := store.CreateWorkout(initialWorkout)
	require.NoError(t, err)
	require.NotNil(t, createdWorkout)

	// Test case 1: Update main fields and add an entry
	updatedWorkout1 := &Workout{
		ID:                createdWorkout.ID,
		UserID:            testUser.ID,
		Title:             "New Workout Title",
		Description:       "Updated description",
		DurationInMinutes: 60,
		CaloriesBurned:    350,
		Entries: []WorkoutEntry{
			{ExerciseName: "Pushups", Sets: 3, Reps: IntPtr(15), OrderIndex: 1},
			{ExerciseName: "Situps", Sets: 4, Reps: IntPtr(20), OrderIndex: 2},
		},
	}
	err = store.UpdateWorkout(updatedWorkout1)
	require.NoError(t, err)

	retrievedWorkout1, err := store.GetWorkoutByID(int64(createdWorkout.ID))
	require.NoError(t, err)
	assert.Equal(t, updatedWorkout1.Title, retrievedWorkout1.Title)
	assert.Equal(t, updatedWorkout1.Description, retrievedWorkout1.Description)
	assert.Equal(t, updatedWorkout1.DurationInMinutes, retrievedWorkout1.DurationInMinutes)
	assert.Equal(t, updatedWorkout1.CaloriesBurned, retrievedWorkout1.CaloriesBurned)
	assert.Equal(t, len(updatedWorkout1.Entries), len(retrievedWorkout1.Entries))
	assert.Equal(t, updatedWorkout1.Entries[0].ExerciseName, retrievedWorkout1.Entries[0].ExerciseName)
	assert.Equal(t, updatedWorkout1.Entries[1].ExerciseName, retrievedWorkout1.Entries[1].ExerciseName)

	// Test case 2: Update entries (remove one, modify one)
	updatedWorkout2 := &Workout{
		ID:                createdWorkout.ID,
		UserID:            testUser.ID,
		Title:             "New Workout Title", // Keep same title
		Description:       "Updated description",
		DurationInMinutes: 60,
		CaloriesBurned:    350,
		Entries: []WorkoutEntry{
			{ExerciseName: "Situps Modified", Sets: 5, Reps: IntPtr(25), OrderIndex: 1},
		},
	}
	err = store.UpdateWorkout(updatedWorkout2)
	require.NoError(t, err)

	retrievedWorkout2, err := store.GetWorkoutByID(int64(createdWorkout.ID))
	require.NoError(t, err)
	assert.Equal(t, len(updatedWorkout2.Entries), len(retrievedWorkout2.Entries))
	assert.Equal(t, updatedWorkout2.Entries[0].ExerciseName, retrievedWorkout2.Entries[0].ExerciseName)
	assert.Equal(t, *updatedWorkout2.Entries[0].Reps, *retrievedWorkout2.Entries[0].Reps)

	// Test case 3: Update non-existent workout
	nonExistentWorkout := &Workout{
		ID:                9999,
		UserID:            testUser.ID,
		Title:             "Non Existent",
		Description:       "Should not be updated",
		DurationInMinutes: 10,
		CaloriesBurned:    10,
		Entries:           []WorkoutEntry{},
	}
	err = store.UpdateWorkout(nonExistentWorkout)
	assert.ErrorIs(t, err, sql.ErrNoRows)
}

func TestDeleteWorkout(t *testing.T) {
	db := setupTestDB(t)
	defer db.Close()

	store := NewPostgresWorkoutStore(db)
	userStore := NewPostgresUserStore(db)

	testUser := &User{
		Username: "deleteuser",
		Email:    "delete@example.com",
	}
	err := testUser.PasswordHash.Set("password")
	require.NoError(t, err)
	err = userStore.CreateUser(testUser)
	require.NoError(t, err)

	// Create a workout to delete
	workoutToDelete := &Workout{
		UserID:            testUser.ID,
		Title:             "Workout to Delete",
		Description:       "This will be deleted",
		DurationInMinutes: 20,
		CaloriesBurned:    100,
		Entries: []WorkoutEntry{
			{ExerciseName: "Stretching", Sets: 1, DurationInSeconds: IntPtr(1200), OrderIndex: 1},
		},
	}
	createdWorkout, err := store.CreateWorkout(workoutToDelete)
	require.NoError(t, err)
	require.NotNil(t, createdWorkout)

	// Test case 1: Successfully delete an existing workout
	err = store.DeleteWorkout(int64(createdWorkout.ID))
	require.NoError(t, err)

	// Verify it's deleted
	retrievedWorkout, err := store.GetWorkoutByID(int64(createdWorkout.ID))
	require.NoError(t, err) // Should not return an error, but nil workout
	assert.Nil(t, retrievedWorkout)

	// Test case 2: Attempt to delete a non-existent workout
	err = store.DeleteWorkout(9999) // Non-existent ID
	assert.ErrorIs(t, err, sql.ErrNoRows)
}

func IntPtr(i int) *int {
	return &i
}

func FloatPtr(i float64) *float64 {
	return &i
}
