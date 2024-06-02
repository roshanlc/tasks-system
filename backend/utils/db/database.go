package db

import (
	"context"
	"log"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

// NewPostgresConnPool creates a new connection pool to the Postgres database
// using the provided DSN. The pool must be closed by user after use.
func NewPostgresConnPool(dsn string) (*pgxpool.Pool, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()
	var err error
	var conn *pgxpool.Pool
	log.Println("Setting up database connection")
	for retry := 1; retry < 4; retry++ {
		conn, err = pgxpool.New(ctx, dsn)
		if err != nil || conn == nil {
			if retry == 3 {
				return nil, err
			}
			log.Println("Retrying database connection")
			continue
		}
	}
	if err := conn.Ping(ctx); err != nil {
		return nil, err
	}
	return conn, nil
}
