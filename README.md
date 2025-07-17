# AdminGO - 通用后台项目

```mermaid
graph TD
    subgraph " "
        direction TB

        %% Layer 1: Presentation
        subgraph Presentation ["表示层 (Presentation Layer)"]
            subgraph PresentationEntry ["入口与路由 (Entry & Routing)"]
                Router["Gin Router & Main Entrypoint"]
                Middlewares["通用中间件 (JWT, RBAC, etc.)"]
            end

            subgraph PresentationHandlers ["API 处理器 (API Handlers)"]
                CustomHandlers["定制业务处理器"]
                GenericCrudHandlers["通用CRUD处理器 (复用pkg/crud)"]
            end
        end

        %% Layer 2: Business Logic
        subgraph Business ["业务逻辑层 (Business Logic Layer)"]
            CoreServices["核心业务服务"]
            GenericCrudService["通用CRUD服务 (from pkg/crud)"]
        end

        %% Layer 3: Data Access
        subgraph Data ["数据访问层 (Data Access Layer)"]
            subgraph DataRepos ["数据仓库 (Repositories)"]
                CustomRepos["定制业务仓库"]
                GenericCrudRepo["通用CRUD仓库 (from pkg/crud)"]
            end
            Gorm["GORM (ORM)"]
        end

        %% Layer 4: Shared Modules
        subgraph Shared ["共享基础模块 (Shared Foundation Modules)"]
            PkgCrud["通用CRUD框架 (pkg/crud)"]
            Config["配置管理 (Viper)"]
            JWT["认证 (JWT)"]
            I18n["国际化 (i18n)"]
            CommonPkgs["公共包 (Response, Ecode, Utils)"]
        end
    end

    %% Styling Definitions
    style Presentation fill:#e6f7ff,stroke:#85c5e3,stroke-width:2px,stroke-dasharray: 5 5
    style Business     fill:#e6ffe6,stroke:#73d173,stroke-width:2px,stroke-dasharray: 5 5
    style Data         fill:#fff0e6,stroke:#ffad66,stroke-width:2px,stroke-dasharray: 5 5
    style Shared       fill:#f2f2f2,stroke:#b3b3b3,stroke-width:2px,stroke-dasharray: 5 5
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
