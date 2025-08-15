package handler

import (
	"admingo/internal/modules/menu/dto"
	"admingo/internal/modules/menu/model"
	"admingo/internal/modules/menu/service"
	"admingo/internal/pkg/response"
	"admingo/pkg/crud"
	"strconv"

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

// @Summary		根据用户ID获取菜单
// @Description	根据用户ID获取菜单列表
// @Tags			menu
// @Accept			json
// @Produce		json
// @Security		ApiKeyAuth
// @Param			userID	path	int	true	"User ID"
// @Success		200		{object}	response.Response[[]dto.MenuDTO]
// @Router			/api/sys/menu/findByUser [get]
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

	dtos := dto.FromModelListToDTOList(menus)

	h.responder.Success(c, dtos)
}

func (h *MenuHandler) CreateMenu(c *gin.Context) {
	var menuDTO dto.MenuDTO
	if err := c.ShouldBindJSON(&menuDTO); err != nil {
		h.responder.ErrorWithMessage(c, "Invalid request body")
		return
	}

	menu := dto.FromDTOToModel(menuDTO)
	if err := h.service.CreateMenu(&menu); err != nil {
		h.responder.ErrorWithMessage(c, err.Error())
		return
	}

	h.responder.Success(c, menu)
}

func (h *MenuHandler) UpdateMenu(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		h.responder.ErrorWithMessage(c, "Invalid ID")
		return
	}

	var menuDTO dto.MenuDTO
	if err := c.ShouldBindJSON(&menuDTO); err != nil {
		h.responder.ErrorWithMessage(c, "Invalid request body")
		return
	}

	menu := dto.FromDTOToModel(menuDTO)
	if err := h.service.UpdateMenu(uint(id), &menu); err != nil {
		h.responder.ErrorWithMessage(c, "Failed to update menu")
		return
	}

	h.responder.Success(c, menu)
}

func (h *MenuHandler) DeleteMenu(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		h.responder.ErrorWithMessage(c, "Invalid ID")
		return
	}

	if err := h.service.DeleteMenu(uint(id)); err != nil {
		h.responder.ErrorWithMessage(c, "Failed to delete menu")
		return
	}

	h.responder.Success(c, gin.H{"message": "Menu deleted successfully"})
}
