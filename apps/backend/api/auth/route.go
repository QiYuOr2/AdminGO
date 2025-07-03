package auth

import "github.com/gin-gonic/gin"

func RegisterRoutes(group *gin.RouterGroup) {
	group.POST("/login")
}
