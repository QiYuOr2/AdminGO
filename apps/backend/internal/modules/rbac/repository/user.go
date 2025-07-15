package repository

import (
	"admingo/internal/modules/rbac/model"
	"admingo/internal/pkg/utils"
	"admingo/pkg/crud"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserRepository struct {
	crud.Repository[model.User]
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{
		Repository: crud.NewRepository[model.User](db),
	}
}

func (r *UserRepository) CreateUser(username, password string) (*model.User, error) {
	hashedPassword, err := utils.HashPassword(password)

	if err != nil {
		return nil, err
	}

	user := &model.User{
		Username: username,
		Password: hashedPassword,
	}

	if err := r.GetDB().Create(user).Error; err != nil {
		return nil, err
	}

	return user, nil
}

func (r *UserRepository) VerifyUser(username, password string) (*model.User, error) {
	var user model.User
	if err := r.GetDB().Where("username = ?", username).First(&user).Error; err != nil {
		return nil, err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *UserRepository) GetUserRoles(userID uint) ([]model.Role, error) {
	var user model.User
	err := r.GetDB().Preload("Roles").First(&user, userID).Error
	if err != nil {
		return nil, err
	}
	return user.Roles, nil
}
