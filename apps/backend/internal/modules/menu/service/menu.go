package service

import (
	rbacModel "admingo/internal/modules/rbac/model"
	rbacService "admingo/internal/modules/rbac/service"

	"admingo/internal/modules/menu/model"
	"admingo/internal/modules/menu/repository"
	"admingo/pkg/crud"
	"admingo/pkg/utils"
	"fmt"
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

func (s *MenuService) CreateMenu(menu *model.Menu) error {
	// 如果没有提供权限码，报错
	if menu.PermissionCode == "" {
		return fmt.Errorf("permission code is required")
	}

	_, err := s.rbac.CreatePermission(menu.PermissionCode, menu.Path)
	if err != nil {
		return err
	}

	err = s.rbac.AssignPermissionToRole("Admin", menu.PermissionCode)
	if err != nil {
		return err
	}

	return s.repo.Create(menu)
}

func (s *MenuService) UpdateMenu(id uint, newMenu *model.Menu) error {
	menu, err := s.repo.GetByID(id)
	if err != nil {
		return err
	}

	if menu.PermissionCode != newMenu.PermissionCode {
		if menu.PermissionCode != "" {
			err := s.rbac.DeletePermission(menu.PermissionCode)
			if err != nil {
				return err
			}
		}
		if newMenu.PermissionCode != "" {
			_, err := s.rbac.CreatePermission(newMenu.PermissionCode, newMenu.Path)
			if err != nil {
				return err
			}
			err = s.rbac.AssignPermissionToRole("Admin", newMenu.PermissionCode)
			if err != nil {
				return err
			}
		}
	} else if menu.Path != newMenu.Path {
		err := s.rbac.UpdatePermission(menu.PermissionCode, &rbacModel.Permission{Path: newMenu.Path})
		if err != nil {
			return err
		}
	}

	utils.MergeNonZero(menu, newMenu, "Sort")

	return s.repo.Update(menu)
}

func (s *MenuService) DeleteMenu(id uint) error {
	menu, err := s.repo.GetByID(id)
	if err != nil {
		return err
	}

	if menu.PermissionCode != "" {
		err := s.rbac.DeletePermission(menu.PermissionCode)
		if err != nil {
			return err
		}
	}

	return s.repo.Delete(id)
}
