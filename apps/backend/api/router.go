package api

import (
	"admingo/api/auth"
	"admingo/internal/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	r.Use(middleware.I18n())
	r.Use(middleware.JWT())

	auth.RegisterRoutes(r.Group("/auth"))

	return r
}

// func RegisterRoutes(r *gin.Engine, db *gorm.DB) {
// 	rbacService := rbac.NewService(db)
// 	authHandler := auth.NewAuthHandler(db, rbacService)

// 	// 公共路由
// 	r.POST("/login", authHandler.Login)
// 	r.GET("/hello", Hello) // Hello 路由现在是公共的

// 	// API 路由组，需要 JWT 认证
// 	api := r.Group("/api")
// 	api.Use(middleware.JWT())
// 	{
// 		// 用户管理路由
// 		userRoutes := api.Group("/users")
// 		{
// 			userRoutes.GET("/", middleware.PermissionRequired("sys:user:list"), func(c *gin.Context) {
// 				response.Success(c, "List of users")
// 			}) // 示例：获取用户列表
// 			userRoutes.POST("/", middleware.PermissionRequired("sys:user:create"), func(c *gin.Context) {
// 				response.Success(c, "User created")
// 			}) // 示例：创建用户
// 		}

// 		// 更多需要认证的路由...
// 	}
// }
