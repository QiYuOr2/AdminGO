package repository

import (
	"admingo/internal/modules/menu/model"
	"admingo/pkg/crud"

	"gorm.io/gorm"
)

type MenuRepositoryInterface interface {
	crud.Repository[model.Menu]
	FindByPermissionCodes(permissionCodes []string) ([]model.Menu, error)
	FindAllByIDs(ids []uint) ([]model.Menu, error)
}

type MenuRepository struct {
	crud.Repository[model.Menu]
}

func New(db *gorm.DB) *MenuRepository {
	return &MenuRepository{
		Repository: crud.NewRepository[model.Menu](db),
	}
}

func (r *MenuRepository) FindByPermissionCodes(permissionCodes []string) ([]model.Menu, error) {
	var menus []model.Menu
	if err := r.GetDB().Where("permission_code IN (?)", permissionCodes).Find(&menus).Error; err != nil {
		return nil, err
	}
	return menus, nil
}

func (r *MenuRepository) FindAllByIDs(ids []uint) ([]model.Menu, error) {
	var menus []model.Menu
	if err := r.GetDB().Where("id IN (?)", ids).Find(&menus).Error; err != nil {
		return nil, err
	}
	return menus, nil
}
