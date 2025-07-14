package auth

import (
	"admingo/internal/modules/auth"
	"admingo/internal/modules/rbac"

	"github.com/gin-gonic/gin"
)

func Route(rg *gin.RouterGroup) {
	rbacService := rbac.NewService(db)
	authService := auth.NewService(rbacService)
	authHandler := auth.NewHandler(authService)

	rg.POST("/login", authHandler.Login)
}
