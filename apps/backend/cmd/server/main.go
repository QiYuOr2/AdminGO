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
	config.InitEnv()

	dsn := config.GetMySQLDSN()

	println("=================================")
	println(fmt.Sprintf("[MySQL Path] %s", dsn))

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(fmt.Sprintf("failed to connect database: %v", err))
	}

	rbac.AutoMigrate(db)
	rbac.Init(db)

	hc := api.BuildHandlers(db)
	r := api.SetupRouter(hc)

	r.Run(fmt.Sprintf("%s:%d", config.Conf.Server.Host, config.Conf.Server.Port))
}
