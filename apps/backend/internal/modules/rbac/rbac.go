package rbac

import (
	"admingo/internal/modules/rbac/model"

	"gorm.io/gorm"
)

func AutoMigrate(db *gorm.DB) {
	db.AutoMigrate(&model.User{}, &model.Role{}, &model.Permission{})
}
