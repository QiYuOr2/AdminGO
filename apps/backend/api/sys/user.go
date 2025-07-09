package sys

import (
	"admingo/internal/modules/rbac/model"
	"admingo/internal/pkg/response"
	"admingo/pkg/crud"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func UserRoutes(group *gin.RouterGroup, db *gorm.DB) {
	userService := crud.NewService[model.User](db)
	projectResponder := response.NewProjectResponder()
	userHandler := crud.NewHandler(userService, projectResponder)

	group.POST("/", userHandler.Create)
	group.GET("/:id", userHandler.GetByID)
	group.PUT("/:id", userHandler.Update)
	group.DELETE("/:id", userHandler.Delete)
	group.GET("/", userHandler.List)
}
