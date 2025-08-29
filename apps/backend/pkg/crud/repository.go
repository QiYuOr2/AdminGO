package crud

import (
	"gorm.io/gorm"
)

type Repository[T any] interface {
	GetDB() *gorm.DB
	Create(entity *T) error
	GetByID(id uint) (*T, error)
	Update(entity *T) error
	Delete(id uint) error
	List(offset, limit int) ([]T, error)
}

type repository[T any] struct {
	db *gorm.DB
}

func NewRepository[T any](db *gorm.DB) Repository[T] {
	return &repository[T]{db: db}
}

func (r *repository[T]) GetDB() *gorm.DB {
	return r.db
}

func (r *repository[T]) Create(entity *T) error {
	return r.db.Create(entity).Error
}

func (r *repository[T]) GetByID(id uint) (*T, error) {
	var entity T
	if err := r.db.First(&entity, id).Error; err != nil {
		return nil, err
	}
	return &entity, nil
}

func (r *repository[T]) Update(entity *T) error {
	return r.db.Save(entity).Error
}

func (r *repository[T]) Delete(id uint) error {
	var entity T
	return r.db.Delete(&entity, id).Error
}

func (r *repository[T]) List(offset, limit int) ([]T, error) {
	var entities []T
	if err := r.db.Offset(offset).Limit(limit).Find(&entities).Error; err != nil {
		return nil, err
	}
	return entities, nil
}
