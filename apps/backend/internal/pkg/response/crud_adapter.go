package response

import (
	"admingo/internal/pkg/ecode"
	crud "admingo/pkg/crud"

	"github.com/gin-gonic/gin"
)

type Responder struct {
	crud.Responder
}

func NewAGOResponder() *Responder {
	return &Responder{}
}

func (r *Responder) CRUDSuccess(c *gin.Context, statusCode int, data any) {
	Success(c, data)
}

func (r *Responder) CRUDError(c *gin.Context, statusCode int, message string) {
	ErrorWithMessage(c, message)
}

func (r *Responder) CRUDNotFound(c *gin.Context, message string) {
	Error(c, &ecode.Error{
		Code:    ecode.Error_NotFound,
		Message: "Not Found",
	})
}

func (r *Responder) Success(c *gin.Context, data any) {
	Success(c, data)
}

func (r *Responder) ErrorWithMessage(c *gin.Context, message string) {
	ErrorWithMessage(c, message)
}
