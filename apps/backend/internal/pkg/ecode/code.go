package ecode

type Code int

const (
	OK Code = 0

	Error_ServerError Code = 10001 // 服务端通用错误

	Error_InvalidCredentials Code = 30001 // 用户名密码错误
	Error_PermissionDenied   Code = 30002 // 权限错误
	Error_TokenGenerateFail  Code = 30003 // TOKEN 生成失败
)
