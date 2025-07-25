package api

import (
	"admingo/api/sys"
	"admingo/internal/container"
	"admingo/internal/modules/auth"
	"admingo/internal/modules/menu"

	RBACRepo "admingo/internal/modules/rbac/repository"
	RBACService "admingo/internal/modules/rbac/service"
	"admingo/internal/pkg/response"
	"admingo/pkg/crud"
)

type HandlerCenter struct {
	Auth       *auth.Handler
	User       *sys.UserHandler
	Role       *sys.RoleHandler
	Permission *sys.PermissionHandler
	Menu       *menu.Handler
}

func BuildHandlers(container *container.ServiceContainer) *HandlerCenter {
	responder := response.NewAGOResponder()

	// Repositories
	userRepo := RBACRepo.NewUserRepository(container.DB)
	roleRepo := RBACRepo.NewRoleRepository(container.DB)
	permissionRepo := RBACRepo.NewPermissionRepository(container.DB)
	menuRepo := menu.NewMenuRepository(container.DB)

	// Services
	rbacService := RBACService.NewRBACService(userRepo, roleRepo, permissionRepo)
	authService := auth.NewService(rbacService, container.JWT)
	userService := crud.NewService(userRepo)
	roleService := crud.NewService(roleRepo)
	permissionService := crud.NewService(permissionRepo)
	menuService := menu.NewMenuService(menuRepo, rbacService)

	// Handlers
	authHandler := auth.NewHandler(authService, responder)
	userHandler := crud.NewHandler(userService, responder)
	roleHandler := crud.NewHandler(roleService, responder)
	permissionHandler := crud.NewHandler(permissionService, responder)
	menuHandler := menu.NewMenuHandler(menuService, responder)

	return &HandlerCenter{
		Auth:       authHandler,
		User:       userHandler,
		Role:       roleHandler,
		Permission: permissionHandler,
		Menu:       menuHandler,
	}
}
