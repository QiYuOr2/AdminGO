package ecode

import "fmt"

type Error struct {
	Code    Code
	Message string
}

func (e *Error) Error() string {
	return fmt.Sprintf("code=%d, msg=%s", e.Code, e.Message)
}

func New(code Code, message string) *Error {
	return &Error{
		Code:    code,
		Message: message,
	}
}

// 判断是否为 ecode.Error
func FromError(err error) (*Error, bool) {
	e, ok := err.(*Error)
	return e, ok
}
