package sys

import (
	"admingo/internal/middleware"
	"admingo/internal/modules/jwt"
	"admingo/internal/modules/rbac/model"
	"admingo/pkg/crud"

	"github.com/gin-gonic/gin"
)

type RoleHandler = crud.Handler[model.Role]

func RoleRouter(rg *gin.RouterGroup, handler *RoleHandler, jwt *jwt.JWT) {
	rg.Use(middleware.JWT(jwt))

	rg.GET("/:id", handler.GetByID)
}
