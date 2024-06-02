package model

import "strings"

// User is the model for the user entity
type User struct {
	ID       uint   `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

// UserRequest is the model for the user request payload when creating a user
type UserRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Validate validates the UserRequest payload
func (u *UserRequest) Validate() error {
	if u.Name == "" {
		return ErrNameIsRequired
	}
	if u.Email == "" {
		return ErrEmailIsRequired
	}
	if strings.TrimSpace(u.Password) == "" {
		return ErrPasswordIsRequired
	}
	if len(strings.TrimSpace(u.Password)) < 6 {
		return ErrPasswordLength
	}
	return nil
}

// toUser converts the UserRequest to a User
func (u *UserRequest) toUser() *User {
	return &User{
		ID:       0,
		Name:     u.Name,
		Email:    u.Email,
		Password: u.Password,
	}
}
