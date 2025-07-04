package auth

import (
	"admingo/internal/modules/auth/api"
	"admingo/internal/modules/auth/service"
)

type Handler = api.Handler

func NewHandler() *Handler {
	return api.New(&service.Service{})
}
