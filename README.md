# 商品管理系统 (Product Management System)

一个现代化的全栈商品管理系统，使用 Vue.js 3 + Node.js + SQLite 构建。

## ✨ 功能特性

### 🎯 核心功能
- **商品管理**: 添加、编辑、删除、查看商品
- **图片上传**: 支持本地文件上传和URL输入
- **分类管理**: 商品分类筛选和搜索
- **响应式设计**: 适配各种屏幕尺寸

### 🛠️ 技术栈

#### 前端
- **Vue.js 3** - 渐进式JavaScript框架
- **Ant Design Vue** - 企业级UI组件库
- **Vue Router** - 官方路由管理器
- **Pinia** - 状态管理
- **Vite** - 现代化构建工具

#### 后端
- **Node.js** - JavaScript运行时
- **Express.js** - Web应用框架
- **SQLite** - 轻量级数据库
- **Multer** - 文件上传中间件

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装和运行

#### 1. 克隆项目
```bash
git clone https://github.com/YOUR_USERNAME/product-management-system.git
cd product-management-system
```

#### 2. 启动后端服务
```bash
cd backend
npm install
npm run init-db  # 初始化数据库
npm run dev      # 启动开发服务器
```
后端服务将在 http://localhost:3001 启动

#### 3. 启动前端应用
```bash
cd product-admin
npm install
npm run dev      # 启动开发服务器
```
前端应用将在 http://localhost:5173 启动

## 📁 项目结构

```
product-management-system/
├── backend/                 # 后端服务
│   ├── routes/             # API路由
│   ├── uploads/            # 上传文件存储
│   ├── database.js         # 数据库配置
│   ├── server.js           # 服务器入口
│   └── package.json
├── product-admin/          # 前端应用
│   ├── src/
│   │   ├── views/          # 页面组件
│   │   ├── services/       # API服务
│   │   ├── router/         # 路由配置
│   │   └── main.js         # 应用入口
│   └── package.json
└── README.md
```

## 🎮 使用说明

### 商品管理
1. **查看商品列表**: 访问主页面查看所有商品
2. **添加商品**: 点击"+"按钮添加新商品
3. **编辑商品**: 点击商品卡片上的"编辑"按钮
4. **删除商品**: 点击"删除"按钮（需确认）

### 图片上传
- **方式一**: 点击上传区域选择本地图片文件
- **方式二**: 直接输入图片URL地址
- **限制**: 支持常见图片格式，文件大小不超过2MB

### 搜索和筛选
- **搜索**: 在搜索框中输入商品名称或描述
- **分类筛选**: 使用下拉菜单按分类筛选商品

## 🔧 开发

### API接口
- `GET /api/products` - 获取商品列表
- `POST /api/products` - 创建商品
- `PUT /api/products/:id` - 更新商品
- `DELETE /api/products/:id` - 删除商品
- `POST /api/upload/image` - 上传图片

### 数据库结构
```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT,
  stock INTEGER DEFAULT 0,
  image_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🎨 界面预览

- **欢迎页面**: 现代化的渐变背景和动画效果
- **商品列表**: 卡片式布局，支持分页和搜索
- **商品表单**: 直观的表单设计，支持文件上传

## 📝 更新日志

### v1.0.0 (2024-05-31)
- ✅ 完成基础商品CRUD功能
- ✅ 实现图片上传功能
- ✅ 添加搜索和分类筛选
- ✅ 优化UI/UX设计
- ✅ 修复侧边栏滚动问题

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 👨‍💻 作者

Created with ❤️ by [Your Name] 