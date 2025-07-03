package rbac

import (
	"admingo/internal/modules/rbac/model"
	"admingo/internal/modules/rbac/service"

	"gorm.io/gorm"
)

// Service 是 rbac 服务的别名
type Service = service.Service

// New 是 rbac.service.New 的别名
func NewService(db *gorm.DB) *Service {
	return service.New(db)
}

func AutoMigrate(db *gorm.DB) {
	db.AutoMigrate(&model.User{}, &model.Role{}, &model.Permission{})
}
