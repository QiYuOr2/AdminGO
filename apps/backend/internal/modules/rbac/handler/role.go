package handler

import (
	"admingo/internal/modules/rbac/model"
	"admingo/internal/modules/rbac/service"
	"admingo/internal/pkg/response"
	"admingo/pkg/crud"
	"admingo/pkg/utils"

	"github.com/gin-gonic/gin"
)

type RoleHandler struct {
	*crud.Handler[model.Role]
	service   *service.RoleService
	responder *response.Responder
}

func NewRoleHandler(service *service.RoleService, responder *response.Responder) *RoleHandler {
	return &RoleHandler{
		Handler:   crud.NewHandler(service.CRUD(), responder),
		service:   service,
		responder: responder,
	}
}

// @Summary		获取角色列表（包含权限）
// @Description	分页获取角色及其权限
// @Tags			角色管理
// @Accept			json
// @Produce		json
// @Param			page	query		int										false	"页码 (默认 1)"
// @Param			size	query		int										false	"每页数量 (默认 10)"
// @Success		200		{object}	response.Response[dto.RoleListDTO]	"成功返回角色列表"
// @Router			/api/sys/menu/roles [get]
func (h *RoleHandler) List(c *gin.Context) {
	page, size := utils.GetPagination(c)
	offset := (page - 1) * size
	limit := size

	roles, err := h.service.FindRoleAndPermissions(offset, limit)
	if err != nil {
		h.responder.ErrorWithMessage(c, err.Error())
		return
	}

	h.responder.Success(c, roles)
}
