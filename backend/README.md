# 商品管理系统后端

基于 Node.js + Express + SQLite 的轻量级后端API服务。

## 功能特性

- ✅ 商品增删改查 (CRUD)
- ✅ 分页查询支持
- ✅ 搜索功能 (商品名称、描述)
- ✅ 分类筛选
- ✅ SQLite 数据库
- ✅ CORS 跨域支持
- ✅ 错误处理
- ✅ 请求日志

## 技术栈

- **运行时**: Node.js (ES Modules)
- **框架**: Express.js
- **数据库**: SQLite3
- **其他**: CORS, Body-Parser

## 快速开始

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 初始化数据库

```bash
npm run init-db
```

### 3. 启动服务

```bash
# 开发模式 (热重载)
npm run dev

# 生产模式
npm start
```

服务将在 `http://localhost:3001` 启动

## API 接口

### 基础信息

- **基础URL**: `http://localhost:3001`
- **API前缀**: `/api`
- **数据格式**: JSON

### 商品接口

#### 1. 获取商品列表

```http
GET /api/products
```

**查询参数:**
- `page` (可选): 页码，默认 1
- `limit` (可选): 每页数量，默认 10
- `search` (可选): 搜索关键词
- `category` (可选): 分类筛选

**响应示例:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "iPhone 15 Pro",
      "description": "最新款苹果手机，配备A17芯片",
      "price": 7999.00,
      "category": "手机",
      "stock": 50,
      "image_url": "https://example.com/image.jpg",
      "created_at": "2024-01-01 12:00:00",
      "updated_at": "2024-01-01 12:00:00"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

#### 2. 获取单个商品

```http
GET /api/products/:id
```

#### 3. 创建商品

```http
POST /api/products
```

**请求体:**
```json
{
  "name": "商品名称",
  "description": "商品描述",
  "price": 999.99,
  "category": "分类",
  "stock": 100,
  "image_url": "图片URL"
}
```

#### 4. 更新商品

```http
PUT /api/products/:id
```

#### 5. 删除商品

```http
DELETE /api/products/:id
```

#### 6. 获取分类列表

```http
GET /api/products/categories/list
```

### 系统接口

#### 健康检查

```http
GET /health
```

#### API 信息

```http
GET /
```

## 数据库结构

### products 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键，自增 |
| name | TEXT | 商品名称 (必填) |
| description | TEXT | 商品描述 |
| price | DECIMAL(10,2) | 价格 (必填) |
| category | TEXT | 分类 |
| stock | INTEGER | 库存，默认 0 |
| image_url | TEXT | 图片URL |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

## 错误处理

所有API响应都包含 `success` 字段：

**成功响应:**
```json
{
  "success": true,
  "data": {},
  "message": "操作成功"
}
```

**错误响应:**
```json
{
  "success": false,
  "message": "错误信息",
  "error": "详细错误 (开发模式)"
}
```

## 开发说明

### 项目结构

```
backend/
├── package.json          # 项目配置
├── server.js             # 服务器入口
├── database.js           # 数据库连接
├── init-db.js            # 数据库初始化
├── database.db           # SQLite数据库文件
├── routes/
│   └── products.js       # 商品路由
└── README.md
```

### 环境变量

- `PORT`: 服务端口，默认 3001
- `NODE_ENV`: 环境模式 (development/production)

### 开发工具

- 使用 `nodemon` 进行热重载
- ES Modules 支持
- 详细的错误日志

## 部署

### 生产环境部署

1. 设置环境变量:
```bash
export NODE_ENV=production
export PORT=3001
```

2. 启动服务:
```bash
npm start
```

### Docker 部署 (可选)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 注意事项

1. SQLite数据库文件会在项目根目录自动创建
2. 首次运行请务必执行 `npm run init-db` 初始化数据库
3. 开发时确保前端运行在 `http://localhost:5173`
4. 生产环境请修改 CORS 配置

## 许可证

MIT License 