package controller

import (
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/roshanlc/todos_assignment/backend/model"
)

// getTaskHandler returns the details of a task
func (s *Server) getTaskHandler(ctx *gin.Context) {
	// task id
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil || id < 1 {
		ctx.JSON(http.StatusBadRequest, NewErrorResponse(model.ErrInvalidTaskID.Error()))
		return
	}
	// only allow the user to see their own details
	userDetails := GetDetailsFromHeader(ctx)
	// get task details
	task, err := s.service.GetTaskByIDAndUserID(uint(id), userDetails.ID)
	if err != nil {
		if err == model.ErrRecordNotFound {
			ctx.JSON(http.StatusNotFound, NewErrorResponse(err.Error()))
			return
		}
		ctx.JSON(http.StatusInternalServerError, NewErrorResponse(err.Error()))
		return
	}
	ctx.JSON(http.StatusOK, NewSuccessResponse(task, nil))
}

// listTaskHandler returns the tasks of a user
func (s *Server) listTaskHandler(ctx *gin.Context) {
	// pagination binding
	var pag model.PaginationRequest
	if err := ctx.ShouldBindQuery(&pag); err != nil {
		ctx.JSON(http.StatusBadRequest, NewErrorResponse(err.Error()))
		return
	}
	pag.Prepare()
	if err := pag.Validate(); err != nil {
		ctx.JSON(http.StatusBadRequest, NewErrorResponse(err.Error()))
		return
	}

	// get user id from token
	userDetails := GetDetailsFromHeader(ctx)
	tasks, pagResp, err := s.service.GetTasksByUserID(userDetails.ID, &pag)
	if err != nil {
		log.Println("listTaskHandler:: Internal Server Error: ", err)
		ctx.JSON(http.StatusInternalServerError, NewErrorResponse(err.Error()))
		return
	}
	ctx.JSON(http.StatusOK, NewSuccessResponse(tasks, pagResp))
}

// deleteTaskHandler handles request for task deletio
func (s *Server) deleteTaskHandler(ctx *gin.Context) {
	// task id
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil || id < 1 {
		ctx.JSON(http.StatusBadRequest, NewErrorResponse(model.ErrInvalidTaskID.Error()))
		return
	}
	// only allow the user to see their own details
	userDetails := GetDetailsFromHeader(ctx)
	// get task details
	_, err = s.service.GetTaskByIDAndUserID(uint(id), userDetails.ID)
	if err != nil {
		if err == model.ErrRecordNotFound {
			ctx.JSON(http.StatusNotFound, NewErrorResponse(err.Error()))
			return
		}
		ctx.JSON(http.StatusInternalServerError, NewErrorResponse(err.Error()))
		return
	}

	// now delete the task
	err = s.service.DeleteTaskByID(uint(id))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, NewErrorResponse(err.Error()))
		return
	}
	ctx.JSON(http.StatusOK, NewSuccessResponse("task was deleted successfully", nil))
}

// createTaskHandler handles create request for a task
func (s *Server) createTaskHandler(ctx *gin.Context) {
	// bind the request
	var taskReq model.NewTaskRequest
	if err := ctx.ShouldBindJSON(&taskReq); err != nil {
		ctx.JSON(http.StatusBadRequest, NewErrorResponse(err.Error()))
		return
	}
	if err := taskReq.Validate(); err != nil {
		ctx.JSON(http.StatusBadRequest, NewErrorResponse(err.Error()))
		return
	}

	// only allow the user to see their own details
	userDetails := GetDetailsFromHeader(ctx)

	task := taskReq.ToTask(userDetails.ID)
	// now update the task
	task, err := s.service.CreateTask(*task)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, NewErrorResponse(err.Error()))
		return
	}
	ctx.JSON(http.StatusCreated, NewSuccessResponse(task, nil))
}

// updateTaskHandler handles update request for a task
func (s *Server) updateTaskHandler(ctx *gin.Context) {
	// task id
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil || id < 1 {
		ctx.JSON(http.StatusBadRequest, NewErrorResponse(model.ErrInvalidTaskID.Error()))
		return
	}
	// bind the request
	var updateReq model.UpdateTaskRequest
	if err := ctx.ShouldBindJSON(&updateReq); err != nil {
		ctx.JSON(http.StatusBadRequest, NewErrorResponse(err.Error()))
		return
	}
	if err := updateReq.Validate(); err != nil {
		ctx.JSON(http.StatusBadRequest, NewErrorResponse(err.Error()))
		return
	}

	// only allow the user to see their own details
	userDetails := GetDetailsFromHeader(ctx)
	// get task details
	_, err = s.service.GetTaskByIDAndUserID(uint(id), userDetails.ID)
	if err != nil {
		if err == model.ErrRecordNotFound {
			ctx.JSON(http.StatusNotFound, NewErrorResponse(err.Error()))
			return
		}
		ctx.JSON(http.StatusInternalServerError, NewErrorResponse(err.Error()))
		return
	}

	// now update the task
	task, err := s.service.UpdateTask(*updateReq.ToTask(uint(id), userDetails.ID))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, NewErrorResponse(err.Error()))
		return
	}
	ctx.JSON(http.StatusOK, NewSuccessResponse(task, nil))
}
