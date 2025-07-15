package repository

import (
	"admingo/internal/modules/rbac/model"
	"admingo/pkg/crud"

	"gorm.io/gorm"
)

type PermissionRepository struct {
	crud.Repository[model.Permission]
}

func NewPermissionRepository(db *gorm.DB) *PermissionRepository {
	return &PermissionRepository{
		Repository: crud.NewRepository[model.Permission](db),
	}
}
