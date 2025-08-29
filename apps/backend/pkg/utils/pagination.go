package utils

import (
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetPagination(c *gin.Context) (page int, size int) {
	page, pageErr := strconv.Atoi(c.DefaultQuery("page", "1"))
	if pageErr != nil || page < 1 {
		page = 1
	}

	size, sizeErr := strconv.Atoi(c.DefaultQuery("size", "10"))
	if sizeErr != nil || size < 1 {
		size = 10
	}

	return
}
