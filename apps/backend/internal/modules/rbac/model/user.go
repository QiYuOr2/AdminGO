package model

import (
	authModel "admingo/internal/modules/auth/model"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username string `gorm:"unique;not null"`
	Password string `gorm:"not null"`
	Roles    []Role `gorm:"many2many:user_roles;"`

	Accounts []authModel.Account `gorm:"foreignKey:UserID"`
}
