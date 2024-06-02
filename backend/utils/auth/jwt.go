package auth

import (
	"log"
	"time"

	"github.com/dgrijalva/jwt-go"
)

// Signging Key
var SigningKey []byte

// GenerateJWT generates a JWT token
func GenerateJWT(userID uint, email, role string) (string, error) {
	token := jwt.New(jwt.SigningMethodHS512)
	claims := token.Claims.(jwt.MapClaims)

	claims["authorized"] = true
	claims["email"] = email
	claims["role"] = role
	claims["user_id"] = userID
	claims["exp"] = time.Now().Add(time.Hour * 3).Unix()

	tokenString, err := token.SignedString(SigningKey)

	if err != nil {
		log.Println(err)
		return "", err
	}
	return tokenString, err
}
