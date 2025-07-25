package container

import (
	"admingo/internal/modules/jwt"

	"gorm.io/gorm"
)

type ServiceContainer struct {
	DB  *gorm.DB
	JWT *jwt.JWT
}

func New(db *gorm.DB, jwt *jwt.JWT) *ServiceContainer {
	return &ServiceContainer{
		DB:  db,
		JWT: jwt,
	}
}
