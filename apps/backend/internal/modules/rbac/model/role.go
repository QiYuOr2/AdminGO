package model

import "gorm.io/gorm"

type Role struct {
	gorm.Model
	Name        string       `gorm:"unique;not null"`
	Permissions []Permission `gorm:"many2many:role_permissions;"`
}