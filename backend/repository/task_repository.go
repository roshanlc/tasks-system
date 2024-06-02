package repository

import (
	"context"
	"errors"
	"strings"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/roshanlc/todos_assignment/backend/model"
)

// FindTaskByID fetches a task from the database by ID
func (repo *PostgresRepository) FindTaskByID(taskID uint) (*model.Task, error) {
	query := `SELECT id, title, description, completed, created_at, user_id FROM tasks WHERE id = $1`

	// timeout context
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var task model.Task
	err := repo.ConnPool.QueryRow(ctx, query, taskID).Scan(
		&task.ID, &task.Title, &task.Description,
		&task.Completed, &task.CreatedAt, &task.UserID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, model.ErrRecordNotFound
		}
		return nil, err
	}

	return &task, nil
}

// DeleteTaskByID deletes a task from the database by ID
func (repo *PostgresRepository) DeleteTaskByID(taskID uint) error {
	query := `DELETE FROM tasks WHERE id = $1`

	// timeout context
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	sts, err := repo.ConnPool.Exec(ctx, query, taskID)
	if err != nil {
		return err
	}
	if sts.RowsAffected() == 0 {
		return model.ErrNotUpdated
	}
	return nil
}

// InsertTask inserts a task into the database
func (repo *PostgresRepository) InsertTask(task model.Task) (*model.Task, error) {
	query := `INSERT INTO tasks(title, description, completed, user_id)
	VALUES ($1, $2, $3, $4) 
	RETURNING id, title, description, completed, created_at, user_id`

	// timeout context
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err := repo.ConnPool.QueryRow(ctx, query, task.Title, task.Description, task.Completed, task.UserID).Scan(
		&task.ID, &task.Title,
		&task.Description, &task.Completed,
		&task.CreatedAt, &task.UserID)
	if err != nil {
		return nil, err
	}

	return &task, nil
}

// UpdateTask updates a task into the database
func (repo *PostgresRepository) UpdateTask(task model.Task) (*model.Task, error) {
	query := `UPDATE tasks
	SET title = $1, description = $2, completed = $3
	WHERE id = $4 
	RETURNING id, title, description, completed, created_at, user_id`

	// timeout context
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err := repo.ConnPool.QueryRow(ctx, query, task.Title, task.Description, task.Completed, task.ID).Scan(
		&task.ID, &task.Title,
		&task.Description, &task.Completed,
		&task.CreatedAt, &task.UserID)
	if err != nil {
		return nil, err
	}

	return &task, nil
}

// FindTasksByUserID fetches all tasks from the database by user ID
func (repo *PostgresRepository) FindTasksByUserID(userID uint, pagination *model.PaginationRequest) ([]model.Task, *model.PaginationResponse, error) {
	// check for pagination
	if pagination == nil {
		return nil, nil, model.ErrInvalidPagination
	}

	query := `SELECT id, title, description, completed, created_at, user_id FROM tasks WHERE user_id = $1`

	if strings.EqualFold(pagination.Sort, "desc") {
		query += ` ORDER BY id DESC`
	} else {
		query += ` ORDER BY id ASC`
	}
	query += ` OFFSET $2 LIMIT $3`

	var offset uint
	if pagination.Page > 1 {
		offset = (pagination.Page - 1) * pagination.Size
	}

	// timeout context
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	rows, err := repo.ConnPool.Query(ctx, query, userID, offset, pagination.Size)
	if err != nil {
		return nil, nil, err
	}
	defer rows.Close()

	var tasks []model.Task
	for rows.Next() {
		var task model.Task
		err := rows.Scan(&task.ID, &task.Title, &task.Description, &task.Completed, &task.CreatedAt, &task.UserID)
		if err != nil {
			return nil, nil, err
		}
		tasks = append(tasks, task)
	}
	paginationResp := &model.PaginationResponse{
		Page:  pagination.Page,
		Size:  pagination.Size,
		Sort:  pagination.Sort,
		Total: uint(len(tasks)),
	}
	// calc total pages
	paginationResp.CalculateTotalPages()
	return tasks, paginationResp, nil
}

// SearchTasksByUserID fetches all tasks from the database by user ID and search query
func (repo *PostgresRepository) SearchTasksByUserID(userID uint, search string, pagination *model.PaginationRequest) ([]model.Task, *model.PaginationResponse, error) {
	if pagination == nil {
		return nil, nil, model.ErrInvalidPagination
	}
	if strings.TrimSpace(search) == "" {
		return nil, nil, model.ErrEmptySearch
	}

	query := `SELECT id, title, description, completed, created_at, user_id 
	FROM tasks WHERE user_id = $1 
	AND (title ILIKE '%' || $2 || '%' OR description ILIKE '%' || $2 || '%')`

	if strings.EqualFold(pagination.Sort, "desc") {
		query += ` ORDER BY id DESC`
	} else {
		query += ` ORDER BY id ASC`
	}
	query += ` OFFSET $3 LIMIT $4`

	var offset uint
	if pagination.Page > 1 {
		offset = (pagination.Page - 1) * pagination.Size
	}

	// timeout context
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	rows, err := repo.ConnPool.Query(ctx, query, userID, search, offset, pagination.Size)
	if err != nil {
		return nil, nil, err
	}
	defer rows.Close()

	var tasks []model.Task
	for rows.Next() {
		var task model.Task
		err := rows.Scan(&task.ID, &task.Title, &task.Description, &task.Completed, &task.CreatedAt, &task.UserID)
		if err != nil {
			return nil, nil, err
		}
		tasks = append(tasks, task)
	}
	paginationResp := &model.PaginationResponse{
		Page:  pagination.Page,
		Size:  pagination.Size,
		Sort:  pagination.Sort,
		Total: uint(len(tasks)),
	}
	// calc total pages
	paginationResp.CalculateTotalPages()
	return tasks, paginationResp, nil
}

// FindTaskByIDAndUserID fetches a task from the database by ID and user id
func (repo *PostgresRepository) FindTaskByIDAndUserID(taskID, userID uint) (*model.Task, error) {
	query := `SELECT id, title, description, completed, created_at, user_id FROM tasks WHERE id = $1 AND user_id = $2`

	// timeout context
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var task model.Task
	err := repo.ConnPool.QueryRow(ctx, query, taskID, userID).Scan(
		&task.ID, &task.Title, &task.Description,
		&task.Completed, &task.CreatedAt, &task.UserID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, model.ErrRecordNotFound
		}
		return nil, err
	}

	return &task, nil
}
