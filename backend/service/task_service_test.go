//go:build test_all
// +build test_all

package service

import (
	"fmt"
	"testing"
	"time"

	"github.com/roshanlc/todos_assignment/backend/mocks"
	"github.com/roshanlc/todos_assignment/backend/model"
	"github.com/stretchr/testify/assert"
)

func TestCreateTask(t *testing.T) {
	mockRepository := new(mocks.IRepository)
	service := NewService(mockRepository)

	t.Run("Success", func(t *testing.T) {
		// mock response after task creation
		mockTask := &model.Task{
			ID:          1,
			Title:       "title",
			Description: "description",
			Completed:   false,
			CreatedAt:   time.Now(),
			UserID:      1,
		}

		mockRepository.On("InsertTask", *mockTask).Return(mockTask, nil)

		task, err := service.CreateTask(*mockTask)
		assert.NoError(t, err)
		assert.Equal(t, task, mockTask)
		mockRepository.AssertExpectations(t)
	})
}

func TestGetTaskByID(t *testing.T) {
	mockRepository := new(mocks.IRepository)
	service := NewService(mockRepository)

	t.Run("Success", func(t *testing.T) {
		mockTask := &model.Task{
			ID:          1,
			Title:       "title",
			Description: "description",
			Completed:   false,
			CreatedAt:   time.Now(),
			UserID:      1,
		}
		mockRepository.On("FindTaskByID", mockTask.ID).Return(mockTask, nil)
		task, err := service.GetTaskByID(mockTask.ID)
		assert.NoError(t, err)
		assert.Equal(t, task, mockTask)
		mockRepository.AssertExpectations(t)
	})
	t.Run("Error_RecordNotFound", func(t *testing.T) {
		var taskID uint = 2
		mockRepository.On("FindTaskByID", taskID).Return(nil, model.ErrRecordNotFound)
		task, err := service.GetTaskByID(taskID)
		assert.Equal(t, model.ErrRecordNotFound, err)
		assert.Equal(t, (*model.Task)(nil), task)
		mockRepository.AssertExpectations(t)
	})
}

func TestDeleteTaskByID(t *testing.T) {
	mockRepository := new(mocks.IRepository)
	service := NewService(mockRepository)

	t.Run("Success", func(t *testing.T) {
		mockTask := &model.Task{
			ID:          1,
			Title:       "title",
			Description: "description",
			Completed:   false,
			CreatedAt:   time.Now(),
			UserID:      1,
		}
		mockRepository.On("DeleteTaskByID", mockTask.ID).Return(nil)
		err := service.DeleteTaskByID(mockTask.ID)
		assert.NoError(t, err)
		mockRepository.AssertExpectations(t)
	})
	t.Run("Error_RecordNotFound", func(t *testing.T) {
		var taskID uint = 2
		mockRepository.On("DeleteTaskByID", taskID).Return(model.ErrNotUpdated)
		err := service.DeleteTaskByID(taskID)
		assert.Equal(t, model.ErrNotUpdated, err)
		mockRepository.AssertExpectations(t)
	})
	t.Run("Error_InvalidTaskID", func(t *testing.T) {
		var taskID uint = 0
		err := service.DeleteTaskByID(taskID)
		assert.Equal(t, model.ErrInvalidTaskID, err)
		mockRepository.AssertExpectations(t)
	})
}

func TestUpdateTask(t *testing.T) {
	mockRepository := new(mocks.IRepository)
	service := NewService(mockRepository)

	t.Run("Success", func(t *testing.T) {
		mockTask := &model.Task{
			ID:          1,
			Title:       "title",
			Description: "description",
			Completed:   false,
			CreatedAt:   time.Now(),
			UserID:      1,
		}
		mockRepository.On("UpdateTask", *mockTask).Return(mockTask, nil)
		task, err := service.UpdateTask(*mockTask)
		assert.NoError(t, err)
		assert.Equal(t, mockTask, task)
		mockRepository.AssertExpectations(t)
	})
	t.Run("Error_UpdateError", func(t *testing.T) {
		mockTask := &model.Task{
			ID:          2,
			Title:       "title",
			Description: "description",
			Completed:   false,
			CreatedAt:   time.Now(),
			UserID:      2,
		}
		updateErr := fmt.Errorf("unable to update task")
		mockRepository.On("UpdateTask", *mockTask).Return(nil, updateErr)
		task, err := service.UpdateTask(*mockTask)
		assert.Equal(t, updateErr, err)
		assert.Equal(t, (*model.Task)(nil), task)
		mockRepository.AssertExpectations(t)
	})
}
