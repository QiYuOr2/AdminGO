package utils_test

import (
	"admingo/internal/pkg/utils"
	"testing"
)

func TestPasswordHashing(t *testing.T) {
	origin := "mySecret"
	hash, err := utils.HashPassword(origin)
	if err != nil {
		t.Fatal(err)
	}

	if !utils.CheckPassword(origin, hash) {
		t.Fatal("密码验证失败")
	}
}
