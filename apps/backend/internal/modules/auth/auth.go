package auth

import (
	"admingo/internal/modules/auth/handler"
	"admingo/internal/modules/auth/model"
	"admingo/internal/modules/auth/service"
	"admingo/internal/modules/jwt"
	"admingo/internal/modules/rbac"
	"admingo/internal/pkg/response"

	"gorm.io/gorm"
)

type Handler = handler.Handler
type Service = service.Service

func NewService(rbacService *rbac.Service, jwt *jwt.JWT) *Service {
	return service.New(rbacService, jwt)
}

func NewHandler(authService *service.Service, responder *response.Responder) *Handler {
	return handler.New(authService, responder)
}

func AutoMigrate(db *gorm.DB) {
	db.AutoMigrate(&model.Account{})
}
