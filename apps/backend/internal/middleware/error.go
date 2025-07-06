package middleware

import (
	"admingo/internal/pkg/ecode"
	"admingo/internal/pkg/response"

	"github.com/gin-gonic/gin"
)

func Error() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		err := c.Errors.Last()
		if err == nil {
			return
		}

		if e, ok := ecode.FromError(err); ok {
			response.Error(c, e)
			c.Abort()
			return
		}

		response.ErrorWithMessage(c, "未知错误")
		c.Abort()
	}
}
