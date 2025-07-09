package auth

import (
	"admingo/internal/modules/auth/api"
	"admingo/internal/modules/auth/service"
	"admingo/internal/modules/rbac"
)

type Handler = api.Handler
type Service = service.Service

func NewService(rbacService *rbac.Service) *Service {
	return service.New(rbacService)
}

func NewHandler(authService *service.Service) *Handler {
	return api.New(authService)
}
