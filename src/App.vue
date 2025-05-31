<template>
  <a-layout class="layout">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo" />
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="inline"
      >
        <a-menu-item key="1">
          <shopping-outlined />
          <span>商品列表</span>
        </a-menu-item>
        <a-menu-item key="2">
          <plus-outlined />
          <span>添加商品</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <a-row justify="end" align="middle" style="height: 100%; padding-right: 24px">
          <a-avatar style="background-color: #87d068">管理员</a-avatar>
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
import { ref } from 'vue'
import { ShoppingOutlined, PlusOutlined } from '@ant-design/icons-vue'

const collapsed = ref(false)
const selectedKeys = ref(['1'])
</script>

<style>
.layout {
  min-height: 100vh;
}

.logo {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
}

.ant-layout-sider-trigger {
  background: #001529;
}

.site-layout .site-layout-background {
  background: #fff;
}
</style> 