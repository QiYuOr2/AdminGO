package model

import "gorm.io/gorm"

type Permission struct {
	gorm.Model
	// 资源路径，可以表示后端的资源 `api/user/add` 以及 前端的路由 `admin/user`
	Path string `gorm:"not null"`
	// 权限标识符，`模块:功能:操作` 例如 `sys:user:edit`, `sys:user:view`。
	// 当结尾为 view 时，表示前端权限
	Code string `gorm:"not null"`
}
