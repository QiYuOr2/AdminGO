package repository

import (
	"admingo/internal/modules/rbac/model"
	"admingo/pkg/crud"

	"gorm.io/gorm"
)

type RoleRepository interface {
	crud.Repository[model.Role]
	GetRolePermissions(roleID uint) ([]model.Permission, error)
}

type roleRepository struct {
	crud.Repository[model.Role]
}

func NewRoleRepository(db *gorm.DB) RoleRepository {
	return &roleRepository{
		Repository: crud.NewRepository[model.Role](db),
	}
}

func (r *roleRepository) GetRolePermissions(roleID uint) ([]model.Permission, error) {
	var role model.Role

	err := r.GetDB().Preload("Permissions").First(&role, roleID).Error
	if err != nil {
		return nil, err
	}
	return role.Permissions, nil
}
