package auth

import (
	"admingo/internal/modules/auth"
	"admingo/internal/modules/rbac"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterRoutes(group *gin.RouterGroup, db *gorm.DB) {
	rbacService := rbac.NewService(db)
	authService := auth.NewService(rbacService)
	authHandler := auth.NewHandler(authService)

	group.POST("/login", authHandler.Login)
}
