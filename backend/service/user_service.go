package service

import (
	"fmt"
	"log"
	"strings"

	"github.com/roshanlc/todos_assignment/backend/model"
)

type IUserService interface {
	CreateUser(user *model.User) (*model.User, error)
	GetUserByEmail(email string) (*model.User, error)
	GetUserByID(userID uint) (*model.User, error)
}

// CreateUser creates a new user.
// It returns the created user and an error if something went wrong.
func (s *Service) CreateUser(user *model.User) (*model.User, error) {
	// check if user by given email already exists
	_, err := s.GetUserByEmail(user.Email)
	if err == nil {
		return nil, model.ErrDuplicateEmail
	}
	// if the error is not record not found, return the error
	if err != model.ErrRecordNotFound {
		log.Println("CreateUser :: error fetching user by email: ", err)
		return nil, err
	}

	user, err = s.repository.InsertUser(*user)
	if err != nil {
		log.Println("CreateUser :: error inserting user: ", err)
		return nil, err
	}
	return user, nil
}

// GetUserByEmail fetches a user by email.
func (s *Service) GetUserByEmail(email string) (*model.User, error) {
	if strings.TrimSpace(email) == "" {
		return nil, fmt.Errorf("email is required")
	}
	return s.repository.FindUserByEmail(email)
}

// GetUserByID fetches a user by ID.
func (s *Service) GetUserByID(userID uint) (*model.User, error) {
	if userID == 0 {
		return nil, model.ErrInvalidUserID
	}
	return s.repository.FindUserByID(userID)
}
