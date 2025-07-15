package repository

import (
	"admingo/internal/modules/rbac/model"
	"admingo/pkg/crud"

	"gorm.io/gorm"
)

type PermissionRepository interface {
	crud.Repository[model.Permission]
}

type permissionRepository struct {
	crud.Repository[model.Permission]
}

func NewPermissionRepository(db *gorm.DB) PermissionRepository {
	return &permissionRepository{
		Repository: crud.NewRepository[model.Permission](db),
	}
}
