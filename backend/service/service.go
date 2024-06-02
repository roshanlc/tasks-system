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

	// Task related
	GetTaskByIDAndUserID(taskID, userID uint) (*model.Task, error)
	CreateTask(task model.Task) (*model.Task, error)
	GetTaskByID(taskID uint) (*model.Task, error)
	DeleteTaskByID(taskID uint) error
	UpdateTask(task model.Task) (*model.Task, error)
	GetTasksByUserID(userID uint, pagination *model.PaginationRequest) ([]model.Task, *model.PaginationResponse, error)
	SearchTasksByUserID(userID uint, search string, pagination *model.PaginationRequest) ([]model.Task, *model.PaginationResponse, error)
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
