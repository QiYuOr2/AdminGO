package response

import (
	"admingo/internal/pkg/ecode"

	"github.com/gin-gonic/gin"
)

type ProjectResponder struct{}

func NewProjectResponder() *ProjectResponder {
	return &ProjectResponder{}
}

func (r *ProjectResponder) Success(c *gin.Context, statusCode int, data any) {
	Success(c, data)
}

func (r *ProjectResponder) Error(c *gin.Context, statusCode int, message string) {
	ErrorWithMessage(c, message)
}

func (r *ProjectResponder) NotFound(c *gin.Context, message string) {
	Error(c, &ecode.Error{
		Code:    ecode.Error_NotFound,
		Message: "Not Found",
	})
}
