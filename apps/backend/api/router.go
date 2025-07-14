package api

import (
	"admingo/api/auth"
	"admingo/api/sys"
	"admingo/internal/middleware"
	"admingo/internal/pkg/ecode"
	"admingo/internal/pkg/response"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func hello(c *gin.Context) {
	response.Result[any](c, int(ecode.OK), "hello", nil)
}

func SetupRouter(db *gorm.DB) *gin.Engine {
	r := gin.Default()

	r.Use(middleware.I18n())
	r.Use(middleware.Error())
	r.Use(middleware.Database(db))

	r.GET("/", hello)

	api := r.Group("/api")
	{

		auth.Route(api.Group("/auth"))

		sysRoutes := api.Group("/sys")
		{
			sysRoutes.Use(middleware.JWT())
			sys.Route(sysRoutes)
		}
	}

	return r
}
