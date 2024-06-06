package controller

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/roshanlc/todos_assignment/backend/mocks"
	"github.com/roshanlc/todos_assignment/backend/model"
	"github.com/roshanlc/todos_assignment/backend/service"
	"github.com/roshanlc/todos_assignment/backend/utils/auth"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestGetTaskHandler(t *testing.T) {
	// mocks for repo and service
	mockRepository := new(mocks.IRepository)
	service := service.NewService(mockRepository)

	server := NewServer("test", service)

	mockUser := &model.User{
		ID:        1,
		Name:      "John Doe",
		Email:     "john.doe@email.com",
		Password:  "",
		CreatedAt: time.Now(),
	}

	mockRepository.On("FindUserByID", mockUser.ID).Return(mockUser, nil)
	token, _ := auth.GenerateJWT(mockUser.ID, mockUser.Email)

	mockTask := &model.Task{
		ID:          1,
		Title:       "Title",
		Description: "Description",
		Completed:   false,
		CreatedAt:   time.Now(),
		UserID:      1,
	}

	var otherTaskID uint = 100
	mockRepository.On("FindTaskByIDAndUserID", mockTask.ID, mockTask.UserID).Return(mockTask, nil)
	mockRepository.On("FindTaskByIDAndUserID", otherTaskID, mockTask.UserID).Return(nil, model.ErrRecordNotFound)

	t.Run("Success", func(t *testing.T) {
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", fmt.Sprintf("/api/v1/tasks/%d", mockTask.ID), nil)
		req.Header.Set("Authorization", "Bearer "+token)
		server.router.ServeHTTP(w, req)

		var resp SuccessResponse
		var respTask model.Task
		json.Unmarshal(w.Body.Bytes(), &resp)
		temp, _ := json.Marshal(resp.Data)
		json.Unmarshal(temp, &respTask)

		assert.Equal(t, mockTask.ID, respTask.ID)
		assert.Equal(t, mockTask.Title, respTask.Title)
		assert.Equal(t, mockTask.Description, respTask.Description)
		assert.Equal(t, mockTask.Completed, respTask.Completed)

		assert.Equal(t, http.StatusOK, w.Code)

	})

	t.Run("Error_NotFound", func(t *testing.T) {
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", fmt.Sprintf("/api/v1/tasks/%d", otherTaskID), nil)
		req.Header.Set("Authorization", "Bearer "+token)
		server.router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusNotFound, w.Code)
	})
}

func TestListTaskHandler(t *testing.T) {
	// mocks for repo and service
	mockRepository := new(mocks.IRepository)
	service := service.NewService(mockRepository)

	server := NewServer("test", service)

	mockUser := &model.User{
		ID:        1,
		Name:      "John Doe",
		Email:     "john.doe@email.com",
		Password:  "",
		CreatedAt: time.Now(),
	}
	pagResp := &model.PaginationResponse{
		Page:       1,
		Size:       5,
		Sort:       "asc",
		TotalPages: 1,
		Total:      1,
	}

	mockRepository.On("FindUserByID", mockUser.ID).Return(mockUser, nil)
	token, _ := auth.GenerateJWT(mockUser.ID, mockUser.Email)

	mockTask := []model.Task{{
		ID:          1,
		Title:       "Title",
		Description: "Description",
		Completed:   false,
		CreatedAt:   time.Now(),
		UserID:      1,
	}}

	mockRepository.On("FindTasksByUserID", mockUser.ID, mock.Anything).Return(mockTask, pagResp, nil)

	t.Run("Success", func(t *testing.T) {
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/api/v1/tasks", nil)
		req.Header.Set("Authorization", "Bearer "+token)
		server.router.ServeHTTP(w, req)
		assert.Equal(t, http.StatusOK, w.Code)

	})
}
