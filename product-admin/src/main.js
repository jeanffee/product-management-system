import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd, { ConfigProvider, theme } from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import * as Icons from '@ant-design/icons-vue'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// 注册所有图标
for (const [key, component] of Object.entries(Icons)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)
app.use(Antd)

// app.component(ConfigProvider.name, ConfigProvider) // No longer needed here

app.mount('#app')
