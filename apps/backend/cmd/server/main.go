package main

import (
	"admingo/api"
	"admingo/internal/modules/config"
	"admingo/internal/modules/rbac"
	"fmt"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func main() {
	db, err := gorm.Open(sqlite.Open(config.Conf.Database.Path), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	rbac.AutoMigrate(db)

	r := api.SetupRouter()

	r.Run(fmt.Sprintf("http://localhost:%d", config.Conf.Server.Port))
}
