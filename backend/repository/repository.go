package repository

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/roshanlc/todos_assignment/backend/external"
	"github.com/roshanlc/todos_assignment/backend/model"
	"github.com/roshanlc/todos_assignment/backend/utils/auth"
)

// Repository is the interface that wraps the basic CRUD operations
type IRepository interface {
	// Users
	IUserRepository
	// Tasks
	ITaskRepository
}

// PostgresRepository is the postgres implementation of the repository
type PostgresRepository struct {
	ConnPool *pgxpool.Pool
}

// NewRepository creates a new repository (for now, only postgres is supported)
func NewRepository(ConnPool *pgxpool.Pool) *PostgresRepository {
	return &PostgresRepository{
		ConnPool: ConnPool,
	}
}

// InitialSetup is used to setup the database with tables and initial data
func (r *PostgresRepository) InitialSetup() error {
	// run the sql script to create the tables
	// timeout context
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()
	_, err := r.ConnPool.Exec(ctx, external.INTIAL_DB_SETUP)
	if err != nil {
		return err
	}

	// insert dummy login user
	if _, err := r.FindUserByEmail("john.doe@email.com"); err == model.ErrRecordNotFound {
		hashPw, _ := auth.HashPassword("password")
		user := model.User{
			Name:     "John Doe",
			Email:    "john.doe@email.com",
			Password: hashPw,
		}
		_, _ = r.InsertUser(user)
	}

	return nil
}
