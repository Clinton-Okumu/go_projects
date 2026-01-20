package middleware

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"go_project/internal/auth/clerkjwt"
	"go_project/internal/store"
	"go_project/internal/utils"
	"net/http"
	"strings"
)

type UserMiddleware struct {
	UserStore store.UserStore
}

type contextKey string

const userContextKey = contextKey("user")

func SetUser(r *http.Request, user *store.User) *http.Request {
	ctx := context.WithValue(r.Context(), userContextKey, user)
	return r.WithContext(ctx)
}

func GetUser(r *http.Request) *store.User {
	user, ok := r.Context().Value(userContextKey).(*store.User)
	if !ok {
		panic("missing user in request")
	}

	return user
}

func (um *UserMiddleware) Authenticate(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Vary", "Authorization")
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			r = SetUser(r, store.AnonymousUser)
			next.ServeHTTP(w, r)
			return
		}

		headerParts := strings.Split(authHeader, " ")
		if len(headerParts) != 2 || headerParts[0] != "Bearer" {
			utils.WriteJSON(w, http.StatusUnauthorized, utils.Envelope{"error": "invalid authorization header"})
			return
		}

		tokenString := headerParts[1]
		claims, err := clerkjwt.Verify(tokenString)
		if err != nil {
			utils.WriteJSON(w, http.StatusUnauthorized, utils.Envelope{"error": "invalid token"})
			return
		}

		user, err := um.UserStore.GetUserByClerkID(claims.Subject)
		if err != nil {
			utils.WriteJSON(w, http.StatusInternalServerError, utils.Envelope{"error": "internal server error"})
			return
		}

		if user == nil {
			email := strings.TrimSpace(claims.Email)
			if email == "" {
				utils.WriteJSON(w, http.StatusUnauthorized, utils.Envelope{"error": "token missing email claim"})
				return
			}
			username := "user_" + claims.Subject
			if email != "" {
				if parts := strings.Split(email, "@"); len(parts) > 0 && parts[0] != "" {
					username = parts[0]
				}
			}

			var pwBytes [16]byte
			_, _ = rand.Read(pwBytes[:])
			pw := hex.EncodeToString(pwBytes[:])

			newUser := &store.User{Username: username, Email: email, ClerkUserID: claims.Subject}
			_ = newUser.PasswordHash.Set(pw)

			err = um.UserStore.CreateUser(newUser)
			if err != nil {
				if email != "" {
					existingByEmail, getErr := um.UserStore.GetUserByEmail(email)
					if getErr == nil && existingByEmail != nil {
						existingByEmail.ClerkUserID = claims.Subject
						_ = um.UserStore.UpdateUser(existingByEmail)
						user = existingByEmail
					}
				}
				if user == nil {
					utils.WriteJSON(w, http.StatusInternalServerError, utils.Envelope{"error": "internal server error"})
					return
				}
			} else {
				user = newUser
			}
		}

		r = SetUser(r, user)
		next.ServeHTTP(w, r)
	})
}

func (um *UserMiddleware) RequireUser(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user := GetUser(r)
		if user.IsAnonymous() {
			utils.WriteJSON(w, http.StatusUnauthorized, utils.Envelope{"error": "You must be logged in to access this route"})
			return
		}

		next.ServeHTTP(w, r)
	}
}
