package controllers

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/roshanlc/todos_assignment/backend/service"
)

type Server struct {
	service *service.IService
	router  *gin.Engine
}

// NewServer creates a new server instance
func NewServer(ginMode string, service *service.IService) *Server {
	if ginMode == "" {
		ginMode = gin.DebugMode
	}
	gin.SetMode(ginMode)
	router := gin.Default()

	return &Server{
		service: service,
		router:  router,
	}
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
	// grp := s.Router.Group("/api/v1")
	// grp.GET("/healthz", s.healthCheckHandler)
	// grp.POST("/auth/check", isAuthenticated, s.authCheckHandler)

	// // auth routes
	// grp.POST("/auth/login", s.loginHandler)
	// grp.POST("/auth/register", s.registrationHandler)

	// // user routes
	// grp.POST("/users", isAuthenticated, isAdmin, s.createUserHandler)
	// grp.GET("/users", isAuthenticated, isAdmin, s.listUsersHandler)
	// grp.GET("/users/:id", isAuthenticated, isAdmin, s.getUserHandler)
	// grp.PUT("/users/:id", isAuthenticated, isAdmin, s.updateUserHandler)
	// grp.DELETE("/users/:id", isAuthenticated, isAdmin, s.deleteUserHandler)

	// // artist routes
	// grp.GET("/artists", isAuthenticated, isAdminOrArtistManager, s.listArtistsHandler)
	// grp.GET("/artists/:id", isAuthenticated, isAdminOrArtistManager, s.getArtistHandler)
	// grp.POST("/artists", isAuthenticated, isAdminOrArtistManager, s.createArtistHandler)
	// grp.PUT("/artists/:id", isAuthenticated, isAdminOrArtistManager, s.updateArtistHandler)
	// grp.DELETE("/artists/:id", isAuthenticated, isAdminOrArtistManager, s.deleteAristHandler)

	// // music records routes
	// grp.GET("/artists/:id/musics", isAuthenticated, s.listMusicByArtistHandler)
	// grp.POST("/artists/:id/musics", isAuthenticated, s.createNewMusicHandler)
	// grp.PUT("/artists/:id/musics", isAuthenticated, s.updateMusicHandler)
	// grp.DELETE("/artists/:id/musics", isAuthenticated, s.deleteMusicHandler)

}

// Run starts the server
func (s *Server) Run() error {
	port := os.Getenv("PORT")
	if port == "" {
		port = "9000"
	}

	log.Println("Starting server at port :", port)
	return s.router.Run(fmt.Sprintf(":%s", port))
}

// healthCheckHandler is the handler for the health check endpoint
func (s *Server) healthCheckHandler(ctx *gin.Context) {
	// ctx.JSON(http.StatusOK, SuccessResponse{Data: "Up and running.."})
}
