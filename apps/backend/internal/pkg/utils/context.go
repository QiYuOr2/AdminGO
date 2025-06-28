package utils

import "github.com/gin-gonic/gin"

func MaybeGet[T any](c *gin.Context, key string) (T, bool) {
	val, ok := c.Get(key)
	if !ok {
		var zero T
		return zero, false
	}

	typedVal, ok := val.(T)
	return typedVal, ok
}
