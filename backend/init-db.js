import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new sqlite3.Database(join(__dirname, 'database.db'));

// 创建产品表
const createProductsTable = `
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category TEXT,
    stock INTEGER DEFAULT 0,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

// 创建分类表
const createCategoriesTable = `
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

// 插入示例分类数据
const insertSampleCategories = `
  INSERT OR IGNORE INTO categories (id, name, description) VALUES
  (1, '手机', '智能手机和相关配件'),
  (2, '电脑', '笔记本电脑、台式机等'),
  (3, '音频', '耳机、音箱等音频设备'),
  (4, '平板', '平板电脑和相关配件'),
  (5, '穿戴设备', '智能手表、手环等穿戴设备'),
  (6, '家电', '家用电器、智能家居设备'),
  (7, '数码配件', '充电器、数据线、保护壳等'),
  (8, '游戏', '游戏机、游戏手柄、游戏软件'),
  (9, '摄影', '相机、镜头、三脚架等摄影器材'),
  (10, '运动健康', '运动手环、体重秤、按摩器等')
`;

// 插入示例产品数据
const insertSampleProducts = `
  INSERT OR IGNORE INTO products (id, name, description, price, category, stock, image_url) VALUES
  (1, 'iPhone 15 Pro', '最新款苹果手机，配备A17芯片', 7999.00, '手机', 50, 'https://via.placeholder.com/300x300?text=iPhone+15+Pro'),
  (2, 'MacBook Air M2', '轻薄笔记本电脑，适合办公和学习', 8999.00, '电脑', 30, 'https://via.placeholder.com/300x300?text=MacBook+Air'),
  (3, 'AirPods Pro', '主动降噪无线耳机', 1899.00, '音频', 100, 'https://via.placeholder.com/300x300?text=AirPods+Pro'),
  (4, 'iPad Air', '平板电脑，支持Apple Pencil', 4399.00, '平板', 25, 'https://via.placeholder.com/300x300?text=iPad+Air'),
  (5, 'Apple Watch', '智能手表，健康监测', 2999.00, '穿戴设备', 60, 'https://via.placeholder.com/300x300?text=Apple+Watch')
`;

db.serialize(() => {
  // 创建分类表
  db.run(createCategoriesTable, (err) => {
    if (err) {
      console.error('创建分类表失败:', err.message);
    } else {
      console.log('✅ 分类表创建成功');
    }
  });

  // 创建产品表
  db.run(createProductsTable, (err) => {
    if (err) {
      console.error('创建产品表失败:', err.message);
    } else {
      console.log('✅ 产品表创建成功');
    }
  });

  // 插入示例分类数据
  db.run(insertSampleCategories, (err) => {
    if (err) {
      console.error('插入示例分类数据失败:', err.message);
    } else {
      console.log('✅ 示例分类数据插入成功');
    }
  });

  // 插入示例产品数据
  db.run(insertSampleProducts, (err) => {
    if (err) {
      console.error('插入示例产品数据失败:', err.message);
    } else {
      console.log('✅ 示例产品数据插入成功');
    }
  });
});

db.close((err) => {
  if (err) {
    console.error('关闭数据库失败:', err.message);
  } else {
    console.log('✅ 数据库初始化完成');
  }
}); 