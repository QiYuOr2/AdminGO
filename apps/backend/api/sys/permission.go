package sys

import (
	"admingo/internal/middleware"
	"admingo/internal/modules/rbac/model"
	"admingo/pkg/crud"

	"github.com/gin-gonic/gin"
)

type PermissionHandler = crud.Handler[model.Permission]

func PermissionRouter(rg *gin.RouterGroup, handler *PermissionHandler) {
	rg.Use(middleware.JWT())
	rg.GET("/:id", handler.GetByID)
}
