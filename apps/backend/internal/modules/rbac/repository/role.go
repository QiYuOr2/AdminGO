package repository

import (
	"admingo/internal/modules/rbac/model"
	"admingo/pkg/crud"

	"gorm.io/gorm"
)

type RoleRepository struct {
	crud.Repository[model.Role]
}

func NewRoleRepository(db *gorm.DB) *RoleRepository {
	return &RoleRepository{
		Repository: crud.NewRepository[model.Role](db),
	}
}

func (r *RoleRepository) GetRolePermissions(roleID uint) ([]model.Permission, error) {
	var role model.Role

	err := r.GetDB().Preload("Permissions").First(&role, roleID).Error
	if err != nil {
		return nil, err
	}
	return role.Permissions, nil
}

func (r *RoleRepository) AssignPermissionToRole(roleName string, permissionCode string) error {
	var role model.Role
	if err := r.GetDB().Where("name = ?", roleName).First(&role).Error; err != nil {
		return err
	}

	var permission model.Permission
	if err := r.GetDB().Where("code = ?", permissionCode).First(&permission).Error; err != nil {
		return err
	}

	return r.GetDB().Model(&role).Association("Permissions").Append(&permission)
}
