package service

import (
	"admingo/internal/modules/rbac/model"
	"admingo/internal/modules/rbac/repository"
	"strings"
)

type RBACService struct {
	userRepo       *repository.UserRepository
	roleRepo       *repository.RoleRepository
	permissionRepo *repository.PermissionRepository
}

type RBACServiceInterface interface {
	CreateUser(username, password string) (*model.User, error)
	VerifyUser(username, password string) (*model.User, error)
	GetUserRoles(userID uint) ([]model.Role, error)
	GetRolePermissions(roleID uint) ([]model.Permission, error)
	GetUserPermissions(userID uint) ([]string, error)
	CreatePermission(code, path string) (*model.Permission, error)
	UpdatePermission(code string, newPerm *model.Permission) error
	DeletePermission(code string) error
	AssignPermissionToRole(roleName string, permissionCode string) error
}

func NewRBACService(userRepo *repository.UserRepository, roleRepo *repository.RoleRepository, permissionRepo *repository.PermissionRepository) *RBACService {
	return &RBACService{userRepo: userRepo, roleRepo: roleRepo, permissionRepo: permissionRepo}
}

func (s *RBACService) CreateUser(username, password string) (*model.User, error) {
	return s.userRepo.CreateUser(username, password)
}

func (s *RBACService) VerifyUser(username, password string) (*model.User, error) {
	return s.userRepo.VerifyUser(username, password)
}

func (s *RBACService) GetUserRoles(userID uint) ([]model.Role, error) {
	return s.userRepo.GetUserRoles(userID)
}

func (s *RBACService) GetRolePermissions(roleID uint) ([]model.Permission, error) {
	return s.roleRepo.GetRolePermissions(roleID)
}

func (s *RBACService) GetUserPermissions(userID uint) ([]string, error) {
	roles, err := s.GetUserRoles(userID)
	if err != nil {
		return nil, err
	}

	var permissions []string
	for _, role := range roles {
		rolePermissions, err := s.GetRolePermissions(role.ID)
		if err != nil {
			return nil, err
		}
		for _, p := range rolePermissions {
			permissions = append(permissions, p.Code)
		}
	}

	return s.flattenPermissions(permissions), nil
}

func (s *RBACService) flattenPermissions(permissions []string) []string {
	permissionSet := make(map[string]bool)
	for _, p := range permissions {
		permissionSet[p] = true
	}

	var flatPermissions []string
	for p := range permissionSet {
		flatPermissions = append(flatPermissions, p)
	}
	return flatPermissions
}

func matchPermission(userPermissions string, target string) bool {
	userParts := strings.Split(userPermissions, ":")
	targetParts := strings.Split(target, ":")

	if len(userParts) != len(targetParts) {
		return false
	}

	for i := range userParts {
		if i == len(userParts)-1 && userParts[i] == "*" {
			return true
		}
		if userParts[i] != targetParts[i] {
			return false
		}
	}

	return true
}

func HasPermission(userPermissions []string, permissionCode string) bool {
	for _, permission := range userPermissions {
		if matchPermission(permission, permissionCode) {
			return true
		}
	}

	return false
}

func (s *RBACService) CreatePermission(code, path string) (*model.Permission, error) {
	permission := &model.Permission{Code: code, Path: path}
	err := s.permissionRepo.Create(permission)
	return permission, err
}

func (s *RBACService) UpdatePermission(code string, newPerm *model.Permission) error {
	return s.permissionRepo.UpdateByCode(code, newPerm)
}

func (s *RBACService) DeletePermission(code string) error {
	return s.permissionRepo.DeleteByCode(code)
}

func (s *RBACService) AssignPermissionToRole(roleName string, permissionCode string) error {
	return s.roleRepo.AssignPermissionToRole(roleName, permissionCode)
}
