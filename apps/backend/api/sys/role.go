package sys

import (
	"admingo/internal/middleware"
	"admingo/internal/modules/jwt"
	"admingo/internal/modules/rbac/handler"

	"github.com/gin-gonic/gin"
)

func RoleRouter(rg *gin.RouterGroup, handler *handler.RoleHandler, jwt *jwt.JWT) {
	rg.Use(middleware.JWT(jwt))

	rg.GET("/", handler.List)
	rg.GET("/:id", handler.GetByID)
}
