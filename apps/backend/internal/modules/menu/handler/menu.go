package handler

import (
	"admingo/internal/modules/menu/model"
	"admingo/internal/modules/menu/service"
	"admingo/internal/pkg/response"
	"admingo/pkg/crud"

	"github.com/gin-gonic/gin"
)

type MenuHandler struct {
	*crud.Handler[model.Menu]
	service   *service.MenuService
	responder *response.Responder
}

func New(service *service.MenuService, responder *response.Responder) *MenuHandler {
	return &MenuHandler{
		Handler:   crud.NewHandler(service.CRUD(), responder),
		service:   service,
		responder: responder,
	}
}

func (h *MenuHandler) FindByUserID(c *gin.Context) {
	userID, exists := c.Get("userId")
	if !exists {
		h.responder.ErrorWithMessage(c, "user not authenticated")
		return
	}

	menus, err := h.service.FindByUserID(userID.(uint))
	if err != nil {
		h.responder.ErrorWithMessage(c, err.Error())
		return
	}

	h.responder.Success(c, menus)
}
