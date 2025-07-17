package repository

import (
	"admingo/internal/modules/menu/model"
	"admingo/pkg/crud"

	"gorm.io/gorm"
)

type MenuRepository struct {
	crud.Repository[model.Menu]
}

func New(db *gorm.DB) *MenuRepository {
	return &MenuRepository{
		Repository: crud.NewRepository[model.Menu](db),
	}
}
