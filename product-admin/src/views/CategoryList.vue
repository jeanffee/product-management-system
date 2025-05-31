<template>
  <div class="category-list">
    <div class="page-header">
      <h2>商品分类管理</h2>
      <a-button type="primary" @click="showAddModal">
        <plus-outlined />
        添加分类
      </a-button>
    </div>

    <a-table
      :columns="columns"
      :data-source="categories"
      :loading="loading"
      row-key="id"
      :pagination="false"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'created_at'">
          {{ formatDate(record.created_at) }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space>
            <a-button size="small" @click="showEditModal(record)">
              <edit-outlined />
              编辑
            </a-button>
            <a-popconfirm
              title="确定要删除此分类吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="deleteCategory(record.id)"
            >
              <a-button size="small" danger>
                <delete-outlined />
                删除
              </a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- 添加/编辑分类模态框 -->
    <a-modal
      v-model:open="modalVisible"
      :title="isEdit ? '编辑分类' : '添加分类'"
      ok-text="确定"
      cancel-text="取消"
      @ok="handleSubmit"
      @cancel="resetForm"
    >
      <a-form
        ref="formRef"
        :model="form"
        :rules="rules"
        layout="vertical"
      >
        <a-form-item label="分类名称" name="name">
          <a-input v-model:value="form.name" placeholder="请输入分类名称" />
        </a-form-item>
        <a-form-item label="分类描述" name="description">
          <a-textarea
            v-model:value="form.description"
            placeholder="请输入分类描述（可选）"
            :rows="3"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined 
} from '@ant-design/icons-vue'
import api from '../services/api.js'

// 响应式数据
const loading = ref(false)
const categories = ref([])
const modalVisible = ref(false)
const isEdit = ref(false)
const formRef = ref()

// 表单数据
const form = reactive({
  id: null,
  name: '',
  description: ''
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 1, max: 50, message: '分类名称长度在1-50个字符', trigger: 'blur' }
  ]
}

// 表格列配置
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80
  },
  {
    title: '分类名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description'
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    key: 'created_at',
    width: 180
  },
  {
    title: '操作',
    key: 'action',
    width: 150
  }
]

// 获取分类列表
const fetchCategories = async () => {
  try {
    loading.value = true
    const response = await api.get('/categories')
    categories.value = response.data
  } catch (error) {
    message.error('获取分类列表失败')
    console.error('获取分类列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 显示添加模态框
const showAddModal = () => {
  resetForm()
  isEdit.value = false
  modalVisible.value = true
}

// 显示编辑模态框
const showEditModal = (record) => {
  form.id = record.id
  form.name = record.name
  form.description = record.description || ''
  isEdit.value = true
  modalVisible.value = true
}

// 重置表单
const resetForm = () => {
  form.id = null
  form.name = ''
  form.description = ''
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    
    if (isEdit.value) {
      await updateCategory()
    } else {
      await createCategory()
    }
    
    modalVisible.value = false
    await fetchCategories()
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 创建分类
const createCategory = async () => {
  try {
    await api.post('/categories', {
      name: form.name,
      description: form.description
    })
    message.success('分类创建成功')
  } catch (error) {
    const errorMsg = error.response?.data?.message || '创建分类失败'
    message.error(errorMsg)
    throw error
  }
}

// 更新分类
const updateCategory = async () => {
  try {
    await api.put(`/categories/${form.id}`, {
      name: form.name,
      description: form.description
    })
    message.success('分类更新成功')
  } catch (error) {
    const errorMsg = error.response?.data?.message || '更新分类失败'
    message.error(errorMsg)
    throw error
  }
}

// 删除分类
const deleteCategory = async (id) => {
  try {
    await api.delete(`/categories/${id}`)
    message.success('分类删除成功')
    await fetchCategories()
  } catch (error) {
    const errorMsg = error.response?.data?.message || '删除分类失败'
    message.error(errorMsg)
  }
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 组件挂载时获取数据
onMounted(() => {
  fetchCategories()
})
</script>

<style scoped>
.category-list {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  color: #333;
}
</style>