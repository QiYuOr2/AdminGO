package rbac

import (
	"admingo/internal/modules/rbac/model"
	"admingo/internal/modules/rbac/service"
	"admingo/internal/pkg/utils"
	"log"

	"gorm.io/gorm"
)

type Service = service.Service

func NewService(db *gorm.DB) *Service {
	return service.New(db)
}

func AutoMigrate(db *gorm.DB) {
	db.AutoMigrate(&model.User{}, &model.Role{}, &model.Permission{})
}

func Init(db *gorm.DB) error {
	permissions := []model.Permission{
		{Code: "sys:user:*", Path: "/api/user/*"},
		{Code: "sys:role:*", Path: "/api/role/*"},
		{Code: "sys:permission:*", Path: "/api/permission/*"},
	}

	for _, perm := range permissions {
		if err := db.FirstOrCreate(&perm, model.Permission{Code: perm.Code}).Error; err != nil {
			return err
		}
	}

	adminRole := model.Role{Name: "Admin"}
	if err := db.FirstOrCreate(&adminRole, model.Role{Name: "Admin"}).Error; err != nil {
		return err
	}

	if err := db.Model(&adminRole).Association("Permissions").Replace(&permissions); err != nil {
		return err
	}

	hashedPassword, err := utils.HashPassword("123456")
	if err != nil {
		return err
	}

	adminUser := model.User{
		Username: "admin",
		Password: hashedPassword,
	}
	if err := db.FirstOrCreate(&adminUser, model.User{Username: "admin"}).Error; err != nil {
		return err
	}

	if err := db.Model(&adminUser).Association("Roles").Replace(&[]model.Role{adminRole}); err != nil {
		return err
	}

	log.Println("✅ RBAC 初始化完成")
	return nil

}
