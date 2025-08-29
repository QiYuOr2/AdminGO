package service

import (
	"admingo/internal/modules/rbac/model"
	"admingo/internal/modules/rbac/repository"
	"admingo/pkg/crud"
)

type RoleService struct {
	*crud.Service[model.Role]
	repo repository.RoleRepositoryInterface
	rbac RBACServiceInterface
}

func NewRoleService(repo repository.RoleRepositoryInterface, rbac RBACServiceInterface) *RoleService {
	return &RoleService{
		Service: crud.NewService(repo),
		repo:    repo,
		rbac:    rbac,
	}
}

func (s *RoleService) CRUD() *crud.Service[model.Role] {
	return s.Service
}

func (s *RoleService) FindRoleAndPermissions(offset, limit int) ([]model.Role, error) {
	roles, err := s.repo.List(offset, limit)
	if err != nil {
		return nil, err
	}

	for i, role := range roles {
		perms, err := s.rbac.GetRolePermissions(role.ID)
		if err != nil {
			return nil, err
		}
		roles[i].Permissions = perms
	}

	return roles, nil
}
