package sys

import (
	"admingo/internal/middleware"
	"admingo/internal/modules/menu"

	"github.com/gin-gonic/gin"
)

func MenuRouter(rg *gin.RouterGroup, handler *menu.Handler) {
	rg.Use(middleware.JWT())

	// rg.GET("/", handler.List)
	rg.GET("/list", handler.FindByUserID)
}
