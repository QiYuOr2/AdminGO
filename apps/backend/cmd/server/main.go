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

	// TODO 模块化数据库连接，支持更换底层数据库
	dsn := config.GetMySQLDSN()

	println("=================================")
	println(fmt.Sprintf("[MySQL Path] %s", dsn))

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(fmt.Sprintf("failed to connect database: %v", err))
	}

	rbac.AutoMigrate(db)
	rbac.Init(db)

	r := api.SetupRouter(db)

	r.Run(fmt.Sprintf("%s:%d", config.Conf.Server.Host, config.Conf.Server.Port))
}
