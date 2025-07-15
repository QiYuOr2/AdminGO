package response

import (
	"admingo/internal/pkg/ecode"

	"github.com/gin-gonic/gin"
)

type Responder struct{}

func NewAGOResponder() *Responder {
	return &Responder{}
}

func (r *Responder) Success(c *gin.Context, statusCode int, data any) {
	Success(c, data)
}

func (r *Responder) Error(c *gin.Context, statusCode int, message string) {
	ErrorWithMessage(c, message)
}

func (r *Responder) NotFound(c *gin.Context, message string) {
	Error(c, &ecode.Error{
		Code:    ecode.Error_NotFound,
		Message: "Not Found",
	})
}
