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

// TaskRequest is the model for the task request payload when creating a task
type TaskRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

// Validate validates the TaskRequest payload
func (t *TaskRequest) Validate() error {
	if strings.TrimSpace(t.Title) == "" {
		return fmt.Errorf("title is required")
	}
	if strings.TrimSpace(t.Description) == "" {
		return fmt.Errorf("description is required")
	}
	return nil
}

// toTask converts the TaskRequest to a Task
func (t *TaskRequest) ToTask(userID uint) *Task {
	return &Task{
		Title:       t.Title,
		Description: t.Description,
		Completed:   false,
		UserID:      userID,
	}
}
