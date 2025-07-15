package crud

type Service[T any] struct {
	Repo Repository[T]
}

func NewService[T any](repo Repository[T]) *Service[T] {
	return &Service[T]{Repo: repo}
}

func (s *Service[T]) Create(entity *T) error {
	return s.Repo.Create(entity)
}

func (s *Service[T]) GetByID(id uint) (*T, error) {
	return s.Repo.GetByID(id)
}

func (s *Service[T]) Update(entity *T) error {
	return s.Repo.Update(entity)
}

func (s *Service[T]) Delete(id uint) error {
	return s.Repo.Delete(id)
}

func (s *Service[T]) List(offset, limit int) ([]*T, error) {
	return s.Repo.List(offset, limit)
}
