package service

import (
	"log"

	"github.com/roshanlc/todos_assignment/backend/model"
)

type ITaskService interface {
	GetTaskByIDAndUserID(taskID, userID uint) (*model.Task, error)
	CreateTask(task model.Task) (*model.Task, error)
	GetTaskByID(taskID uint) (*model.Task, error)
	DeleteTaskByID(taskID uint) error
	UpdateTask(task model.Task) (*model.Task, error)
	GetTasksByUserID(userID uint, pagination *model.PaginationRequest) ([]model.Task, *model.PaginationResponse, error)
	SearchTasksByUserID(userID uint, search string, pagination *model.PaginationRequest) ([]model.Task, *model.PaginationResponse, error)
}

// CreateTask creates a new task.
func (s *Service) CreateTask(task model.Task) (*model.Task, error) {
	newTask, err := s.repository.InsertTask(task)
	if err != nil {
		log.Println("CreateTask :: error inserting task: ", err)
		return nil, err
	}
	return newTask, nil
}

// GetTaskByID fetches a task by ID.
func (s *Service) GetTaskByID(taskID uint) (*model.Task, error) {
	if taskID == 0 {
		return nil, model.ErrInvalidTaskID
	}
	return s.repository.FindTaskByID(taskID)
}

// DeleteTaskByID deletes a task by ID.
func (s *Service) DeleteTaskByID(taskID uint) error {
	if taskID == 0 {
		return model.ErrInvalidTaskID
	}
	return s.repository.DeleteTaskByID(taskID)
}

// UpdateTask updates a task.
func (s *Service) UpdateTask(task model.Task) (*model.Task, error) {
	updatedTask, err := s.repository.UpdateTask(task)
	if err != nil {
		log.Println("UpdateTask :: error updating task: ", err)
		return nil, err
	}
	return updatedTask, nil
}

// GetTasksByUserID fetches all tasks for a user.
func (s *Service) GetTasksByUserID(userID uint, pagination *model.PaginationRequest) ([]model.Task, *model.PaginationResponse, error) {
	if userID == 0 {
		return nil, nil, model.ErrInvalidUserID
	}
	return s.repository.FindTasksByUserID(userID, pagination)
}

// SearchTasksByUserID searches tasks for a user.
func (s *Service) SearchTasksByUserID(userID uint, search string, pagination *model.PaginationRequest) ([]model.Task, *model.PaginationResponse, error) {
	if userID == 0 {
		return nil, nil, model.ErrInvalidUserID
	}
	return s.repository.SearchTasksByUserID(userID, search, pagination)
}

// GetTaskByIDAndUserID fetches a task by ID and user ID
func (s *Service) GetTaskByIDAndUserID(taskID, userID uint) (*model.Task, error) {
	if taskID == 0 {
		return nil, model.ErrInvalidTaskID
	}
	return s.repository.FindTaskByIDAndUserID(taskID, userID)
}
