package controller

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/roshanlc/todos_assignment/backend/service"
)

type Server struct {
	service service.IService
	router  *gin.Engine
}

// NewServer creates a new server instance
func NewServer(ginMode string, service service.IService) *Server {
	if ginMode == "" {
		ginMode = gin.DebugMode
	}
	gin.SetMode(ginMode)
	router := gin.Default()

	server := &Server{
		service: service,
		router:  router,
	}
	// setup the routes
	server.SetupRoutes()
	return server
}

// SetupRoutes sets up the routes for the server
func (s *Server) SetupRoutes() {

	// setup cors
	s.router.Use(func(ctx *gin.Context) {
		ctx.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		ctx.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		ctx.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		ctx.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
		// for options request, abort with status ok
		if ctx.Request.Method == "OPTIONS" {
			ctx.AbortWithStatus(http.StatusOK)
			return
		}
		ctx.Next()
	})

	// base path : /api/v1
	grp := s.router.Group("/api/v1")
	grp.GET("/healthz", s.healthCheckHandler)
	grp.POST("/auth/check", isAuthenticated, s.authCheckHandler)

	// // auth routes
	grp.POST("/auth/login", s.loginHandler)
	grp.POST("/auth/register", s.registrationHandler)

	// // user routes
	grp.GET("/users/:id", isAuthenticated, s.getUserHandler)

	// task routes
	grp.GET("/tasks", isAuthenticated, s.listTaskHandler)
	grp.GET("/tasks/:id", isAuthenticated, s.getTaskHandler)
	grp.POST("/tasks", isAuthenticated, s.createTaskHandler)
	grp.PUT("/tasks/:id", isAuthenticated, s.updateTaskHandler)
	grp.DELETE("/tasks/:id", isAuthenticated, s.deleteTaskHandler)
}

// Run starts the server
func (s *Server) Run(port string) error {
	if port == "" {
		port = "9000"
	}

	log.Println("Starting server at port :", port)
	return s.router.Run(fmt.Sprintf(":%s", port))
}

// healthCheckHandler is the handler for the health check endpoint
func (s *Server) healthCheckHandler(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, NewSuccessResponse("ok computer", nil))
}
