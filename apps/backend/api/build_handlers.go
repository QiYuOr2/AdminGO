package api

import (
	"admingo/api/sys"
	"admingo/internal/modules/auth"
	"admingo/internal/modules/menu"

	RBACRepo "admingo/internal/modules/rbac/repository"
	RBACService "admingo/internal/modules/rbac/service"
	"admingo/internal/pkg/response"
	"admingo/pkg/crud"

	"gorm.io/gorm"
)

type HandlerCenter struct {
	Auth       *auth.Handler
	User       *sys.UserHandler
	Role       *sys.RoleHandler
	Permission *sys.PermissionHandler
	Menu       *menu.Handler
}

func BuildHandlers(db *gorm.DB) *HandlerCenter {
	responder := response.NewAGOResponder()

	userRepo := RBACRepo.NewUserRepository(db)
	roleRepo := RBACRepo.NewRoleRepository(db)
	permissionRepo := RBACRepo.NewPermissionRepository(db)

	rbacService := RBACService.NewRBACService(userRepo, roleRepo, permissionRepo)
	authService := auth.NewService(rbacService)
	authHandler := auth.NewHandler(authService, responder)

	userService := crud.NewService(userRepo)
	userHandler := crud.NewHandler(userService, responder)

	roleService := crud.NewService(roleRepo)
	roleHandler := crud.NewHandler(roleService, responder)

	permissionService := crud.NewService(permissionRepo)
	permissionHandler := crud.NewHandler(permissionService, responder)

	menuRepo := menu.NewMenuRepository(db)
	menuService := menu.NewMenuService(menuRepo, rbacService)
	menuHandler := menu.NewMenuHandler(menuService, responder)

	return &HandlerCenter{
		Auth:       authHandler,
		User:       userHandler,
		Role:       roleHandler,
		Permission: permissionHandler,
		Menu:       menuHandler,
	}
}
