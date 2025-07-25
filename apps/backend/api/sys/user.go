package sys

import (
	"admingo/internal/middleware"
	"admingo/internal/modules/jwt"
	"admingo/internal/modules/rbac/model"
	"admingo/pkg/crud"

	"github.com/gin-gonic/gin"
)

type UserHandler = crud.Handler[model.User]

func UserRouter(rg *gin.RouterGroup, handler *UserHandler, jwt *jwt.JWT) {
	rg.Use(middleware.JWT(jwt))

	rg.GET("/:id", handler.GetByID)
	rg.GET("/", handler.List)
}
