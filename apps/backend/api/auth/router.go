package auth

import (
	"admingo/internal/modules/auth"

	"github.com/gin-gonic/gin"
)

func Router(rg *gin.RouterGroup, handler *auth.Handler) {
	rg.POST("/login", handler.Login)
	rg.POST("/register", handler.Register)
}
