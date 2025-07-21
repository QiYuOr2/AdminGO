package handler

import (
	"admingo/internal/modules/auth/dto"
	"admingo/internal/modules/auth/service"
	"admingo/internal/pkg/response"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	authService *service.Service
}

func New(authService *service.Service) *Handler {
	return &Handler{authService: authService}
}

// @Summary		登录
// @Description 验证用户，返回 JWT Token
// @Tags			auth
// @Accept			json
// @Produce		json
// @Param			body	body		dto.LoginDTO	true	"Login credentials"
// @Success		200		{object}	response.Response[dto.LoginResponseDTO]
// @Router			/api/login [post]
func (h *Handler) Login(c *gin.Context) {
	var req dto.LoginDTO
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ErrorWithMessage(c, "参数错误")
		return
	}

	token, err := h.authService.Login(req.Username, req.Password)
	if err != nil {
		response.ErrorWithMessage(c, err.Error())
		return
	}

	response.Success(c, &dto.LoginResponseDTO{Token: token})
}

// @Summary		注册
// @Description	注册新用户并自动的登录
// @Tags			auth
// @Accept			json
// @Produce		json
// @Param			body	body		dto.LoginDTO	true	"User registration data"
// @Success		200		{object}	response.Response[dto.LoginResponseDTO]
// @Router			/api/register [post]
func (h *Handler) Register(c *gin.Context) {
	var req dto.LoginDTO
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ErrorWithMessage(c, "参数错误")
		return
	}

	err := h.authService.Register(req.Username, req.Password)
	if err != nil {
		response.ErrorWithMessage(c, err.Error())
		return
	}

	token, err := h.authService.Login(req.Username, req.Password)
	if err != nil {
		response.ErrorWithMessage(c, err.Error())
		return
	}

	response.Success(c, &dto.LoginResponseDTO{Token: token})
}

// TODO 邮箱注册 / 邮箱登录
func (h *Handler) RegisterWithEmail(c *gin.Context) {
}
