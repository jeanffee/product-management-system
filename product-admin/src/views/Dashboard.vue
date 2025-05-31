<template>
  <a-layout class="layout">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo" />
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="inline"
      >
        <a-menu-item key="/dashboard/product/list">
          <template #icon>
            <shopping-outlined />
          </template>
          <span>商品列表</span>
        </a-menu-item>
        <a-menu-item key="/dashboard/product/add">
          <template #icon>
            <plus-outlined />
          </template>
          <span>添加商品</span>
        </a-menu-item>
        <a-menu-item key="/dashboard/category/list">
          <template #icon>
            <tags-outlined />
          </template>
          <span>分类管理</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <a-row justify="space-between" align="middle" style="height: 100%; padding: 0 24px">
          <h2 style="margin: 0; color: green;">商品管理系统</h2>
          <a-space>
            <a-button type="text" @click="goToWelcome">
              <home-outlined />
              返回首页
            </a-button>
            <a-avatar style="background-color: #87d068">管理员</a-avatar>
          </a-space>
        </a-row>
      </a-layout-header>
      <a-layout-content style="margin: 24px 16px 0">
        <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
          <router-view></router-view>
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        Product Admin ©2024 Created by Vue3
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ShoppingOutlined, PlusOutlined, HomeOutlined, TagsOutlined } from '@ant-design/icons-vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const collapsed = ref(false)
const selectedKeys = ref([route.path])

// 监听路由变化，更新选中的菜单项
watch(() => route.path, (newPath) => {
  selectedKeys.value = [newPath]
})

// 监听菜单选中变化，进行路由跳转
watch(selectedKeys, (newKeys) => {
  if (newKeys && newKeys[0]) {
    router.push(newKeys[0])
  }
})

const goToWelcome = () => {
  router.push('/')
}
</script>

<style scoped>
.layout {
  min-height: 100vh;
  height: 100vh;
  overflow: hidden;
}

.ant-layout {
  height: 100%;
}

.ant-layout-content {
  overflow-y: auto;
  height: calc(100vh - 64px - 70px); /* 减去header高度和footer高度 */
}

.logo {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
}

.ant-layout-sider-trigger {
  background: #001529;
}
</style> 