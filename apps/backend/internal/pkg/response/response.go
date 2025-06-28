package response

import (
	"net/http"

	"admingo/internal/pkg/utils"

	"github.com/gin-gonic/gin"
	"github.com/nicksnyder/go-i18n/v2/i18n"
)

type Response[T any] struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    T      `json:"data,omitempty"`
}

func Result[T any](c *gin.Context, code int, message string, data T) {
	localizer, ok := utils.MaybeGet[*i18n.Localizer](c, "localizer")

	if ok {
		localMessage, err := localizer.Localize(&i18n.LocalizeConfig{
			MessageID: message,
		})

		if err == nil {
			message = localMessage
		}
	}

	c.JSON(http.StatusOK, Response[T]{
		Code:    code,
		Message: message,
		Data:    data,
	})
}

func Success[T any](c *gin.Context, data T) {
	Result(c, SUCCESS, GetMessage(SUCCESS), data)
}

func Error(c *gin.Context, code int) {
	Result[any](c, code, GetMessage(code), nil)
}

func ErrorWithMessage(c *gin.Context, message string) {
	Result[any](c, ERROR, message, nil)
}
