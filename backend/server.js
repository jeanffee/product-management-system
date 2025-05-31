import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import productsRouter from './routes/products.js';
import uploadRouter from './routes/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件配置
app.use(cors({
  origin: (origin, callback) => {
    // 允许没有origin的请求（如移动端或Postman）
    if (!origin) return callback(null, true);
    
    // 允许localhost的所有端口
    if (origin.match(/^http:\/\/localhost:\d+$/) || 
        origin.match(/^http:\/\/127\.0\.0\.1:\d+$/)) {
      return callback(null, true);
    }
    
    // 允许特定的域名
    const allowedOrigins = ['http://localhost:3000'];
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 静态文件服务 - 用于提供上传的图片
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 根路径
app.get('/', (req, res) => {
  res.json({
    message: '商品管理系统 API',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      categories: '/api/products/categories/list',
      upload: '/api/upload/image'
    },
    status: 'running'
  });
});

// API 路由
app.use('/api/products', productsRouter);
app.use('/api/upload', uploadRouter);

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在',
    path: req.originalUrl
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : '请联系管理员'
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log('🚀 服务器启动成功!');
  console.log(`📍 服务地址: http://localhost:${PORT}`);
  console.log(`📖 API文档: http://localhost:${PORT}/`);
  console.log('🛠️  开发模式: 支持热重载');
  console.log('-----------------------------------');
}); 