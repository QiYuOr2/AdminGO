package model

import "gorm.io/gorm"

type Menu struct {
	gorm.Model
	Title          string `gorm:"type:varchar(64);not null;comment:菜单名称"`
	Path           string `gorm:"type:varchar(255);not null;unique;comment:前端路由路径"`
	Icon           string `gorm:"type:varchar(255);comment:图标"`
	ParentID       *uint  `gorm:"index;comment:父级菜单ID"`
	Sort           int    `gorm:"default:0;comment:排序"`
	Hidden         bool   `gorm:"default:false;comment:是否隐藏菜单"`
	PermissionCode string `gorm:"type:varchar(255);comment:权限标识符"`
	ExternalLink   bool   `gorm:"default:false;comment:是否外链"`
	KeepAlive      bool   `gorm:"default:true;comment:是否缓存页面"`
}
