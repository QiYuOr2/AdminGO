package service

import (
	"admingo/internal/modules/menu/model"
	"admingo/internal/modules/menu/repository"
	"admingo/pkg/crud"
)

type MenuService struct {
	*crud.Service[model.Menu]
}

func New(repo *repository.MenuRepository) *MenuService {
	return &MenuService{
		Service: crud.NewService(repo),
	}
}

func (s *MenuService) CRUD() *crud.Service[model.Menu] {
	return s.Service
}
