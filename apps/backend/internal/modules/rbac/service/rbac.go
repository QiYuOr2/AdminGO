package service

import (
	"admingo/internal/modules/rbac/model"
	"strings"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type Service struct {
	db *gorm.DB
}

func New(db *gorm.DB) *Service {
	return &Service{db: db}
}

func (s *Service) VerifyUser(username, password string) (*model.User, error) {
	var user model.User
	if err := s.db.Where("username = ?", username).First(&user).Error; err != nil {
		return nil, err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return nil, err
	}

	return &user, nil
}

func (s *Service) GetUserRoles(userID uint) ([]model.Role, error) {
	var user model.User
	err := s.db.Preload("Roles").First(&user, userID).Error
	if err != nil {
		return nil, err
	}
	return user.Roles, nil
}

func (s *Service) GetRolePermissions(roleID uint) ([]model.Permission, error) {
	var role model.Role
	err := s.db.Preload("Permissions").First(&role, roleID).Error
	if err != nil {
		return nil, err
	}
	return role.Permissions, nil
}

func (s *Service) GetUserPermissions(userID uint) ([]string, error) {
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

func (s *Service) flattenPermissions(permissions []string) []string {
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
