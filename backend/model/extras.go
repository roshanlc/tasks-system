package model

import "errors"

var (
	ErrNameIsRequired     = errors.New("name is required")
	ErrEmailIsRequired    = errors.New("email is required")
	ErrPasswordIsRequired = errors.New("password is required")
	ErrPasswordLength     = errors.New("password must be at least 6 characters long")
	ErrDuplicateEmail     = errors.New("email already exists")
	ErrNotUpdated         = errors.New("row(s) could not be updated")
	ErrInvalidPagination  = errors.New("invalid or null pagination values")
	ErrEmptySearch        = errors.New("search query is empty")
	ErrInvalidUserID      = errors.New("invalid user id, must be greater than 0")
	ErrRecordNotFound     = errors.New("record not found")
	ErrInvalidTaskID      = errors.New("invalid task id, must be greater than 0")
	ErrInvalidCredentails = errors.New("invalid credentials")
	ErrUnAuthorized       = errors.New("unauthorized access")
)
