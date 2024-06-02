package service

import "github.com/roshanlc/todos_assignment/backend/repository"

// Service is the interface for the service layer
type IService interface {
}

// Service is the implementation of the service layer
type Service struct {
	repository repository.IRepository
}

// NewService creates a new service
func NewService(repo repository.IRepository) *Service {
	return &Service{
		repository: repo,
	}
}
