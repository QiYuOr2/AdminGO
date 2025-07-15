package sys

import (
	"admingo/internal/middleware"
	"admingo/internal/modules/rbac/model"
	"admingo/pkg/crud"

	"github.com/gin-gonic/gin"
)

type RoleHandler = crud.Handler[model.Role]

func RoleRouter(rg *gin.RouterGroup, handler *RoleHandler) {
	rg.Use(middleware.JWT())
	rg.GET("/:id", handler.GetByID)
}
