package main

import (
	"admingo/api"
	"admingo/internal/modules/config"
	"admingo/internal/modules/rbac"
	"fmt"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func main() {
	dsn := config.GetMySQLDSN()
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(fmt.Sprintf("failed to connect database: %v", err))
	}

	rbac.AutoMigrate(db)
	rbac.Init(db)

	r := api.SetupRouter()

	r.Run(fmt.Sprintf("http://localhost:%d", config.Conf.Server.Port))
}
