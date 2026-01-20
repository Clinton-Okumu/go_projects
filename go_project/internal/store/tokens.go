package store

import (
	"go_project/internal/tokens"
	"time"

	"gorm.io/gorm"
)

type PostgresTokenStore struct {
	db *gorm.DB
}

func NewPostgresTokenStore(db *gorm.DB) *PostgresTokenStore {
	return &PostgresTokenStore{
		db: db,
	}
}

type TokenStore interface {
	Insert(token *tokens.Token) error
	CreateNewToken(userID int, ttl time.Duration, scope string) (*tokens.Token, error)
	DeleteAllTokensForUser(userID int, scope string) error
}

func (t *PostgresTokenStore) CreateNewToken(userID int, ttl time.Duration, scope string) (*tokens.Token, error) {
	token, err := tokens.GenerateToken(userID, ttl, scope)
	if err != nil {
		return nil, err
	}

	error := t.Insert(token)
	return token, error
}

func (t *PostgresTokenStore) Insert(token *tokens.Token) error {
	return t.db.Create(&Token{
		Hash:   token.Hash,
		UserID: token.UserID,
		Expiry: token.Expiry,
		Scope:  token.Scope,
	}).Error
}

func (t *PostgresTokenStore) DeleteAllTokensForUser(userID int, scope string) error {
	return t.db.Where("user_id = ? AND scope = ?", userID, scope).Delete(&Token{}).Error
}
