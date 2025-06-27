package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"admingo/internal/config"
)

func main() {
    r := gin.Default()

    r.GET("/", func(context *gin.Context) {
       context.String(http.StatusOK, "AdminGO Backend is running.")
    })

    r.Run(fmt.Sprintf(":%d", config.Conf.Server.Port))
}
