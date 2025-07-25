package sys

import (
	"admingo/internal/middleware"
	"admingo/internal/modules/jwt"
	"admingo/internal/modules/menu"

	"github.com/gin-gonic/gin"
)

func MenuRouter(rg *gin.RouterGroup, handler *menu.Handler, jwt *jwt.JWT) {
	rg.Use(middleware.JWT(jwt))

	// rg.GET("/", handler.List)
	rg.GET("/list", handler.FindByUserID)
}
