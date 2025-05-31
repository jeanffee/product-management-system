<template>
  <div class="product-form">
    <a-card :title="isEdit ? '编辑商品' : '添加商品'" :bordered="false">
      <a-form
        :model="formState"
        :rules="rules"
        ref="formRef"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 14 }"
      >
        <a-form-item label="商品名称" name="name">
          <a-input v-model:value="formState.name" placeholder="请输入商品名称" />
        </a-form-item>

        <a-form-item label="商品价格" name="price">
          <a-input-number
            v-model:value="formState.price"
            :min="0"
            :precision="2"
            style="width: 200px"
            placeholder="0.00"
          />
          <span style="margin-left: 8px">元</span>
        </a-form-item>

        <a-form-item label="库存数量" name="stock">
          <a-input-number
            v-model:value="formState.stock"
            :min="0"
            :precision="0"
            style="width: 200px"
            placeholder="0"
          />
          <span style="margin-left: 8px">件</span>
        </a-form-item>

        <a-form-item label="商品分类" name="category">
          <a-select
            v-model:value="formState.category"
            placeholder="选择或输入分类"
            style="width: 200px"
            :options="categoryOptions"
            show-search
            allow-clear
            :filter-option="false"
            @search="handleCategorySearch"
          >
            <template #notFoundContent>
              <div style="padding: 8px;">
                <span>输入新分类名称</span>
              </div>
            </template>
          </a-select>
        </a-form-item>

        <a-form-item label="商品图片" name="image_url">
          <a-space direction="vertical" style="width: 100%;">
            <a-upload
              v-model:file-list="fileList"
              name="image"
              list-type="picture-card"
              :show-upload-list="false"
              :customRequest="handleUpload"
              accept="image/*"
              :multiple="false"
              :max-count="1"
            >
              <div v-if="!formState.image_url">
                <plus-outlined />
                <div style="margin-top: 8px">上传图片</div>
              </div>
              <a-image
                v-else
                :width="102"
                :height="102"
                :src="formState.image_url"
                :preview="false"
                style="object-fit: cover;"
              />
            </a-upload>
            <a-input 
              v-model:value="formState.image_url" 
              placeholder="或输入图片URL地址"
              style="width: 400px"
            />
            <div v-if="formState.image_url" style="color: #666; font-size: 12px;">
              当前图片URL: {{ formState.image_url }}
            </div>
          </a-space>
        </a-form-item>

        <a-form-item label="商品描述" name="description">
          <a-textarea
            v-model:value="formState.description"
            :rows="4"
            placeholder="请输入商品描述"
          />
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 6 }">
          <a-space>
            <a-button type="primary" @click="onSubmit" :loading="submitLoading">
              {{ isEdit ? '更新' : '保存' }}
            </a-button>
            <a-button @click="onCancel">取消</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter, useRoute } from 'vue-router'
import { PlusOutlined } from '@ant-design/icons-vue'
import { productAPI } from '../services/api.js'
import api from '../services/api.js'

const router = useRouter()
const route = useRoute()
const formRef = ref()
const submitLoading = ref(false)
const fileList = ref([])
const isEdit = computed(() => !!route.params.id)

const formState = reactive({
  name: '',
  price: 0,
  stock: 0,
  category: '',
  image_url: '',
  description: ''
})

const rules = {
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  price: [
    { required: true, message: '请输入商品价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '价格不能小于0', trigger: 'blur' }
  ],
  stock: [
    { required: true, message: '请输入库存数量', trigger: 'blur' },
    { type: 'number', min: 0, message: '库存不能小于0', trigger: 'blur' }
  ],
  description: [{ required: true, message: '请输入商品描述', trigger: 'blur' }]
}

// 分类选项
const categories = ref([])
const categoryOptions = ref([])

// 获取分类列表
const fetchCategories = async () => {
  try {
    // 使用新的分类API获取数据
    const response = await api.get('/categories')
    const categoryList = response.data
    categories.value = categoryList.map(cat => cat.name)
    categoryOptions.value = categoryList.map(cat => ({
      label: cat.name,
      value: cat.name
    }))
  } catch (error) {
    message.error('获取分类列表失败: ' + error.message)
  }
}

// 分类搜索处理
const handleCategorySearch = (value) => {
  if (value) {
    // 如果输入的值不在现有分类中，添加到选项
    const exists = categories.value.includes(value)
    if (!exists) {
      categoryOptions.value = [
        { label: value, value: value },
        ...categories.value.map(cat => ({ label: cat, value: cat }))
      ]
    } else {
      categoryOptions.value = categories.value
        .filter(cat => cat.toLowerCase().includes(value.toLowerCase()))
        .map(cat => ({ label: cat, value: cat }))
    }
  } else {
    categoryOptions.value = categories.value.map(cat => ({
      label: cat,
      value: cat
    }))
  }
}

// 如果是编辑模式，获取商品详情
const fetchProductDetail = async () => {
  if (!isEdit.value) return
  
  try {
    const product = await productAPI.getProduct(route.params.id)
    Object.assign(formState, {
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category || '',
      image_url: product.image_url || '',
      description: product.description || ''
    })
  } catch (error) {
    message.error('获取商品详情失败: ' + error.message)
    router.push('/dashboard/product/list')
  }
}

const onSubmit = async () => {
  try {
    await formRef.value.validate()
    submitLoading.value = true

    const productData = {
      name: formState.name,
      price: Number(formState.price),
      stock: Number(formState.stock),
      category: formState.category || '',
      image_url: formState.image_url || '',
      description: formState.description || ''
    }

    if (isEdit.value) {
      // 更新商品
      await productAPI.updateProduct(route.params.id, productData)
      message.success('商品更新成功')
    } else {
      // 创建商品
      await productAPI.createProduct(productData)
      message.success('商品创建成功')
    }

    router.push('/dashboard/product/list')
  } catch (error) {
    if (error.errorFields) {
      // 表单验证错误
      message.error('请检查表单输入')
    } else {
      // API调用错误
      message.error((isEdit.value ? '更新' : '创建') + '失败: ' + error.message)
    }
  } finally {
    submitLoading.value = false
  }
}

const onCancel = () => {
  router.push('/dashboard/product/list')
}

// 自定义上传处理
const handleUpload = async (options) => {
  console.log('=== 开始上传处理 ===')
  console.log('上传选项:', options)
  
  const { file, onSuccess, onError, onProgress } = options
  
  console.log('文件信息:', {
    name: file.name,
    type: file.type,
    size: file.size
  })
  
  // 文件验证
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    console.error('文件类型错误:', file.type)
    message.error('只能上传图片文件!')
    onError && onError(new Error('只能上传图片文件!'))
    return
  }
  
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    console.error('文件大小超限:', file.size)
    message.error('图片大小不能超过2MB!')
    onError && onError(new Error('图片大小不能超过2MB!'))
    return
  }
  
  try {
    console.log('创建FormData...')
    const formData = new FormData()
    formData.append('image', file)
    
    console.log('发送上传请求到:', `http://localhost:3001/api/upload/image`)
    
    // 模拟进度
    onProgress && onProgress({ percent: 10 })
    
    const response = await productAPI.uploadImage(formData)
    console.log('收到服务器响应:', response)
    
    onProgress && onProgress({ percent: 100 })
    
    // 构建完整的图片URL
    const imageUrl = `http://localhost:3001${response.url}`
    console.log('设置图片URL:', imageUrl)
    
    // 更新表单状态
    formState.image_url = imageUrl
    console.log('formState.image_url 已更新为:', formState.image_url)
    
    message.success('图片上传成功!')
    
    // 通知组件上传成功
    onSuccess && onSuccess(response, file)
    
    console.log('=== 上传完成 ===')
  } catch (error) {
    console.error('=== 上传失败 ===')
    console.error('错误详情:', error)
    message.error('图片上传失败: ' + error.message)
    
    // 通知组件上传失败
    onError && onError(error)
  }
}

onMounted(() => {
  fetchCategories()
  if (isEdit.value) {
    fetchProductDetail()
  }
})
</script>

<style scoped>
.product-form {
  animation: slideIn 0.3s ease-in-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style> 