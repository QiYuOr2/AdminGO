package middleware

import (
	"admingo/internal/pkg/response"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type contextKey string

const DBKey contextKey = "db"

func Database(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set(string(DBKey), db)
		c.Next()
	}
}

func GetDB(c *gin.Context) (*gorm.DB, bool) {
	val, ok := c.Get(string(DBKey))
	if !ok {
		return nil, false
	}

	db, ok := val.(*gorm.DB)
	if !ok {
		return nil, false
	}

	return db, true
}

func GetMustDB(c *gin.Context) *gorm.DB {
	db, ok := GetDB(c)
	if !ok {
		response.ErrorWithMessage(c, "数据库连接错误")
		// panic("Database connection not found in context")
	}
	return db
}
