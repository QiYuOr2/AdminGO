package response

import (
	"admingo/internal/pkg/ecode"
	"admingo/internal/pkg/utils"
	"net/http"

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
			DefaultMessage: &i18n.Message{
				ID:    message,
				Other: message, // fallback
			},
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

// Success 成功响应
func Success[T any](c *gin.Context, data T) {
	Result(c, int(ecode.OK), "response.success", data)
}

// Error 处理 ecode.Error 类型的错误
func Error(c *gin.Context, err error) {
	if e, ok := ecode.FromError(err); ok {
		Result[any](c, int(e.Code), e.Message, nil)
	} else {
		// fallback
		Result[any](c, int(ecode.Error_ServerError), "response.error", nil)
	}
}

// ErrorWithMessage 返回自定义错误消息（不带错误码）
func ErrorWithMessage(c *gin.Context, message string) {
	Result[any](c, int(ecode.Error_ServerError), message, nil)
}
