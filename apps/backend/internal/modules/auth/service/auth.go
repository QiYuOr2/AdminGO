package service

import (
	"admingo/internal/modules/jwt"
	"admingo/internal/modules/rbac"
	"admingo/internal/pkg/ecode"
)

type Service struct {
	rbacService *rbac.Service
}

func New(rbac *rbac.Service) *Service {
	return &Service{rbacService: rbac}
}

func (s *Service) Login(username, password string) (string, error) {
	user, err := s.rbacService.VerifyUser(username, password)

	if err != nil {
		return "", ecode.New(ecode.Error_InvalidCredentials, "用户名或密码错误")
	}

	perms, err := s.rbacService.GetUserPermissions(user.ID)
	if err != nil {
		return "", ecode.New(ecode.Error_PermissionDenied, "获取用户权限失败")
	}

	token, err := jwt.GenerateToken(user.ID, user.Username, perms)
	if err != nil {
		return "", ecode.New(ecode.Error_TokenGenerateFail, "生成 Token 失败")
	}

	return token, nil
}
