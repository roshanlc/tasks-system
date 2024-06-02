package controller

import "github.com/roshanlc/todos_assignment/backend/model"

// ErrorResponse is the response for an error to be returned to user
type ErrorResponse struct {
	Error struct {
		Message string `json:"message"`
	} `json:"error"`
}

// SuccessResponse is the response for a successful request to be returned to user
type SuccessResponse struct {
	Metadata *model.PaginationResponse `json:"metadata"`
	Data     interface{}               `json:"data"`
}

// NewErrorResponse creates a new error response
func NewErrorResponse(message string) ErrorResponse {
	return ErrorResponse{
		Error: struct {
			Message string `json:"message"`
		}{
			Message: message,
		},
	}
}

// NewSuccessResponse creates a new success response
func NewSuccessResponse(data interface{}, pagination *model.PaginationResponse) SuccessResponse {
	if pagination == nil {
		pagination = &model.PaginationResponse{}
	}
	return SuccessResponse{
		Metadata: pagination,
		Data:     data,
	}
}
