package response

const (
	SUCCESS     = 0
	ERROR       = 1000
	LOGIN_ERROR = 1001
)

var messages = map[int]string{
	SUCCESS:     "response.success",
	ERROR:       "response.error",
	LOGIN_ERROR: "response.login_error",
}

func GetMessage(code int) string {
	if msg, ok := messages[code]; ok {
		return msg
	}
	return "Unknown error"
}
