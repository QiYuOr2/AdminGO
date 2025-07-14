package sys

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Route(router *gin.RouterGroup, db *gorm.DB) {
	UserRoutes(router.Group("/user"), db)
}
