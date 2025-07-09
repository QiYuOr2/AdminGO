package crud

import (
	"gorm.io/gorm"
)

type Service[T any] struct {
	DB *gorm.DB
}

func NewService[T any](db *gorm.DB) *Service[T] {
	return &Service[T]{DB: db}
}

func (s *Service[T]) Create(entity *T) error {
	return s.DB.Create(entity).Error
}

func (s *Service[T]) GetByID(id uint) (*T, error) {
	var entity T
	if err := s.DB.First(&entity, id).Error; err != nil {
		return nil, err
	}
	return &entity, nil
}

func (s *Service[T]) Update(entity *T) error {
	return s.DB.Save(entity).Error
}

func (s *Service[T]) Delete(id uint) error {
	var entity T
	return s.DB.Delete(&entity, id).Error
}

func (s *Service[T]) List() ([]T, error) {
	var entities []T
	if err := s.DB.Find(&entities).Error; err != nil {
		return nil, err
	}
	return entities, nil
}