package service

import (
	"admingo/internal/modules/jwt"
	"admingo/internal/modules/rbac"
	"admingo/internal/pkg/constant"
	"errors"
)

type AuthService struct {
	rbacService *rbac.Service
}

func (s *AuthService) Login(username, password string) (string, error) {
	user, err := s.rbacService.VerifyUser(username, password)

	if err != nil {
		return "", errors.New(constant.Error_InvalidCredentials)
	}

	perms, err := s.rbacService.GetUserPermissions(user.ID)
	if err != nil {
		return "", errors.New(constant.Error_PermissionDenied)
	}

	token, err := jwt.GenerateToken(user.ID, user.Username, perms)
	if err != nil {
		return "", errors.New(constant.Error_TokenGenerateFail)
	}

	return token, nil
}
