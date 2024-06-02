package main

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/roshanlc/todos_assignment/backend/model"
	"github.com/roshanlc/todos_assignment/backend/repository"
	"github.com/roshanlc/todos_assignment/backend/utils/db"
)

// Config is the configuration for the application
type Config struct {
	DatabaseURL string
	GinMode     string
	Port        string
	SecretKey   string
}

func main() {
	// set log prefix
	log.SetPrefix("TODO-BACKEND::")

	// load configuration
	config, err := loadConfig()
	if err != nil {
		log.Fatal("failed to load configuration: ", err)
	}
	log.Println("Configuration loaded")
	_ = config

	dbConnPool, err := db.NewPostgresConnPool(config.DatabaseURL)
	if err != nil {
		log.Fatal("failed to create database connection pool: ", err)
	}
	repository := repository.NewRepository(dbConnPool)
	err = repository.InitialSetup() // run initial setup
	if err != nil {
		log.Fatal("failed to setup database tables: ", err)
	}
	userreq := &model.UserRequest{
		Name:     "John Doe",
		Email:    "doe.john@gmail.com",
		Password: "password",
	}
	if err := userreq.Validate(); err != nil {
		log.Fatal("failed to validate user request: ", err)
	}
	fmt.Println(repository.InsertUser(*userreq.ToUser()))
}

// loadConfig loads the configuration from the .env file
func loadConfig() (*Config, error) {
	var config Config
	err := godotenv.Load(".env")
	if err != nil {
		return nil, err
	}
	// fetch configuration
	config.DatabaseURL = os.Getenv("DATABASE_URL")
	if config.DatabaseURL == "" {
		return nil, fmt.Errorf("DATABASE_URL is not set")
	}
	config.GinMode = os.Getenv("GIN_MODE")
	if config.GinMode != "" && config.GinMode != "release" && config.GinMode != "debug" && config.GinMode != "test" {
		return nil, fmt.Errorf("unknown GIN_MODE: %s", config.GinMode)
	}
	// set gin mode to debug if not set
	if config.GinMode == "" {
		config.GinMode = "debug"
	}
	config.Port = os.Getenv("PORT")
	if config.Port == "" {
		config.Port = "9000"
	}
	config.SecretKey = os.Getenv("SECRET_KEY")
	if config.SecretKey == "" {
		return nil, fmt.Errorf("SECRET_KEY is not set")
	}
	return &config, nil
}
