package model

import (
	"gorm.io/gorm"
)

type Account struct {
	gorm.Model

	UserID   uint   `gorm:"not null;index"`                         // 外键（归属用户）
	Type     string `gorm:"type:varchar(50);not null"`              // 账号类型（github/google/qq/email/phone）
	Identity string `gorm:"uniqueIndex:idx_type_identity;not null"` // 账号唯一标识（如 openid / 邮箱 / 手机号）
	Secret   string `gorm:""`                                       // 可存 OAuth token / 密码（如有）
}
