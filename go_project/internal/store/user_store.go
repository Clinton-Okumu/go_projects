package store

import (
	"crypto/sha256"
	"database/sql/driver"
	"errors"
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type password struct {
	plaintext *string
	hash      []byte
}

func (p *password) Set(plaintextPassword string) error {
	hash, err := bcrypt.GenerateFromPassword([]byte(plaintextPassword), 12)
	if err != nil {
		return err
	}

	p.plaintext = &plaintextPassword
	p.hash = hash

	return nil
}

func (p *password) Matches(plaintextPassword string) (bool, error) {
	err := bcrypt.CompareHashAndPassword(p.hash, []byte(plaintextPassword))
	if err != nil {
		switch {
		case errors.Is(err, bcrypt.ErrMismatchedHashAndPassword):
			return false, nil
		default:
			return false, err
		}
	}
	return true, nil
}

// Value implements the driver.Valuer interface for GORM
func (p password) Value() (driver.Value, error) {
	return p.hash, nil
}

// Scan implements the sql.Scanner interface for GORM
func (p *password) Scan(value interface{}) error {
	if value == nil {
		p.hash = nil
		return nil
	}
	bytes, ok := value.([]byte)
	if !ok {
		return errors.New("password hash must be []byte")
	}
	p.hash = bytes
	return nil
}

type User struct {
	ID           int       `gorm:"primaryKey" json:"id"`
	Username     string    `gorm:"not null" json:"username"`
	Email        string    `gorm:"uniqueIndex;not null" json:"email"`
	PasswordHash password  `gorm:"not null" json:"-"`
	Bio          string    `json:"bio"`
	CreatedAt    time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt    time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}

var AnonymousUser = &User{}

func (u *User) IsAnonymous() bool {
	return u == AnonymousUser
}

type PostgresUserStore struct {
	db *gorm.DB
}

func NewPostgresUserStore(db *gorm.DB) *PostgresUserStore {
	return &PostgresUserStore{db: db}
}

type UserStore interface {
	CreateUser(*User) error
	GetUserByUsername(username string) (*User, error)
	UpdateUser(*User) error
	GetUserToken(scope, tokenPlainText string) (*User, error)
}

func (s *PostgresUserStore) CreateUser(user *User) error {
	return s.db.Create(user).Error
}

func (s *PostgresUserStore) GetUserByUsername(username string) (*User, error) {
	var user User
	err := s.db.Where("username = ?", username).First(&user).Error
	if err == gorm.ErrRecordNotFound {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (s *PostgresUserStore) UpdateUser(user *User) error {
	return s.db.Save(user).Error
}

func (s *PostgresUserStore) GetUserToken(scope, plaintextPassword string) (*User, error) {
	tokenHash := sha256.Sum256([]byte(plaintextPassword))
	var user User
	err := s.db.Joins("JOIN tokens t ON t.user_id = users.id").
		Where("t.hash = ? AND t.scope = ? AND t.expiry > ?", tokenHash[:], scope, time.Now()).
		Select("users.id, users.username, users.email, users.password_hash, users.bio, users.created_at, users.updated_at").
		First(&user).Error
	if err == gorm.ErrRecordNotFound {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &user, nil
}
