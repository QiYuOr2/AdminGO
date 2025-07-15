package repository

import (
	"admingo/internal/modules/rbac/model"
	"admingo/pkg/crud"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserRepository interface {
	crud.Repository[model.User]
	VerifyUser(username, password string) (*model.User, error)
	GetUserRoles(userID uint) ([]model.Role, error)
}

type userRepository struct {
	crud.Repository[model.User]
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{
		Repository: crud.NewRepository[model.User](db),
	}
}

func (r *userRepository) VerifyUser(username, password string) (*model.User, error) {
	var user model.User
	if err := r.GetDB().Where("username = ?", username).First(&user).Error; err != nil {
		return nil, err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *userRepository) GetUserRoles(userID uint) ([]model.Role, error) {
	var user model.User
	err := r.GetDB().Preload("Roles").First(&user, userID).Error
	if err != nil {
		return nil, err
	}
	return user.Roles, nil
}
