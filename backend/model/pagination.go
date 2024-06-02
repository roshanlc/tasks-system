package model

import "errors"

// PaginationRequest struct holds details related to pagination from request
type PaginationRequest struct {
	Page uint   `json:"page"`
	Size uint   `json:"size"`
	Sort string `json:"sort"`
}

// PaginationResponse struct holds details related to pagination response from database query
type PaginationResponse struct {
	Page  uint   `json:"page"`
	Size  uint   `json:"size"`
	Sort  string `json:"sort"`
	Pages uint   `json:"pages"`
	Total uint   `json:"total"`
}

// Prerpare method sets default values for pagination
func (p *PaginationRequest) Prepare() {
	if p.Page == 0 {
		p.Page = 1
	}
	if p.Size == 0 {
		p.Size = 10
	}
	if p.Sort == "" {
		p.Sort = "asc"
	}
}

// Validate method validates pagination values
func (p *PaginationRequest) Validate() error {
	if p.Sort != "asc" && p.Sort != "desc" {
		return errors.New("invalid sort direction, supported sort are: asc, desc")
	}
	if p.Size > 100 {
		return errors.New("page size should not exceed 100")
	}
	return nil
}

// CalculateTotalPages method calculates total pages based on total records and page size
func (p *PaginationResponse) CalculateTotalPages() {
	if p.Total == 0 || p.Size == 0 {
		p.Pages = 0
		return
	}
	if p.Total%p.Size == 0 {
		p.Pages = p.Total / p.Size
	} else {
		p.Pages = p.Total/p.Size + 1
	}
}
