package controller

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/roshanlc/todos_assignment/backend/utils/auth"
)

type UserHeaderDetails struct {
	ID    uint
	Role  string
	Email string
}

// isAuthenticated is a middleware to check if the request is authenticated
func isAuthenticated(ctx *gin.Context) {
	// check if auth bearer token is present
	authHeader := ctx.GetHeader("Authorization")
	token := extractToken(authHeader)
	if authHeader == "" || token == "" {
		ctx.JSON(http.StatusUnauthorized, NewErrorResponse("Invalid or missing authorization token"))
		ctx.Abort()
		return
	}

	// parse the token
	tokenVal, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("there was error while parsing")
		}
		return auth.SigningKey, nil
	})

	if err != nil || !tokenVal.Valid {
		ctx.JSON(http.StatusUnauthorized, NewErrorResponse("invalid or expired token"))
		ctx.Abort()
		return
	}

	// Pass to next handler
	ctx.Next()
}

func extractToken(authHeader string) string {
	// extract token from the auth header
	// format: Bearer <token>
	var token string
	headerParts := strings.Split(authHeader, " ")
	if len(headerParts) == 2 {
		token = headerParts[1]
	}
	return token
}

// extract user details from the header
func GetDetailsFromHeader(ctx *gin.Context) UserHeaderDetails {
	authHeader := ctx.GetHeader("Authorization")
	token := extractToken(authHeader)
	tokenVal, _ := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("there was error while parsing")
		}
		return auth.SigningKey, nil
	})
	claims := tokenVal.Claims.(jwt.MapClaims)
	userID := uint(claims["user_id"].(float64))
	email := claims["email"].(string)
	role := claims["role"].(string)
	return UserHeaderDetails{
		ID:    userID,
		Role:  role,
		Email: email,
	}
}

// isAdmin is a middleware to check if the user requesting is admin.
// Only to be used after isAuthenticated middleware
func isAdmin(ctx *gin.Context) {
	// get token details
	tokenDetails := GetDetailsFromHeader(ctx)

	if !strings.EqualFold(tokenDetails.Role, "super_admin") {
		ctx.JSON(http.StatusForbidden, NewErrorResponse("unauthorized access"))
		ctx.Abort()
		return
	}
	// Pass to next handler
	ctx.Next()
}
