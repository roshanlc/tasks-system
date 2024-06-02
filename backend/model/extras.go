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
)
