import express from 'express';
import { dbAll, dbRun, dbGet } from '../database.js';

const router = express.Router();

// 获取所有商品 (支持分页和搜索)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', category = '' } = req.query;
    const offset = (page - 1) * limit;

    let sql = 'SELECT * FROM products WHERE 1=1';
    let countSql = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
    const params = [];
    const countParams = [];

    // 搜索条件
    if (search) {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      countSql += ' AND (name LIKE ? OR description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
      countParams.push(searchTerm, searchTerm);
    }

    // 分类筛选
    if (category) {
      sql += ' AND category = ?';
      countSql += ' AND category = ?';
      params.push(category);
      countParams.push(category);
    }

    // 排序和分页
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [products, totalResult] = await Promise.all([
      dbAll(sql, params),
      dbGet(countSql, countParams)
    ]);

    const total = totalResult.total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('获取商品列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取商品列表失败',
      error: error.message
    });
  }
});

// 根据ID获取单个商品
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await dbGet('SELECT * FROM products WHERE id = ?', [id]);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: '商品不存在'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('获取商品详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取商品详情失败',
      error: error.message
    });
  }
});

// 创建新商品
router.post('/', async (req, res) => {
  try {
    const { name, description, price, category, stock, image_url } = req.body;

    // 基本验证
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: '商品名称和价格为必填项'
      });
    }

    if (price <= 0) {
      return res.status(400).json({
        success: false,
        message: '价格必须大于0'
      });
    }

    const sql = `
      INSERT INTO products (name, description, price, category, stock, image_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const result = await dbRun(sql, [
      name,
      description || '',
      parseFloat(price),
      category || '',
      parseInt(stock) || 0,
      image_url || ''
    ]);

    // 获取新创建的商品
    const newProduct = await dbGet('SELECT * FROM products WHERE id = ?', [result.lastID]);

    res.status(201).json({
      success: true,
      message: '商品创建成功',
      data: newProduct
    });
  } catch (error) {
    console.error('创建商品失败:', error);
    res.status(500).json({
      success: false,
      message: '创建商品失败',
      error: error.message
    });
  }
});

// 更新商品
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, stock, image_url } = req.body;

    // 检查商品是否存在
    const existingProduct = await dbGet('SELECT * FROM products WHERE id = ?', [id]);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: '商品不存在'
      });
    }

    // 基本验证
    if (name !== undefined && !name) {
      return res.status(400).json({
        success: false,
        message: '商品名称不能为空'
      });
    }

    if (price !== undefined && price <= 0) {
      return res.status(400).json({
        success: false,
        message: '价格必须大于0'
      });
    }

    const sql = `
      UPDATE products 
      SET name = ?, description = ?, price = ?, category = ?, stock = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await dbRun(sql, [
      name !== undefined ? name : existingProduct.name,
      description !== undefined ? description : existingProduct.description,
      price !== undefined ? parseFloat(price) : existingProduct.price,
      category !== undefined ? category : existingProduct.category,
      stock !== undefined ? parseInt(stock) : existingProduct.stock,
      image_url !== undefined ? image_url : existingProduct.image_url,
      id
    ]);

    // 获取更新后的商品
    const updatedProduct = await dbGet('SELECT * FROM products WHERE id = ?', [id]);

    res.json({
      success: true,
      message: '商品更新成功',
      data: updatedProduct
    });
  } catch (error) {
    console.error('更新商品失败:', error);
    res.status(500).json({
      success: false,
      message: '更新商品失败',
      error: error.message
    });
  }
});

// 删除商品
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // 检查商品是否存在
    const existingProduct = await dbGet('SELECT * FROM products WHERE id = ?', [id]);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: '商品不存在'
      });
    }

    await dbRun('DELETE FROM products WHERE id = ?', [id]);

    res.json({
      success: true,
      message: '商品删除成功'
    });
  } catch (error) {
    console.error('删除商品失败:', error);
    res.status(500).json({
      success: false,
      message: '删除商品失败',
      error: error.message
    });
  }
});

// 获取所有分类
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await dbAll(
      'SELECT DISTINCT category FROM products WHERE category IS NOT NULL AND category != "" ORDER BY category'
    );

    res.json({
      success: true,
      data: categories.map(item => item.category)
    });
  } catch (error) {
    console.error('获取分类列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取分类列表失败',
      error: error.message
    });
  }
});

export default router; 