package api

import (
	"admingo/api/auth"
	"admingo/internal/middleware"
	"admingo/internal/pkg/ecode"
	"admingo/internal/pkg/response"

	"github.com/gin-gonic/gin"
)

func hello(c *gin.Context) {
	response.Result[any](c, int(ecode.OK), "hello", nil)
}

func SetupRouter() *gin.Engine {
	r := gin.Default()

	r.Use(middleware.I18n())
	r.Use(middleware.JWT())

	r.GET("/", hello)

	api := r.Group("/api")
	{
		auth.RegisterRoutes(api.Group("/auth"))
	}

	return r
}
