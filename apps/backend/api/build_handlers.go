package api

import (
	"admingo/api/sys"
	"admingo/internal/modules/auth"
	rbacRepo "admingo/internal/modules/rbac/repository"
	rbacService "admingo/internal/modules/rbac/service"
	"admingo/internal/pkg/response"
	"admingo/pkg/crud"

	"gorm.io/gorm"
)

type HandlerCenter struct {
	Auth       *auth.Handler
	User       *sys.UserHandler
	Role       *sys.RoleHandler
	Permission *sys.PermissionHandler
}

func BuildHandlers(db *gorm.DB) *HandlerCenter {
	responder := response.NewAGOResponder()

	userRepo := rbacRepo.NewUserRepository(db)
	roleRepo := rbacRepo.NewRoleRepository(db)
	permissionRepo := rbacRepo.NewPermissionRepository(db)

	rbacService := rbacService.NewRBACService(userRepo, roleRepo, permissionRepo)
	authService := auth.NewService(rbacService)
	authHandler := auth.NewHandler(authService)

	userService := crud.NewService(userRepo)
	userHandler := crud.NewHandler(userService, responder)

	roleService := crud.NewService(roleRepo)
	roleHandler := crud.NewHandler(roleService, responder)

	permissionService := crud.NewService(permissionRepo)
	permissionHandler := crud.NewHandler(permissionService, responder)

	return &HandlerCenter{
		Auth:       authHandler,
		User:       userHandler,
		Role:       roleHandler,
		Permission: permissionHandler,
	}
}
