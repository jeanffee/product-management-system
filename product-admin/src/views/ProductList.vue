<template>
  <div class="product-list">
    <a-card title="商品列表" :bordered="false">
      <template #extra>
        <a-space>
          <a-input-search
            v-model:value="searchKeyword"
            placeholder="搜索商品..."
            style="width: 120px"
            @search="handleSearch"
            allow-clear
          />
          <a-select
            v-model:value="selectedCategory"
            placeholder="选择分类"
            style="width: 120px"
            @change="handleCategoryChange"
            allow-clear
          >
            <a-select-option value="">全部分类</a-select-option>
            <a-select-option 
              v-for="category in categories" 
              :key="category" 
              :value="category"
            >
              {{ category }}
            </a-select-option>
          </a-select>
          <a-tooltip title="添加商品">
            <a-button type="primary" @click="handleAdd">
              <plus-outlined />
            </a-button>
          </a-tooltip>
        </a-space>
      </template>
      
      <a-list
        :loading="loading"
        :data-source="products"
        :pagination="{
          current: pagination.page,
          pageSize: pagination.limit,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          onChange: handlePageChange,
          onShowSizeChange: handlePageSizeChange
        }"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <a-card hoverable class="product-card">
              <div class="product-content">
                <div class="product-image">
                  <a-image
                    :width="80"
                    :height="80"
                    :src="item.image_url || 'https://via.placeholder.com/80x80?text=No+Image'"
                    :fallback="'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yNCAzMkw0MCAyNEw1NiAzMlY1NkgyNFYzMloiIGZpbGw9IiNEOUQ5RDkiLz4KPGNpcmNsZSBjeD0iMzIiIGN5PSI0MCIgcj0iNCIgZmlsbD0iI0Q5RDlEOSIvPgo8L3N2Zz4K'"
                    :preview="false"
                    style="object-fit: cover; border-radius: 8px;"
                  />
                </div>
                <div class="product-info">
                  <h3 class="product-name">{{ item.name }}</h3>
                  <div class="product-details">
                    <p><strong>价格:</strong> ¥{{ item.price }}</p>
                    <p><strong>库存:</strong> {{ item.stock }}</p>
                    <p><strong>分类:</strong> {{ item.category || '未分类' }}</p>
                    <p><strong>描述:</strong> {{ item.description || '暂无描述' }}</p>
                  </div>
                </div>
                <div class="product-actions">
                  <a-space direction="vertical" size="small">
                    <a-button type="primary" size="small" @click="handleEdit(item)">
                      编辑商品
                    </a-button>
                    <a-button 
                      type="default" 
                      danger 
                      size="small" 
                      @click="handleDelete(item)"
                      :loading="item.deleting"
                    >
                      删除商品
                    </a-button>
                  </a-space>
                </div>
              </div>
            </a-card>
          </a-list-item>
        </template>
      </a-list>
    </a-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { productAPI } from '../services/api.js'

const router = useRouter()
const loading = ref(false)
const products = ref([])
const categories = ref([])
const searchKeyword = ref('')
const selectedCategory = ref('')

const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNext: false,
  hasPrev: false
})

// 获取商品列表
const fetchProducts = async () => {
  try {
    loading.value = true
    const params = {
      page: pagination.page,
      limit: pagination.limit
    }
    
    if (searchKeyword.value) {
      params.search = searchKeyword.value
    }
    
    if (selectedCategory.value) {
      params.category = selectedCategory.value
    }

    const response = await productAPI.getProducts(params)
    products.value = response.data
    Object.assign(pagination, response.pagination)
  } catch (error) {
    message.error('获取商品列表失败: ' + error.message)
  } finally {
    loading.value = false
  }
}

// 获取分类列表
const fetchCategories = async () => {
  try {
    const categoryList = await productAPI.getCategories()
    categories.value = categoryList
  } catch (error) {
    message.error('获取分类列表失败: ' + error.message)
  }
}

// 搜索处理
const handleSearch = () => {
  pagination.page = 1
  fetchProducts()
}

// 分类筛选处理
const handleCategoryChange = () => {
  pagination.page = 1
  fetchProducts()
}

// 分页处理
const handlePageChange = (page, pageSize) => {
  pagination.page = page
  pagination.limit = pageSize
  fetchProducts()
}

const handlePageSizeChange = (current, size) => {
  pagination.page = 1
  pagination.limit = size
  fetchProducts()
}

// 添加商品
const handleAdd = () => {
  router.push('/dashboard/product/add')
}

// 编辑商品
const handleEdit = (record) => {
  router.push(`/dashboard/product/edit/${record.id}`)
}

// 删除商品
const handleDelete = (record) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除商品 "${record.name}" 吗？此操作不可撤销。`,
    okText: '确定',
    cancelText: '取消',
    okType: 'danger',
    onOk: async () => {
      try {
        // 设置删除状态
        record.deleting = true
        await productAPI.deleteProduct(record.id)
        message.success('删除成功')
        // 重新获取列表
        await fetchProducts()
      } catch (error) {
        message.error('删除失败: ' + error.message)
      } finally {
        record.deleting = false
      }
    }
  })
}

onMounted(() => {
  fetchProducts()
  fetchCategories()
})
</script>

<style scoped>
.product-list {
  animation: fadeIn 0.3s ease-in-out;
}

.product-card {
  margin-bottom: 16px;
}

.product-content {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.product-image {
  flex-shrink: 0;
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-name {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1890ff;
}

.product-details p {
  margin: 4px 0;
  color: #666;
}

.product-actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 