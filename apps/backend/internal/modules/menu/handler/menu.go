package handler

import (
	"admingo/internal/modules/menu/model"
	"admingo/internal/modules/menu/service"
	"admingo/pkg/crud"
)

type MenuHandler struct {
	*crud.Handler[model.Menu]
}

func New(service *service.MenuService, responder crud.Responder) *MenuHandler {
	return &MenuHandler{
		Handler: crud.NewHandler(service.CRUD(), responder),
	}
}
