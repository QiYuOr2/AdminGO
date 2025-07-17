# AdminGO - 通用后台项目

```mermaid
graph TD
    subgraph CoreApplication ["核心应用层"]
        direction LR

        subgraph Framework ["通用框架层"]
            direction LR
            PkgCrud["通用CRUD框架 (pkg/crud)"]
        end

        subgraph BusinessLayers [" "]
            direction BT

            subgraph Presentation ["表示层"]
                subgraph PresentationEntry ["入口与路由"]
                    Router["Gin Router"]
                    Middlewares["通用中间件"]
                end
                subgraph PresentationHandlers ["API 处理器"]
                    CustomHandlers["定制业务处理器"]
                end
            end

            subgraph Business ["业务逻辑层"]
                CoreServices["核心业务服务"]
            end

            subgraph Data ["数据访问层"]
                    direction LR
                CustomRepos["定制业务仓库"]
                Gorm["GORM (ORM)"]
            end
        end

    end

    subgraph SharedModules ["共享基础模块"]
        direction LR
        Config["配置管理 (Viper)"]
        JWT["认证 (JWT)"]
        I18n["国际化 (i18n)"]
        CommonPkgs["公共包 (Response, Ecode, Utils)"]
    end

    %% Styling Definitions
    style Framework    fill:#e0e0e0,stroke:#666666,stroke-width:2px,stroke-dasharray: 5 5
    style Data         fill:#fff0e6,stroke:#ffad66,stroke-width:2px,stroke-dasharray: 5 5
    style Business     fill:#e6ffe6,stroke:#73d173,stroke-width:2px,stroke-dasharray: 5 5
    style Presentation fill:#e6f7ff,stroke:#85c5e3,stroke-width:2px,stroke-dasharray: 5 5
    style SharedModules fill:#f2f2f2,stroke:#b3b3b3,stroke-width:2px,stroke-dasharray: 5 5
```

## 技术选型

- 前端：React、TanStack、Shadcn
- 服务端：Gin、MySQL
- 文档搭建：  fumadocs（暂定

## 功能规划

- **MVP**
    - 服务端：用户权限；菜单；日志；文件上传；基础CRUD；多账号-邮箱验证码登录
    - 前端：后台管理模板（列表、表格、表单、状态页）
- **1.0.0 内容管理基础模块**
- **2.0.0 电商管理基础模块**
