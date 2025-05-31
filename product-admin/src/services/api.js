// API 基础配置
const API_BASE_URL = 'http://localhost:3001/api'

// 通用请求方法
const request = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    if (!data.success) {
      throw new Error(data.message || '请求失败')
    }

    return data
  } catch (error) {
    console.error('API请求失败:', error)
    throw error
  }
}

// 商品相关API
export const productAPI = {
  // 获取商品列表
  getProducts: async (params = {}) => {
    const queryParams = new URLSearchParams()
    
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)
    if (params.search) queryParams.append('search', params.search)
    if (params.category) queryParams.append('category', params.category)

    const url = `/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return await request(url)
  },

  // 获取单个商品
  getProduct: async (id) => {
    const data = await request(`/products/${id}`)
    return data.data
  },

  // 创建商品
  createProduct: async (productData) => {
    const data = await request('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    })
    return data.data
  },

  // 更新商品
  updateProduct: async (id, productData) => {
    const data = await request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    })
    return data.data
  },

  // 删除商品
  deleteProduct: async (id) => {
    await request(`/products/${id}`, {
      method: 'DELETE'
    })
    return true
  },

  // 获取分类列表
  getCategories: async () => {
    const data = await request('/products/categories/list')
    return data.data
  },

  // 上传图片
  uploadImage: async (formData) => {
    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || '上传失败')
    }
    
    const data = await response.json()
    if (!data.success) {
      throw new Error(data.message || '上传失败')
    }
    
    return data.data
  }
}

// 默认导出
export default {
  product: productAPI
}