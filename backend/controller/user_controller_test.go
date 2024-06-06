package controller

import (
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
)

func TestGetUserHandler(t *testing.T) {
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
	t.Run("Success", func(t *testing.T) {
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", fmt.Sprintf("/api/v1/users/%d", mockUser.ID), nil)
		req.Header.Set("Authorization", "Bearer "+token)
		server.router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
	})

	t.Run("Error_UnAuthorized", func(t *testing.T) {
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/api/v1/users/100", nil)
		req.Header.Set("Authorization", "Bearer "+token)
		server.router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusForbidden, w.Code)
	})
}
