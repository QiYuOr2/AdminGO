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

	response.Success(c, gin.H{"token": token})
}

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

	response.Success(c, gin.H{"token": token})
}
