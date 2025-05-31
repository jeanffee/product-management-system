# API 使用示例

## 前端调用示例

### 1. 获取商品列表

```javascript
// 获取所有商品
const getProducts = async (page = 1, limit = 10, search = '', category = '') => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(category && { category })
    });
    
    const response = await fetch(`http://localhost:3001/api/products?${params}`);
    const data = await response.json();
    
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('获取商品列表失败:', error);
    throw error;
  }
};
```

### 2. 获取单个商品

```javascript
const getProduct = async (id) => {
  try {
    const response = await fetch(`http://localhost:3001/api/products/${id}`);
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('获取商品详情失败:', error);
    throw error;
  }
};
```

### 3. 创建商品

```javascript
const createProduct = async (productData) => {
  try {
    const response = await fetch('http://localhost:3001/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('创建商品失败:', error);
    throw error;
  }
};

// 使用示例
const newProduct = {
  name: "新商品",
  description: "商品描述",
  price: 999.99,
  category: "电子产品",
  stock: 100,
  image_url: "https://example.com/image.jpg"
};

createProduct(newProduct);
```

### 4. 更新商品

```javascript
const updateProduct = async (id, productData) => {
  try {
    const response = await fetch(`http://localhost:3001/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('更新商品失败:', error);
    throw error;
  }
};
```

### 5. 删除商品

```javascript
const deleteProduct = async (id) => {
  try {
    const response = await fetch(`http://localhost:3001/api/products/${id}`, {
      method: 'DELETE'
    });
    
    const data = await response.json();
    
    if (data.success) {
      return true;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('删除商品失败:', error);
    throw error;
  }
};
```

### 6. 获取分类列表

```javascript
const getCategories = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/products/categories/list');
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('获取分类列表失败:', error);
    throw error;
  }
};
```

## Vue 3 + Composition API 示例

```vue
<template>
  <div>
    <h1>商品管理</h1>
    
    <!-- 搜索和筛选 -->
    <div class="filters">
      <input v-model="searchTerm" placeholder="搜索商品..." />
      <select v-model="selectedCategory">
        <option value="">所有分类</option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
    </div>
    
    <!-- 商品列表 -->
    <div class="products">
      <div v-for="product in products" :key="product.id" class="product-card">
        <h3>{{ product.name }}</h3>
        <p>{{ product.description }}</p>
        <p>价格: ¥{{ product.price }}</p>
        <p>库存: {{ product.stock }}</p>
        <button @click="editProduct(product)">编辑</button>
        <button @click="deleteProductHandler(product.id)">删除</button>
      </div>
    </div>
    
    <!-- 分页 -->
    <div class="pagination">
      <button @click="prevPage" :disabled="!pagination.hasPrev">上一页</button>
      <span>{{ pagination.page }} / {{ pagination.totalPages }}</span>
      <button @click="nextPage" :disabled="!pagination.hasNext">下一页</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'

const products = ref([])
const categories = ref([])
const searchTerm = ref('')
const selectedCategory = ref('')
const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNext: false,
  hasPrev: false
})

// API 调用函数
const fetchProducts = async () => {
  try {
    const params = new URLSearchParams({
      page: pagination.page.toString(),
      limit: pagination.limit.toString(),
      ...(searchTerm.value && { search: searchTerm.value }),
      ...(selectedCategory.value && { category: selectedCategory.value })
    })
    
    const response = await fetch(`http://localhost:3001/api/products?${params}`)
    const data = await response.json()
    
    if (data.success) {
      products.value = data.data
      Object.assign(pagination, data.pagination)
    }
  } catch (error) {
    console.error('获取商品失败:', error)
  }
}

const fetchCategories = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/products/categories/list')
    const data = await response.json()
    
    if (data.success) {
      categories.value = data.data
    }
  } catch (error) {
    console.error('获取分类失败:', error)
  }
}

const deleteProductHandler = async (id) => {
  if (confirm('确定要删除这个商品吗？')) {
    try {
      const response = await fetch(`http://localhost:3001/api/products/${id}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      
      if (data.success) {
        await fetchProducts()
      }
    } catch (error) {
      console.error('删除商品失败:', error)
    }
  }
}

const prevPage = () => {
  if (pagination.hasPrev) {
    pagination.page--
    fetchProducts()
  }
}

const nextPage = () => {
  if (pagination.hasNext) {
    pagination.page++
    fetchProducts()
  }
}

// 监听搜索和分类变化
watch([searchTerm, selectedCategory], () => {
  pagination.page = 1
  fetchProducts()
})

onMounted(() => {
  fetchProducts()
  fetchCategories()
})
</script>
```

## Axios 版本示例

如果您使用 Axios，可以这样配置：

```javascript
import axios from 'axios'

// 创建 axios 实例
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 响应拦截器
api.interceptors.response.use(
  response => {
    if (response.data.success) {
      return response.data
    } else {
      throw new Error(response.data.message)
    }
  },
  error => {
    console.error('API 请求失败:', error)
    throw error
  }
)

// API 方法
export const productAPI = {
  // 获取商品列表
  getProducts: (params) => api.get('/products', { params }),
  
  // 获取单个商品
  getProduct: (id) => api.get(`/products/${id}`),
  
  // 创建商品
  createProduct: (data) => api.post('/products', data),
  
  // 更新商品
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  
  // 删除商品
  deleteProduct: (id) => api.delete(`/products/${id}`),
  
  // 获取分类
  getCategories: () => api.get('/products/categories/list')
} 