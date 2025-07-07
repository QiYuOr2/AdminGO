package sys

import (
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.RouterGroup) {

	UserRoutes(router.Group("/user"))
}
