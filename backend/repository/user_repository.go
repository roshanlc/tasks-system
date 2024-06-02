package repository

import (
	"context"
	"errors"
	"strings"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/roshanlc/todos_assignment/backend/model"
)

// FindUserByID fetches a user from the database by ID
func (repo *PostgresRepository) FindUserByID(userID uint) (*model.User, error) {
	query := `SELECT id, name, email, password created_at FROM users WHERE id = $1`

	// timeout context
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var user model.User
	err := repo.ConnPool.QueryRow(ctx, query, userID).Scan(
		&user.ID, &user.Name, &user.Email,
		&user.Password, &user.CreatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, model.ErrRecordNotFound
		}
		return nil, err
	}

	return &user, nil
}

// FindUserByEmail fetches a user from the database by email
func (repo *PostgresRepository) FindUserByEmail(email string) (*model.User, error) {
	query := `SELECT id, name, email, password, created_at FROM users WHERE email = $1`

	// timeout context
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var user model.User
	err := repo.ConnPool.QueryRow(ctx, query, email).Scan(
		&user.ID, &user.Name, &user.Email,
		&user.Password, &user.CreatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, model.ErrRecordNotFound
		}
		return nil, err
	}

	return &user, nil
}

// InsertUser inserts a new user into the database
func (repo *PostgresRepository) InsertUser(user model.User) (*model.User, error) {
	query := `INSERT INTO users(name, email, password)
	VALUES ($1, $2, $3) 
	RETURNING id, name, email, password, created_at`

	// timeout context
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err := repo.ConnPool.QueryRow(ctx, query, user.Name, user.Email, user.Password).Scan(
		&user.ID, &user.Name,
		&user.Email, &user.Password,
		&user.CreatedAt,
	)
	// check for unique constraint violation
	if err != nil {
		if strings.Contains(err.Error(), "unique constraint") {
			return nil, model.ErrDuplicateEmail
		}
		return nil, err
	}

	return &user, nil
}
