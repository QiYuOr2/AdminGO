package jwt

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// JWT handles JWT token generation and validation.
type JWT struct {
	secret []byte
}

// New creates a new JWT instance with the given secret.
func New(secret []byte) *JWT {
	return &JWT{secret: secret}
}

// GenerateToken generates a new JWT token.
func (j *JWT) GenerateToken(userID uint, username string, permissions []string) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &CustomClaims{
		UserID:      userID,
		Username:    username,
		Permissions: permissions,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(j.secret)
}

// ValidateToken validates a JWT token.
func (j *JWT) ValidateToken(tokenString string) (*CustomClaims, error) {
	claims := &CustomClaims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (any, error) {
		return j.secret, nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, err
	}

	return claims, nil
}
