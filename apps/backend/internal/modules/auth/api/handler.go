package api

import (
	"admingo/internal/modules/auth/dto"
	"admingo/internal/modules/auth/service"
	"admingo/internal/pkg/response"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	authService *service.AuthService
}

func NewAuthHandler(authService *service.AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

func (h *AuthHandler) Login(c *gin.Context) {
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
