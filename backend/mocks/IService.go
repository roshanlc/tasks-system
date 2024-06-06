// Code generated by mockery v2.43.2. DO NOT EDIT.

package mocks

import (
	model "github.com/roshanlc/todos_assignment/backend/model"
	mock "github.com/stretchr/testify/mock"
)

// IService is an autogenerated mock type for the IService type
type IService struct {
	mock.Mock
}

// CreateTask provides a mock function with given fields: task
func (_m *IService) CreateTask(task model.Task) (*model.Task, error) {
	ret := _m.Called(task)

	if len(ret) == 0 {
		panic("no return value specified for CreateTask")
	}

	var r0 *model.Task
	var r1 error
	if rf, ok := ret.Get(0).(func(model.Task) (*model.Task, error)); ok {
		return rf(task)
	}
	if rf, ok := ret.Get(0).(func(model.Task) *model.Task); ok {
		r0 = rf(task)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).(*model.Task)
		}
	}

	if rf, ok := ret.Get(1).(func(model.Task) error); ok {
		r1 = rf(task)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// CreateUser provides a mock function with given fields: user
func (_m *IService) CreateUser(user *model.User) (*model.User, error) {
	ret := _m.Called(user)

	if len(ret) == 0 {
		panic("no return value specified for CreateUser")
	}

	var r0 *model.User
	var r1 error
	if rf, ok := ret.Get(0).(func(*model.User) (*model.User, error)); ok {
		return rf(user)
	}
	if rf, ok := ret.Get(0).(func(*model.User) *model.User); ok {
		r0 = rf(user)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).(*model.User)
		}
	}

	if rf, ok := ret.Get(1).(func(*model.User) error); ok {
		r1 = rf(user)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// DeleteTaskByID provides a mock function with given fields: taskID
func (_m *IService) DeleteTaskByID(taskID uint) error {
	ret := _m.Called(taskID)

	if len(ret) == 0 {
		panic("no return value specified for DeleteTaskByID")
	}

	var r0 error
	if rf, ok := ret.Get(0).(func(uint) error); ok {
		r0 = rf(taskID)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}

// GetTaskByID provides a mock function with given fields: taskID
func (_m *IService) GetTaskByID(taskID uint) (*model.Task, error) {
	ret := _m.Called(taskID)

	if len(ret) == 0 {
		panic("no return value specified for GetTaskByID")
	}

	var r0 *model.Task
	var r1 error
	if rf, ok := ret.Get(0).(func(uint) (*model.Task, error)); ok {
		return rf(taskID)
	}
	if rf, ok := ret.Get(0).(func(uint) *model.Task); ok {
		r0 = rf(taskID)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).(*model.Task)
		}
	}

	if rf, ok := ret.Get(1).(func(uint) error); ok {
		r1 = rf(taskID)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// GetTaskByIDAndUserID provides a mock function with given fields: taskID, userID
func (_m *IService) GetTaskByIDAndUserID(taskID uint, userID uint) (*model.Task, error) {
	ret := _m.Called(taskID, userID)

	if len(ret) == 0 {
		panic("no return value specified for GetTaskByIDAndUserID")
	}

	var r0 *model.Task
	var r1 error
	if rf, ok := ret.Get(0).(func(uint, uint) (*model.Task, error)); ok {
		return rf(taskID, userID)
	}
	if rf, ok := ret.Get(0).(func(uint, uint) *model.Task); ok {
		r0 = rf(taskID, userID)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).(*model.Task)
		}
	}

	if rf, ok := ret.Get(1).(func(uint, uint) error); ok {
		r1 = rf(taskID, userID)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// GetTasksByUserID provides a mock function with given fields: userID, pagination
func (_m *IService) GetTasksByUserID(userID uint, pagination *model.PaginationRequest) ([]model.Task, *model.PaginationResponse, error) {
	ret := _m.Called(userID, pagination)

	if len(ret) == 0 {
		panic("no return value specified for GetTasksByUserID")
	}

	var r0 []model.Task
	var r1 *model.PaginationResponse
	var r2 error
	if rf, ok := ret.Get(0).(func(uint, *model.PaginationRequest) ([]model.Task, *model.PaginationResponse, error)); ok {
		return rf(userID, pagination)
	}
	if rf, ok := ret.Get(0).(func(uint, *model.PaginationRequest) []model.Task); ok {
		r0 = rf(userID, pagination)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).([]model.Task)
		}
	}

	if rf, ok := ret.Get(1).(func(uint, *model.PaginationRequest) *model.PaginationResponse); ok {
		r1 = rf(userID, pagination)
	} else {
		if ret.Get(1) != nil {
			r1 = ret.Get(1).(*model.PaginationResponse)
		}
	}

	if rf, ok := ret.Get(2).(func(uint, *model.PaginationRequest) error); ok {
		r2 = rf(userID, pagination)
	} else {
		r2 = ret.Error(2)
	}

	return r0, r1, r2
}

// GetUserByEmail provides a mock function with given fields: email
func (_m *IService) GetUserByEmail(email string) (*model.User, error) {
	ret := _m.Called(email)

	if len(ret) == 0 {
		panic("no return value specified for GetUserByEmail")
	}

	var r0 *model.User
	var r1 error
	if rf, ok := ret.Get(0).(func(string) (*model.User, error)); ok {
		return rf(email)
	}
	if rf, ok := ret.Get(0).(func(string) *model.User); ok {
		r0 = rf(email)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).(*model.User)
		}
	}

	if rf, ok := ret.Get(1).(func(string) error); ok {
		r1 = rf(email)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// GetUserByID provides a mock function with given fields: userID
func (_m *IService) GetUserByID(userID uint) (*model.User, error) {
	ret := _m.Called(userID)

	if len(ret) == 0 {
		panic("no return value specified for GetUserByID")
	}

	var r0 *model.User
	var r1 error
	if rf, ok := ret.Get(0).(func(uint) (*model.User, error)); ok {
		return rf(userID)
	}
	if rf, ok := ret.Get(0).(func(uint) *model.User); ok {
		r0 = rf(userID)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).(*model.User)
		}
	}

	if rf, ok := ret.Get(1).(func(uint) error); ok {
		r1 = rf(userID)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// SearchTasksByUserID provides a mock function with given fields: userID, search, pagination
func (_m *IService) SearchTasksByUserID(userID uint, search string, pagination *model.PaginationRequest) ([]model.Task, *model.PaginationResponse, error) {
	ret := _m.Called(userID, search, pagination)

	if len(ret) == 0 {
		panic("no return value specified for SearchTasksByUserID")
	}

	var r0 []model.Task
	var r1 *model.PaginationResponse
	var r2 error
	if rf, ok := ret.Get(0).(func(uint, string, *model.PaginationRequest) ([]model.Task, *model.PaginationResponse, error)); ok {
		return rf(userID, search, pagination)
	}
	if rf, ok := ret.Get(0).(func(uint, string, *model.PaginationRequest) []model.Task); ok {
		r0 = rf(userID, search, pagination)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).([]model.Task)
		}
	}

	if rf, ok := ret.Get(1).(func(uint, string, *model.PaginationRequest) *model.PaginationResponse); ok {
		r1 = rf(userID, search, pagination)
	} else {
		if ret.Get(1) != nil {
			r1 = ret.Get(1).(*model.PaginationResponse)
		}
	}

	if rf, ok := ret.Get(2).(func(uint, string, *model.PaginationRequest) error); ok {
		r2 = rf(userID, search, pagination)
	} else {
		r2 = ret.Error(2)
	}

	return r0, r1, r2
}

// UpdateTask provides a mock function with given fields: task
func (_m *IService) UpdateTask(task model.Task) (*model.Task, error) {
	ret := _m.Called(task)

	if len(ret) == 0 {
		panic("no return value specified for UpdateTask")
	}

	var r0 *model.Task
	var r1 error
	if rf, ok := ret.Get(0).(func(model.Task) (*model.Task, error)); ok {
		return rf(task)
	}
	if rf, ok := ret.Get(0).(func(model.Task) *model.Task); ok {
		r0 = rf(task)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).(*model.Task)
		}
	}

	if rf, ok := ret.Get(1).(func(model.Task) error); ok {
		r1 = rf(task)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// NewIService creates a new instance of IService. It also registers a testing interface on the mock and a cleanup function to assert the mocks expectations.
// The first argument is typically a *testing.T value.
func NewIService(t interface {
	mock.TestingT
	Cleanup(func())
}) *IService {
	mock := &IService{}
	mock.Mock.Test(t)

	t.Cleanup(func() { mock.AssertExpectations(t) })

	return mock
}
