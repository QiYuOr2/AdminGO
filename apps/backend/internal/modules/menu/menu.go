package menu

import (
	"admingo/internal/modules/menu/handler"
	"admingo/internal/modules/menu/model"
	"admingo/internal/modules/menu/repository"
	"admingo/internal/modules/menu/service"
	rbacModel "admingo/internal/modules/rbac/model"
	rbacService "admingo/internal/modules/rbac/service"
	"admingo/internal/pkg/response"
	"errors"
	"log"

	"gorm.io/gorm"
)

type Handler = handler.MenuHandler
type Service = service.MenuService
type Repository = repository.MenuRepository

func NewMenuRepository(db *gorm.DB) *Repository {
	return repository.New(db)
}

func NewMenuService(repo *Repository, rbacService *rbacService.RBACService) *Service {
	return service.New(repo, rbacService)
}

func NewMenuHandler(service *Service, responder *response.Responder) *Handler {
	return handler.New(service, responder)
}

func AutoMigrate(db *gorm.DB) {
	db.AutoMigrate(&model.Menu{})
}

func Init(db *gorm.DB) error {

	var existMenu model.Menu
	if err := db.Where("path = ?", "/settings/menu").First(&existMenu).Error; err == nil {
		log.Println("ℹ️  默认菜单已存在，跳过初始化")
		return nil
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}

	permissions := []rbacModel.Permission{
		{Code: "settings:menu", Path: "/settings/menu"},
		{Code: "settings:settings", Path: "/settings/settings"},
	}

	for _, perm := range permissions {
		if err := db.FirstOrCreate(&perm, rbacModel.Permission{Code: perm.Code}).Error; err != nil {
			return err
		}
	}

	var adminRole rbacModel.Role
	if err := db.Where("name = ?", "Admin").First(&adminRole).Error; err != nil {
		return err
	}

	if err := db.Model(&adminRole).Association("Permissions").Append(&permissions); err != nil {
		return err
	}

	parentID := uint(1)
	menus := []model.Menu{
		{Title: "系统设置", Path: "/settings"},
		{Title: "菜单管理", Path: "/settings/menu", PermissionCode: "settings:menu", ParentID: &parentID},
		{Title: "通用设置", Path: "/settings/settings", PermissionCode: "settings:settings", ParentID: &parentID},
	}

	for _, menu := range menus {
		if err := db.FirstOrCreate(&menu, model.Menu{Path: menu.Path}).Error; err != nil {
			return err
		}
	}

	log.Println("✅ Menu 初始化完成")
	return nil
}
