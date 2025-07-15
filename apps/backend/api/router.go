package api

import (
	"admingo/api/auth"
	"admingo/api/sys"
	"admingo/internal/middleware"
	"admingo/internal/pkg/ecode"
	"admingo/internal/pkg/response"

	"github.com/gin-gonic/gin"
)

func hello(c *gin.Context) {
	response.Result[any](c, int(ecode.OK), "hello", nil)
}

func SetupRouter(hc *HandlerCenter) *gin.Engine {
	r := gin.Default()

	r.Use(middleware.I18n())
	r.Use(middleware.Error())

	r.GET("/", hello)

	api := r.Group("/api")
	{
		auth.Router(api, hc.Auth)
		sys.UserRouter(api.Group("/sys/user"), hc.User)
		sys.RoleRouter(api.Group("/sys/role"), hc.Role)
		sys.PermissionRouter(api.Group("/sys/permission"), hc.Permission)
	}

	return r
}
