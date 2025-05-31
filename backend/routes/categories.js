import express from 'express';
import { dbAll, dbRun, dbGet } from '../database.js';

const router = express.Router();

// 获取所有分类
router.get('/', async (req, res) => {
  try {
    const categories = await dbAll('SELECT * FROM categories ORDER BY created_at DESC');

    res.json({
      success: true,
      data: categories
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

// 根据ID获取单个分类
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const category = await dbGet('SELECT * FROM categories WHERE id = ?', [id]);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: '分类不存在'
      });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('获取分类详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取分类详情失败',
      error: error.message
    });
  }
});

// 创建新分类
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;

    // 基本验证
    if (!name) {
      return res.status(400).json({
        success: false,
        message: '分类名称为必填项'
      });
    }

    // 检查分类名称是否已存在
    const existingCategory = await dbGet('SELECT * FROM categories WHERE name = ?', [name]);
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: '分类名称已存在'
      });
    }

    const sql = `
      INSERT INTO categories (name, description)
      VALUES (?, ?)
    `;

    const result = await dbRun(sql, [name, description || '']);

    // 获取新创建的分类
    const newCategory = await dbGet('SELECT * FROM categories WHERE id = ?', [result.lastID]);

    res.status(201).json({
      success: true,
      message: '分类创建成功',
      data: newCategory
    });
  } catch (error) {
    console.error('创建分类失败:', error);
    res.status(500).json({
      success: false,
      message: '创建分类失败',
      error: error.message
    });
  }
});

// 更新分类
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // 检查分类是否存在
    const existingCategory = await dbGet('SELECT * FROM categories WHERE id = ?', [id]);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: '分类不存在'
      });
    }

    // 基本验证
    if (name !== undefined && !name) {
      return res.status(400).json({
        success: false,
        message: '分类名称不能为空'
      });
    }

    // 检查分类名称是否已被其他分类使用
    if (name !== undefined && name !== existingCategory.name) {
      const duplicateCategory = await dbGet('SELECT * FROM categories WHERE name = ? AND id != ?', [name, id]);
      if (duplicateCategory) {
        return res.status(400).json({
          success: false,
          message: '分类名称已存在'
        });
      }
    }

    const sql = `
      UPDATE categories 
      SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await dbRun(sql, [
      name !== undefined ? name : existingCategory.name,
      description !== undefined ? description : existingCategory.description,
      id
    ]);

    // 获取更新后的分类
    const updatedCategory = await dbGet('SELECT * FROM categories WHERE id = ?', [id]);

    res.json({
      success: true,
      message: '分类更新成功',
      data: updatedCategory
    });
  } catch (error) {
    console.error('更新分类失败:', error);
    res.status(500).json({
      success: false,
      message: '更新分类失败',
      error: error.message
    });
  }
});

// 删除分类
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // 检查分类是否存在
    const existingCategory = await dbGet('SELECT * FROM categories WHERE id = ?', [id]);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: '分类不存在'
      });
    }

    // 检查是否有商品使用该分类
    const productsUsingCategory = await dbGet(
      'SELECT COUNT(*) as count FROM products WHERE category = ?',
      [existingCategory.name]
    );

    if (productsUsingCategory.count > 0) {
      return res.status(400).json({
        success: false,
        message: `无法删除分类，有 ${productsUsingCategory.count} 个商品正在使用该分类`
      });
    }

    await dbRun('DELETE FROM categories WHERE id = ?', [id]);

    res.json({
      success: true,
      message: '分类删除成功'
    });
  } catch (error) {
    console.error('删除分类失败:', error);
    res.status(500).json({
      success: false,
      message: '删除分类失败',
      error: error.message
    });
  }
});

export default router;