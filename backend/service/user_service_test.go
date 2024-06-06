package service

import (
	"fmt"
	"testing"
	"time"

	"github.com/roshanlc/todos_assignment/backend/mocks"
	"github.com/roshanlc/todos_assignment/backend/model"
	"github.com/stretchr/testify/assert"
)

func TestCreateUser(t *testing.T) {
	mockRepository := new(mocks.IRepository)
	service := NewService(mockRepository)

	t.Run("Success", func(t *testing.T) {
		// mock response after user creation
		mockUser := &model.User{
			ID:        1,
			Name:      "Ram Sharma",
			Email:     "ram.sharma@email.com",
			Password:  "password",
			CreatedAt: time.Now(),
		}

		mockRepository.On("FindUserByEmail", mockUser.Email).Return(nil, model.ErrRecordNotFound)
		mockRepository.On("InsertUser", *mockUser).Return(mockUser, nil)

		user, err := service.CreateUser(mockUser)
		assert.NoError(t, err)
		assert.Equal(t, user, mockUser)
		mockRepository.AssertExpectations(t)
	})
	t.Run("Error", func(t *testing.T) {
		// mock response after user creation
		mockUser := &model.User{
			ID:        1,
			Name:      "Ram Sharma",
			Email:     "ram.sharma@email.com",
			Password:  "password",
			CreatedAt: time.Now(),
		}
		mockRepository.On("FindUserByEmail", mockUser.Email).Return(mockUser, nil)
		mockRepository.On("InsertUser", *mockUser).Return(nil, model.ErrDuplicateEmail)

		user, err := service.CreateUser(mockUser)
		assert.Equal(t, model.ErrDuplicateEmail, err)
		assert.Equal(t, (*model.User)(nil), user)
		mockRepository.AssertExpectations(t)
	})
}

func TestGetUserByEmail(t *testing.T) {
	mockRepository := new(mocks.IRepository)
	service := NewService(mockRepository)

	t.Run("Success", func(t *testing.T) {
		mockUser := &model.User{
			ID:        1,
			Name:      "Ram Sharma",
			Email:     "ram.sharma@email.com",
			Password:  "password",
			CreatedAt: time.Now(),
		}
		mockRepository.On("FindUserByEmail", mockUser.Email).Return(mockUser, nil)
		user, err := service.GetUserByEmail(mockUser.Email)
		assert.NoError(t, err)
		assert.Equal(t, mockUser, user)
		mockRepository.AssertExpectations(t)
	})

	t.Run("Error_RecordNotFound", func(t *testing.T) {
		email := "ram.sharma1@email.com"
		mockRepository.On("FindUserByEmail", email).Return(nil, model.ErrRecordNotFound)
		user, err := service.GetUserByEmail(email)
		assert.Equal(t, model.ErrRecordNotFound, err)
		assert.Equal(t, (*model.User)(nil), user)
		mockRepository.AssertExpectations(t)
	})
	t.Run("Error_InvalidEmail", func(t *testing.T) {
		email := ""
		user, err := service.GetUserByEmail(email)
		assert.Equal(t, fmt.Errorf("email is required"), err)
		assert.Equal(t, (*model.User)(nil), user)
		mockRepository.AssertExpectations(t)
	})
}

func TestGetUserByID(t *testing.T) {
	mockRepository := new(mocks.IRepository)
	service := NewService(mockRepository)

	t.Run("Success", func(t *testing.T) {
		mockUser := &model.User{
			ID:        1,
			Name:      "Ram Sharma",
			Email:     "ram.sharma@email.com",
			Password:  "password",
			CreatedAt: time.Now(),
		}
		mockRepository.On("FindUserByID", mockUser.ID).Return(mockUser, nil)
		user, err := service.GetUserByID(mockUser.ID)
		assert.NoError(t, err)
		assert.Equal(t, mockUser, user)
		mockRepository.AssertExpectations(t)
	})

	t.Run("Error_RecordNotFound", func(t *testing.T) {
		var userID uint = 2
		mockRepository.On("FindUserByID", userID).Return(nil, model.ErrRecordNotFound)
		user, err := service.GetUserByID(userID)
		assert.Equal(t, model.ErrRecordNotFound, err)
		assert.Equal(t, (*model.User)(nil), user)
		mockRepository.AssertExpectations(t)
	})

	t.Run("Error_InvalidUserID", func(t *testing.T) {
		var userID uint = 0
		user, err := service.GetUserByID(userID)
		assert.Equal(t, model.ErrInvalidUserID, err)
		assert.Equal(t, (*model.User)(nil), user)
		mockRepository.AssertExpectations(t)
	})
}
