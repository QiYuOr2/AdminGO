package main

import (
	"admingo/api"
	"admingo/internal/config"
	"admingo/internal/middleware"
	"fmt"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.Use(middleware.I18n())

	api.RegisterRoutes(r)

	r.Run(fmt.Sprintf(":%d", config.Conf.Server.Port))
}
