package service

import (
	"admingo/internal/modules/menu/model"
	"admingo/internal/modules/menu/repository"
	rbacService "admingo/internal/modules/rbac/service"
	"admingo/pkg/crud"
)

type MenuService struct {
	*crud.Service[model.Menu]
	repo repository.MenuRepositoryInterface
	rbac rbacService.RBACServiceInterface
}

func New(repo repository.MenuRepositoryInterface, rbac rbacService.RBACServiceInterface) *MenuService {
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

	allMenus := make(map[uint]model.Menu)
	for _, menu := range menus {
		allMenus[menu.ID] = menu
	}

	parentIDs := make([]uint, 0)
	for _, menu := range menus {
		if menu.ParentID != nil {
			parentIDs = append(parentIDs, *menu.ParentID)
		}
	}

	for len(parentIDs) > 0 {
		parentMenus, err := s.repo.FindAllByIDs(parentIDs)
		if err != nil {
			return nil, err
		}

		parentIDs = make([]uint, 0)
		for _, parentMenu := range parentMenus {
			if _, ok := allMenus[parentMenu.ID]; !ok {
				allMenus[parentMenu.ID] = parentMenu
				if parentMenu.ParentID != nil {
					parentIDs = append(parentIDs, *parentMenu.ParentID)
				}
			}
		}
	}

	result := make([]model.Menu, 0, len(allMenus))
	for _, menu := range allMenus {
		result = append(result, menu)
	}

	return result, nil
}
