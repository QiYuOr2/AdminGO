package main

import (
	"admingo/api"
	"admingo/internal/modules/config"
	"admingo/internal/modules/rbac"
	"fmt"

	"admingo/cmd/docs"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// @title			AdminGO API
// @version		1.0
// @description	This is the backend service for AdminGO.
//
// @host			localhost:8080
// @BasePath		/api
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

	r.GET("/swagger/doc.json", func(c *gin.Context) {
		c.Data(200, "application/json;  charset=utf-8", []byte(docs.SwaggerInfo.ReadDoc()))
	})
	r.GET("/docs/*any", ginSwagger.WrapHandler(
		swaggerFiles.Handler,
		ginSwagger.URL("/swagger/doc.json"),
	))

	r.Run(fmt.Sprintf("%s:%d", config.Conf.Server.Host, config.Conf.Server.Port))
}
