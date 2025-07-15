# pkg/crud

`pkg/crud` 模块为 Go 应用程序提供了通用且可重用的 CRUD（创建、读取、更新、删除）操作实现。它旨在与 `gin` 框架处理 HTTP 请求和 `gorm` 进行数据库交互，以促进清晰的分层架构。

## 特性

*   **通用 CRUD 操作：** 支持任何给定数据模型 (`T`) 的 `Create`、`GetByID`、`Update`、`Delete` 和 `List` 操作。
*   **分层架构：** 将职责分离到 Repository（仓库）、Service（服务）和 Handler（处理器）层。
*   **Gin 集成：** 处理器旨在与 Gin Web 框架无缝集成。
*   **GORM 集成：** 仓库层利用 GORM 进行灵活而强大的数据库操作。
*   **可定制响应：** 提供 `Responder` 接口，用于定义 API 响应的结构。

## 模块结构

*   **`handler.go`**：定义 `Handler` 结构体及其处理 HTTP 请求（例如 `Create`、`GetByID`、`Update`、`Delete`、`List`）的方法。它绑定请求体，解析参数，并调用相应的服务方法。
*   **`repository.go`**：定义 `Repository` 接口及其 `repository` 实现。该层负责使用 GORM 进行直接的数据库交互，包括创建、检索、更新和删除实体。
*   **`responder.go`**：定义 `Responder` 接口，该接口指定了发送标准化 HTTP 成功、错误和未找到响应的方法。这允许在整个应用程序中灵活地格式化响应。
*   **`service.go`**：定义 `Service` 结构体及其方法。该层封装了业务逻辑，并充当处理器和仓库之间的中介。它调用仓库方法来执行数据操作。

## 用法

### 1. 定义你的模型

```go
type User struct {
    gorm.Model
    Name  string
    Email string
}
```

### 2. 实现 Responder 接口

创建一个实现 `crud.Responder` 接口的自定义响应器，以定义你的 API 响应的格式。

```go
package response

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type APIResponder struct{}

func (r *APIResponder) Success(c *gin.Context, statusCode int, data any) {
	c.JSON(statusCode, gin.H{"data": data, "message": "success"})
}

func (r *APIResponder) Error(c *gin.Context, statusCode int, message string) {
	c.JSON(statusCode, gin.H{"error": message})
}

func (r *APIResponder) NotFound(c *gin.Context, message string) {
	c.JSON(http.StatusNotFound, gin.H{"error": message})
}
```

### 3. 初始化 CRUD 组件

在你的应用程序设置中（例如，在你的路由或主函数中），为你的模型初始化仓库、服务和处理器。

```go
package main

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"admingo/pkg/crud"
	"admingo/internal/modules/rbac/model" // 假设你的模型在这里
	"admingo/internal/pkg/response" // 假设你的响应器在这里
)

func SetupUserRoutes(router *gin.Engine, db *gorm.DB) {
	userRepo := crud.NewRepository[model.User](db)
	userService := crud.NewService[model.User](userRepo)
	userResponder := &response.APIResponder{} // 你的自定义响应器
	userHandler := crud.NewHandler[model.User](userService, userResponder)

	userRoutes := router.Group("/users")
	{
		userRoutes.POST("/", userHandler.Create)
		userRoutes.GET("/:id", userHandler.GetByID)
		userRoutes.PUT("/:id", userHandler.Update)
		userRoutes.DELETE("/:id", userHandler.Delete)
		userRoutes.GET("/", userHandler.List)
	}
}
```

### 4. 注册路由

将路由注册到你的 Gin 路由器中。

```go
package main

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func main() {
	router := gin.Default()
	// 初始化你的数据库连接
	db := // ... 你的 gorm.DB 实例

	SetupUserRoutes(router, db)

	router.Run(":8080")
}
```
