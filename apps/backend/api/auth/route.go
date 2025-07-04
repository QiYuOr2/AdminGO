package auth

import (
	"admingo/internal/modules/auth"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(group *gin.RouterGroup) {
	authHandler := auth.NewHandler()

	group.POST("/login", authHandler.Login)
}
