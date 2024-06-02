package repository

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/roshanlc/todos_assignment/backend/external"
	"github.com/roshanlc/todos_assignment/backend/model"
)

// Repository is the interface that wraps the basic CRUD operations
type IRepository interface {
	// Users
	FindUserByID(userID uint) (*model.User, error)
	FindUserByEmail(email string) (*model.User, error)
	InsertUser(user model.User) (*model.User, error)
	// Tasks
	FindTaskByID(taskID uint) (*model.Task, error)
	DeleteTaskByID(taskID uint) error
	InsertTask(task model.Task) (*model.Task, error)
	UpdateTask(task model.Task) (*model.Task, error)
	FindTasksByUserID(userID uint, pagination *model.PaginationRequest) ([]model.Task, *model.PaginationResponse, error)
	SearchTasksByUserID(userID uint, search string, pagination *model.PaginationRequest) ([]model.Task, *model.PaginationResponse, error)
	FindTaskByIDAndUserID(taskID, userID uint) (*model.Task, error)
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
	return nil
}
