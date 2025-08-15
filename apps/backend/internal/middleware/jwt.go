package middleware

import (
	"admingo/internal/modules/jwt"
	"admingo/internal/pkg/response"
	"strings"

	"github.com/gin-gonic/gin"
)

func JWT(jwt *jwt.JWT) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			response.UnAuth(c, "Authorization header is missing")
			c.Abort()
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			response.UnAuth(c, "Invalid Authorization header format")
			c.Abort()
			return
		}

		tokenString := parts[1]
		claims, err := jwt.ValidateToken(tokenString)
		if err != nil {
			response.UnAuth(c, "Invalid token")
			c.Abort()
			return
		}

		c.Set("claims", claims)
		c.Set("userId", claims.UserID)
		c.Next()
	}
}
