package utils

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestHashPassword(t *testing.T) {
	password := "mysecretpassword"

	hash, err := HashPassword(password)
	require.NoError(t, err, "HashPassword() should not return an error")
	require.NotEmpty(t, hash, "HashPassword() should return a non-empty hash")
	assert.NotEqual(t, password, hash, "HashPassword() should not return the original password")
}

func TestCheckPassword(t *testing.T) {
	password := "mysecretpassword"

	hash, err := HashPassword(password)
	require.NoError(t, err, "Failed to hash password for testing")

	// Correct password
	assert.True(t, CheckPassword(password, hash), "CheckPassword() with correct password should return true")

	// Incorrect password
	assert.False(t, CheckPassword("wrongpassword", hash), "CheckPassword() with incorrect password should return false")
}

func TestCheckPasswordIntegration(t *testing.T) {
	password := "mysecretpassword"

	hashedPassword, err := HashPassword(password)
	require.NoError(t, err, "HashPassword() failed")
	require.NotEmpty(t, hashedPassword)

	assert.True(t, CheckPassword(password, hashedPassword), "CheckPassword() should return true for correct password")
	assert.False(t, CheckPassword("wrongpassword", hashedPassword), "CheckPassword() should return false for incorrect password")
}
