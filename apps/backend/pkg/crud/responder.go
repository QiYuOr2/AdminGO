package crud

import "github.com/gin-gonic/gin"

type Responder interface {
	CRUDSuccess(c *gin.Context, statusCode int, data any)
	CRUDError(c *gin.Context, statusCode int, message string)
	CRUDNotFound(c *gin.Context, message string)
}
