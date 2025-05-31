import { createRouter, createWebHistory } from 'vue-router'
import Welcome from '../views/Welcome.vue'
import Dashboard from '../views/Dashboard.vue'
import ProductList from '../views/ProductList.vue'
import ProductForm from '../views/ProductForm.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: Welcome
    },
    {
      path: '/dashboard',
      component: Dashboard,
      children: [
        {
          path: '',
          redirect: '/dashboard/product/list'
        },
        {
          path: 'product/list',
          name: 'product-list',
          component: ProductList
        },
        {
          path: 'product/add',
          name: 'product-add',
          component: ProductForm
        },
        {
          path: 'product/edit/:id',
          name: 'product-edit',
          component: ProductForm
        }
      ]
    }
  ]
})

export default router
