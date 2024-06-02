package controller

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/roshanlc/todos_assignment/backend/model"
	"github.com/roshanlc/todos_assignment/backend/utils/auth"
	email "github.com/roshanlc/todos_assignment/backend/utils/others"
)

type LoginCredentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	User  *model.User `json:"user"`
	Token string      `json:"token"`
}

// Validate validates the login credentials
func (l *LoginCredentials) Validate() error {
	if l.Email == "" {
		return fmt.Errorf("email cannot be empty")
	}
	if !email.IsValidEmail(l.Email) {
		return fmt.Errorf("invalid email")
	}
	if l.Password == "" || len(l.Password) < 6 {
		return model.ErrPasswordLength
	}
	return nil
}

// registrationHandler handles the registration of a new user
func (s *Server) registrationHandler(ctx *gin.Context) {
	var req model.UserRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, NewErrorResponse(err.Error()))
		return
	}

	// validate the struct as well
	if err := req.Validate(); err != nil {
		ctx.JSON(http.StatusBadRequest, NewErrorResponse(err.Error()))
		return
	}
	// create the user
	user, err := s.service.CreateUser(req.ToUser())
	if err != nil {
		ctx.JSON(http.StatusBadRequest, NewErrorResponse(err.Error()))
		return
	}
	user.Password = "" // don't send the password back
	ctx.JSON(http.StatusCreated, NewSuccessResponse(user, nil))
}

// loginHandler handles the login of a user
func (s *Server) loginHandler(ctx *gin.Context) {
	var req LoginCredentials
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, NewErrorResponse(err.Error()))
		return
	}

	// validate the struct as well
	if err := req.Validate(); err != nil {
		ctx.JSON(http.StatusBadRequest, NewErrorResponse(err.Error()))
		return
	}

	// search for user by email
	user, err := s.service.GetUserByEmail(req.Email)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, NewErrorResponse(model.ErrInvalidCredentails.Error()))
		return

	}

	// compare the password
	ok, err := auth.ComparePassword(user.Password, req.Password)
	if err != nil || !ok {
		ctx.JSON(http.StatusUnauthorized, NewErrorResponse(model.ErrInvalidCredentails.Error()))
		return
	}

	user.Password = "" // don't send the password back

	token, err := auth.GenerateJWT(user.ID, user.Email)

	if err != nil {
		log.Println("loginHandler:: Internal Server Error: ", err)
		ctx.JSON(http.StatusInternalServerError, NewErrorResponse(err.Error()))
		return
	}
	// login resp
	loginResp := LoginResponse{
		User:  user,
		Token: token,
	}
	ctx.JSON(http.StatusCreated, NewSuccessResponse(loginResp, nil))
}

// authCheckHandler checks if the user is authenticated
func (s *Server) authCheckHandler(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, NewSuccessResponse("authenticated", nil))
}
