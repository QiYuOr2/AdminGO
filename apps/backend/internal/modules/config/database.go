package config

import "fmt"

func GetMySQLDSN() string {
	db := Conf.Database
	return fmt.Sprintf(
		"%s:%s@tcp(%s:%d)/%s?charset=%s&parseTime=%t&loc=%s",
		db.User,
		db.Password,
		db.Host,
		db.Port,
		db.Name,
		db.Charset,
		db.ParseTime,
		db.Loc,
	)
}
