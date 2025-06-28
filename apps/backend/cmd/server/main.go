package main

import (
	"admingo/api"
	"admingo/internal/middleware"
	"admingo/internal/modules"
	"admingo/internal/modules/config"
	"fmt"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	modules.Init()

	r.Use(middleware.I18n())

	api.RegisterRoutes(r)

	r.Run(fmt.Sprintf("http://localhost:%d", config.Conf.Server.Port))
}
