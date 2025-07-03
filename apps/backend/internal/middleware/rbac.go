package middleware

import (
	"admingo/internal/modules/jwt"
	"admingo/internal/modules/rbac/service"
	"admingo/internal/pkg/response"

	"github.com/gin-gonic/gin"
)

func PermissionRequired(permissionCode string) gin.HandlerFunc {
	return func(c *gin.Context) {
		claims, exists := c.Get("claims")
		if !exists {
			response.ErrorWithMessage(c, "Claims not found")
			c.Abort()
			return
		}

		customClaims, ok := claims.(*jwt.CustomClaims)
		if !ok {
			response.ErrorWithMessage(c, "Invalid claims type")
			c.Abort()
			return
		}

		if !service.HasPermission(customClaims.Permissions, permissionCode) {
			response.ErrorWithMessage(c, "You don't have permission to access this resource")
			c.Abort()
			return
		}

		c.Next()
	}
}
