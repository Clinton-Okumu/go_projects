package clerkjwt

import (
	"errors"
	"fmt"
	"net/url"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/MicahParks/keyfunc"
	"github.com/golang-jwt/jwt/v4"
)

type Claims struct {
	jwt.RegisteredClaims
	Email string `json:"email,omitempty"`
}

var (
	jwksOnce sync.Once
	jwks     *keyfunc.JWKS
	jwksErr  error
)

func issuer() string {
	return strings.TrimSpace(os.Getenv("CLERK_ISSUER"))
}

func audience() string {
	return strings.TrimSpace(os.Getenv("CLERK_AUDIENCE"))
}

func jwksURL() (string, error) {
	if v := strings.TrimSpace(os.Getenv("CLERK_JWKS_URL")); v != "" {
		return v, nil
	}

	iss := issuer()
	if iss == "" {
		return "", errors.New("CLERK_JWKS_URL or CLERK_ISSUER must be set")
	}

	u, err := url.Parse(iss)
	if err != nil {
		return "", fmt.Errorf("invalid CLERK_ISSUER: %w", err)
	}
	u.Path = strings.TrimSuffix(u.Path, "/") + "/.well-known/jwks.json"
	return u.String(), nil
}

func getJWKS() (*keyfunc.JWKS, error) {
	jwksOnce.Do(func() {
		jwksURL, err := jwksURL()
		if err != nil {
			jwksErr = err
			return
		}

		jwks, jwksErr = keyfunc.Get(jwksURL, keyfunc.Options{
			RefreshInterval: time.Hour,
			RefreshErrorHandler: func(error) {
				// no-op
			},
		})
	})

	return jwks, jwksErr
}

func Verify(tokenString string) (*Claims, error) {
	if strings.TrimSpace(tokenString) == "" {
		return nil, errors.New("missing token")
	}

	jwks, err := getJWKS()
	if err != nil {
		return nil, err
	}

	parser := jwt.NewParser(jwt.WithValidMethods([]string{"RS256"}))

	token, err := parser.ParseWithClaims(tokenString, &Claims{}, jwks.Keyfunc)
	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*Claims)
	if !ok || !token.Valid {
		return nil, errors.New("invalid token")
	}

	if iss := issuer(); iss != "" && claims.Issuer != iss {
		return nil, errors.New("invalid token issuer")
	}

	if aud := audience(); aud != "" {
		found := false
		for _, a := range claims.Audience {
			if a == aud {
				found = true
				break
			}
		}
		if !found {
			return nil, errors.New("invalid token audience")
		}
	}

	if strings.TrimSpace(claims.Subject) == "" {
		return nil, errors.New("missing subject")
	}

	return claims, nil
}
