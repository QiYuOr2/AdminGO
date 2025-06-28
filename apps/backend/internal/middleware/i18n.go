package middleware

import (
	"admingo/internal/i18n"

	"github.com/gin-gonic/gin"
)

func I18n() gin.HandlerFunc {
	return func(c *gin.Context) {
		accpet := c.GetHeader("Accept-Language")

		if accpet == "" {
			accpet = "en"
		}

		localizer := i18n.GetLocalizer(accpet)
		c.Set("localizer", localizer)
		c.Next()
	}
}
