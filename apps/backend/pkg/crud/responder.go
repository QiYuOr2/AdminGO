package crud

import "github.com/gin-gonic/gin"

type Responder interface {
	Success(c *gin.Context, statusCode int, data any)
	Error(c *gin.Context, statusCode int, message string)
	NotFound(c *gin.Context, message string)
}
