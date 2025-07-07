package config

import (
	"fmt"
	"os"
)

func GetMySQLDSN() string {
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")

	db := Conf.Database

	return fmt.Sprintf(
		"%s:%s@tcp(%s:%s)/%s?charset=%s&parseTime=%t&loc=%s",
		user,
		password,
		host,
		port,
		db.Name,
		db.Charset,
		db.ParseTime,
		db.Loc,
	)
}
