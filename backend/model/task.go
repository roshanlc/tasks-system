package model

import (
	"fmt"
	"strings"
	"time"
)

// Task is the model for the task entity
type Task struct {
	ID          uint      `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Completed   bool      `json:"completed"`
	CreatedAt   time.Time `json:"created_at"`
	UserID      uint      `json:"user_id"` // foreign key to user table
}

// NewTaskRequest is the model for the task request payload when creating a task
type NewTaskRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

// UpdateTaskRequest is the model for the task request payload when updating a task
type UpdateTaskRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Completed   bool   `json:"completed"`
}

// Validate validates the NewTaskRequest payload
func (t *NewTaskRequest) Validate() error {
	if strings.TrimSpace(t.Title) == "" {
		return fmt.Errorf("title is required")
	}
	if strings.TrimSpace(t.Description) == "" {
		return fmt.Errorf("description is required")
	}
	return nil
}

// toTask converts the NewTaskRequest to a Task
func (t *NewTaskRequest) ToTask(userID uint) *Task {
	return &Task{
		Title:       t.Title,
		Description: t.Description,
		Completed:   false,
		UserID:      userID,
	}
}

func (t *UpdateTaskRequest) ToTask(taskID, userID uint) *Task {
	return &Task{
		ID:          taskID,
		Title:       t.Title,
		Description: t.Description,
		Completed:   t.Completed,
		UserID:      userID,
	}
}

func (t *UpdateTaskRequest) Validate() error {
	if strings.TrimSpace(t.Title) == "" {
		return fmt.Errorf("title is required")
	}
	if strings.TrimSpace(t.Description) == "" {
		return fmt.Errorf("description is required")
	}
	return nil
}
