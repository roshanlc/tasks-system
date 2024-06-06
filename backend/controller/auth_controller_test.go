package controller

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/roshanlc/todos_assignment/backend/mocks"
	"github.com/roshanlc/todos_assignment/backend/model"
	"github.com/roshanlc/todos_assignment/backend/service"
	"github.com/roshanlc/todos_assignment/backend/utils/auth"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestLoginHandler(t *testing.T) {
	// mocks for repo and service
	mockRepository := new(mocks.IRepository)
	service := service.NewService(mockRepository)
	plainPw := "password"
	hashPw, _ := auth.HashPassword(plainPw)

	server := NewServer("test", service)

	mockUser := &model.User{
		ID:        1,
		Name:      "John Doe",
		Email:     "john.doe@email.com",
		Password:  hashPw,
		CreatedAt: time.Now(),
	}

	mockRepository.On("FindUserByEmail", mockUser.Email).Return(mockUser, nil)

	t.Run("Success", func(t *testing.T) {
		w := httptest.NewRecorder()
		body := fmt.Sprintf(`{"email": "%s", "password": "%s"}`, mockUser.Email, plainPw)
		req, _ := http.NewRequest("POST", "/api/v1/auth/login", strings.NewReader(body))
		server.router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
	})

	t.Run("Error_InvalidCreds", func(t *testing.T) {
		w := httptest.NewRecorder()
		plainPw = "password_wrong"
		body := fmt.Sprintf(`{"email": "%s", "password": "%s"}`, mockUser.Email, plainPw)
		req, _ := http.NewRequest("POST", "/api/v1/auth/login", strings.NewReader(body))
		server.router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusUnauthorized, w.Code)
	})
}

func TestRegistrationHandler(t *testing.T) {
	// mocks for repo and service
	mockRepository := new(mocks.IRepository)
	service := service.NewService(mockRepository)
	plainPw := "password"
	hashPw, _ := auth.HashPassword(plainPw)

	server := NewServer("test", service)

	userReq := &model.UserRequest{
		Name:     "John Doe",
		Email:    "john.doe@email.com",
		Password: plainPw,
	}

	mockUserReq := &model.User{
		Name:     "John Doe",
		Email:    "john.doe@email.com",
		Password: hashPw,
	}
	mockUser := &model.User{
		ID:        1,
		Name:      "John Doe",
		Email:     "john.doe@email.com",
		Password:  "",
		CreatedAt: time.Now(),
	}
	mockRepository.On("FindUserByEmail", userReq.Email).Return(nil, model.ErrRecordNotFound)
	mockRepository.On("InsertUser", mock.Anything).Return(mockUser, nil)

	t.Run("Success", func(t *testing.T) {
		w := httptest.NewRecorder()
		body := fmt.Sprintf(`{"email": "%s","name":"%s", "password": "%s"}`, mockUserReq.Email, mockUserReq.Name, plainPw)

		req, _ := http.NewRequest("POST", "/api/v1/auth/register", strings.NewReader(body))
		server.router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusCreated, w.Code)
	})

	t.Run("Error_InvalidPayload", func(t *testing.T) {
		w := httptest.NewRecorder()
		plainPw = "password_wrong"
		body := fmt.Sprintf(`{"email": "%s", "password": "%s"}`, mockUserReq.Email, plainPw)

		req, _ := http.NewRequest("POST", "/api/v1/auth/register", strings.NewReader(body))
		server.router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusBadRequest, w.Code)
	})
}
