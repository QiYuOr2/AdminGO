#!/usr/bin/env zx
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { ensureDirSync } from 'fs-extra'
import { argv, chalk } from 'zx'

// 从命令行参数获取模块名
const moduleName = argv._[0]

if (!moduleName) {
  console.error(chalk.red('错误：请输入模块名！'))
  console.log(chalk.yellow('用法: pnpm new:module <模块名>'))
  process.exit(1)
}

const lowerModuleName = moduleName.toLowerCase()
const upperModuleName = lowerModuleName.charAt(0).toUpperCase() + lowerModuleName.slice(1)

// 默认模块创建在 internal/modules 目录下
const modulePath = path.join(
  process.cwd(),
  'apps',
  'backend',
  'internal',
  'modules',
  lowerModuleName,
)

if (fs.existsSync(modulePath)) {
  console.error(chalk.red(`错误：模块目录 '${modulePath}' 已存在！`))
  process.exit(1)
}

console.log(chalk.blue(`正在创建模块 '${lowerModuleName}'...`))

// 创建目录结构
ensureDirSync(path.join(modulePath, 'handler'))
ensureDirSync(path.join(modulePath, 'model'))
ensureDirSync(path.join(modulePath, 'repository'))
ensureDirSync(path.join(modulePath, 'service'))

// --- 文件模板 ---

const templates = {
  // 主模块文件
  [`${lowerModuleName}.go`]: `
package ${lowerModuleName}

import (
  "admingo/internal/modules/${lowerModuleName}/handler"
  "admingo/internal/modules/${lowerModuleName}/repository"
  "admingo/internal/modules/${lowerModuleName}/service"
  "admingo/pkg/crud"

  "gorm.io/gorm"
)

type Handler = handler.${upperModuleName}Handler
type Service = service.${upperModuleName}Service
type Repository = repository.${upperModuleName}Repository

func New${upperModuleName}Repository(db *gorm.DB) *Repository {
  return repository.New(db)
}

func New${upperModuleName}Service(repo *Repository) *Service {
  return service.New(repo)
}

func New${upperModuleName}Handler(service *Service, responder crud.Responder) *Handler {
  return handler.New(service, responder)
}
  `,
  // Model
  [`model/${lowerModuleName}.go`]: `
package model

import "gorm.io/gorm"

type ${upperModuleName} struct {
  gorm.Model
  // 在这里定义你的模型字段
}
  `,
  // Handler
  [`handler/${lowerModuleName}.go`]: `
package handler

import (
  "admingo/internal/modules/${lowerModuleName}/model"
  "admingo/internal/modules/${lowerModuleName}/service"
  "admingo/pkg/crud"
)

type ${upperModuleName}Handler struct {
  *crud.Handler[model.${upperModuleName}]
}

func New(service *service.${upperModuleName}Service, responder crud.Responder) *${upperModuleName}Handler {
  return &${upperModuleName}Handler{
    Handler: crud.NewHandler(service.CRUD(), responder),
  }
}
  `,
  // Service
  [`service/${lowerModuleName}.go`]: `
package service

import (
  "admingo/internal/modules/${lowerModuleName}/model"
  "admingo/internal/modules/${lowerModuleName}/repository"
  "admingo/pkg/crud"
)

type ${upperModuleName}Service struct {
  *crud.Service[model.${upperModuleName}]
}

func New(repo *repository.${upperModuleName}Repository) *${upperModuleName}Service {
  return &${upperModuleName}Service{
    Service: crud.NewService(repo),
  }
}

func (s *${upperModuleName}Service) CRUD() *crud.Service[model.${upperModuleName}] {
  return s.Service
}
  `,
  // Repository
  [`repository/${lowerModuleName}.go`]: `
package repository

import (
  "admingo/internal/modules/${lowerModuleName}/model"
  "admingo/pkg/crud"

  "gorm.io/gorm"
)

type ${upperModuleName}Repository struct {
  crud.Repository[model.${upperModuleName}]
}

func New(db *gorm.DB) *${upperModuleName}Repository {
  return &${upperModuleName}Repository{
    Repository: crud.NewRepository[model.${upperModuleName}](db),
  }
}
  `,
}

// 写入文件
for (const [filePath, content] of Object.entries(templates)) {
  const fullPath = path.join(modulePath, filePath)
  fs.writeFileSync(fullPath, content.trim())
}

console.log(chalk.green(`✅ 模块 '${lowerModuleName}' 已成功创建于: ${modulePath}`))
