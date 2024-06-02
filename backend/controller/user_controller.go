package controller

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/roshanlc/todos_assignment/backend/model"
)

// getUserHandler handles the get user request to fetch user details
func (s *Server) getUserHandler(ctx *gin.Context) {
	// user id
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil || id < 1 {
		ctx.JSON(http.StatusBadRequest, NewErrorResponse(model.ErrInvalidUserID.Error()))
		return
	}
	// only allow the user to see their own details
	userDetails := GetDetailsFromHeader(ctx)
	if userDetails.ID != uint(id) {
		ctx.JSON(http.StatusForbidden, NewErrorResponse(model.ErrUnAuthorized.Error()))
		return
	}
	// get user details
	user, err := s.service.GetUserByID(uint(id))
	if err != nil {
		if err == model.ErrRecordNotFound {
			ctx.JSON(http.StatusNotFound, NewErrorResponse(err.Error()))
			return
		}
		ctx.JSON(http.StatusInternalServerError, NewErrorResponse(err.Error()))
		return
	}
	user.Password = "" // don't send the password back
	ctx.JSON(http.StatusOK, NewSuccessResponse(user, nil))
}
