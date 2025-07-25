package sys

import (
	"admingo/internal/middleware"
	"admingo/internal/modules/jwt"
	"admingo/internal/modules/rbac/model"
	"admingo/pkg/crud"

	"github.com/gin-gonic/gin"
)

type PermissionHandler = crud.Handler[model.Permission]

func PermissionRouter(rg *gin.RouterGroup, handler *PermissionHandler, jwt *jwt.JWT) {
	rg.Use(middleware.JWT(jwt))

	rg.GET("/:id", handler.GetByID)
}
