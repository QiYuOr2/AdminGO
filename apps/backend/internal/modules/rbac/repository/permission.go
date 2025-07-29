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

func (r *PermissionRepository) UpdateByCode(code string, newPerm *model.Permission) error {
	return r.GetDB().Where("code = ?", code).Updates(newPerm).Error
}

func (r *PermissionRepository) DeleteByCode(code string) error {
	return r.GetDB().Where("code = ?", code).Delete(&model.Permission{}).Error
}
