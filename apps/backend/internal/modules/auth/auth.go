package auth

import (
	"admingo/internal/modules/auth/handler"
	"admingo/internal/modules/auth/service"
	"admingo/internal/modules/rbac"
)

type Handler = handler.Handler
type Service = service.Service

func NewService(rbacService *rbac.Service) *Service {
	return service.New(rbacService)
}

func NewHandler(authService *service.Service) *Handler {
	return handler.New(authService)
}
