package menu

import (
	"admingo/internal/modules/menu/handler"
	"admingo/internal/modules/menu/model"
	"admingo/internal/modules/menu/repository"
	"admingo/internal/modules/menu/service"
	"admingo/pkg/crud"

	"gorm.io/gorm"
)

type Handler = handler.MenuHandler
type Service = service.MenuService
type Repository = repository.MenuRepository

func NewMenuRepository(db *gorm.DB) *Repository {
	return repository.New(db)
}

func NewMenuService(repo *Repository) *Service {
	return service.New(repo)
}

func NewMenuHandler(service *Service, responder crud.Responder) *Handler {
	return handler.New(service, responder)
}

func AutoMigrate(db *gorm.DB) {
	db.AutoMigrate(&model.Menu{})
}

func Init(db *gorm.DB) error {

}
