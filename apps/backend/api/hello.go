package api

import (
	"admingo/internal/pkg/response"
	"admingo/internal/pkg/utils"

	"github.com/gin-gonic/gin"
	"github.com/nicksnyder/go-i18n/v2/i18n"
)

func Hello(c *gin.Context) {
	localizer, ok := utils.MaybeGet[*i18n.Localizer](c, "localizer")
	if !ok {
		response.ErrorWithMessage(c, "Error getting localizer")
		return
	}

	helloMessage, err := localizer.Localize(&i18n.LocalizeConfig{
		MessageID: "hello",
	})
	if err != nil {
		response.ErrorWithMessage(c, "Error localizing message")
		return
	}
	response.Success(c, helloMessage)
}