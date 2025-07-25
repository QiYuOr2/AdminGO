package jwt

import (
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func newTestJWT() *JWT {
	return New([]byte("test_secret_key_for_jwt"))
}

func TestGenerateAndValidateToken(t *testing.T) {
	j := newTestJWT()
	userID := uint(1)
	username := "testuser"
	permissions := []string{"perm1", "perm2"}

	tokenString, err := j.GenerateToken(userID, username, permissions)
	require.NoError(t, err, "GenerateToken should not return error")
	require.NotEmpty(t, tokenString, "Generated token should not be empty")

	claims, err := j.ValidateToken(tokenString)
	require.NoError(t, err, "ValidateToken should not return error")
	require.NotNil(t, claims, "claims should not be nil")

	assert.Equal(t, userID, claims.UserID, "UserID should match")
	assert.Equal(t, username, claims.Username, "Username should match")
	assert.Len(t, claims.Permissions, len(permissions), "Permissions length should match")

	for i, p := range permissions {
		assert.Equal(t, p, claims.Permissions[i], "Permission at index %d should match", i)
	}

	require.NotNil(t, claims.ExpiresAt, "ExpiresAt should not be nil")
	assert.False(t, claims.ExpiresAt.Time.Before(time.Now()), "Token should not be expired")
}

func TestValidateToken_InvalidToken(t *testing.T) {
	j := newTestJWT()

	_, err := j.ValidateToken("this.is.not.a.valid.token")
	require.Error(t, err, "invalid token should return an error")

	// Token signed with different key
	otherJWT := &JWT{secret: []byte("a_different_secret_key")}
	claims := &CustomClaims{
		UserID:      1,
		Username:    "test",
		Permissions: []string{},
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(1 * time.Hour)),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(otherJWT.secret)
	require.NoError(t, err, "Token generation should not fail")

	_, err = j.ValidateToken(tokenString)
	require.Error(t, err, "token signed by another secret should fail validation")
}

func TestValidateToken_ExpiredToken(t *testing.T) {
	j := newTestJWT()

	expirationTime := time.Now().Add(-1 * time.Hour)
	claims := &CustomClaims{
		UserID:      1,
		Username:    "test",
		Permissions: []string{},
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(j.secret)
	require.NoError(t, err, "Token signing should succeed")

	_, err = j.ValidateToken(tokenString)
	require.Error(t, err, "expired token should return an error")
}
