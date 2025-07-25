package api

import (
	"admingo/api/auth"
	"admingo/api/sys"
	"admingo/internal/container"
	"admingo/internal/middleware"
	"admingo/internal/pkg/ecode"
	"admingo/internal/pkg/response"

	"github.com/gin-gonic/gin"
)

func hello(c *gin.Context) {
	response.Result[any](c, int(ecode.OK), "hello", nil)
}

func SetupRouter(hc *HandlerCenter, container *container.ServiceContainer) *gin.Engine {
	r := gin.Default()

	r.Use(middleware.I18n())
	r.Use(middleware.Error())

	r.GET("/", hello)

	api := r.Group("/api")
	{
		jwt := container.JWT

		auth.Router(api, hc.Auth)
		sys.UserRouter(api.Group("/sys/user"), hc.User, jwt)
		sys.RoleRouter(api.Group("/sys/role"), hc.Role, jwt)
		sys.PermissionRouter(api.Group("/sys/permission"), hc.Permission, jwt)
		sys.MenuRouter(api.Group("/sys/menu"), hc.Menu, jwt)
	}

	return r
}
