package service

import (
	"admingo/internal/modules/menu/model"
	"admingo/internal/modules/menu/repository"
	rbacService "admingo/internal/modules/rbac/service"
	"admingo/pkg/crud"
)

type MenuService struct {
	*crud.Service[model.Menu]
	repo *repository.MenuRepository
	rbac rbacService.RBACServiceInterface
}

func New(repo *repository.MenuRepository, rbac rbacService.RBACServiceInterface) *MenuService {
	return &MenuService{
		Service: crud.NewService(repo),
		repo:    repo,
		rbac:    rbac,
	}
}

func (s *MenuService) CRUD() *crud.Service[model.Menu] {
	return s.Service
}

func (s *MenuService) FindByUserID(userID uint) ([]model.Menu, error) {
	permissions, err := s.rbac.GetUserPermissions(userID)
	if err != nil {
		return nil, err
	}

	menus, err := s.repo.FindByPermissionCodes(permissions)
	if err != nil {
		return nil, err
	}

	return menus, nil
}
