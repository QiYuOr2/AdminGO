package sys

import (
	"admingo/internal/middleware"
	"admingo/internal/modules/rbac/model"
	"admingo/pkg/crud"

	"github.com/gin-gonic/gin"
)

type UserHandler = crud.Handler[model.User]

func UserRouter(rg *gin.RouterGroup, handler *UserHandler) {
	rg.Use(middleware.JWT())
	rg.GET("/:id", handler.GetByID)
	rg.GET("/", handler.List)
}
