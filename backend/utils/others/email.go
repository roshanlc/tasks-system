package others

import "regexp"

// IsValidEmail checks whether the provided email is valid or not through a basic validation
func IsValidEmail(email string) bool {
	regex := regexp.MustCompile("(?i)^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
	if !regex.MatchString(email) {
		return false
	}
	return true
}
