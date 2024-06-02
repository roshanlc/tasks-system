package service

import (
	"github.com/roshanlc/todos_assignment/backend/model"
	"github.com/roshanlc/todos_assignment/backend/repository"
)

// Service is the interface for the service layer
type IService interface {
	// User related
	CreateUser(user *model.User) (*model.User, error)
	GetUserByEmail(email string) (*model.User, error)
	GetUserByID(userID uint) (*model.User, error)
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
