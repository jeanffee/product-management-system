<template>
  <div class="welcome-container">
    <div class="welcome-content">
      <div class="title-section">
        <h1 class="main-title">
          <span class="gradient-text">Product</span>
          <span class="highlight-text">Admin</span>
        </h1>
        <p class="subtitle">现代化商品管理系统</p>
        <div class="features">
          <div class="feature-item">
            <shopping-outlined class="feature-icon" />
            <span>商品管理</span>
          </div>
          <div class="feature-item">
            <bar-chart-outlined class="feature-icon" />
            <span>数据分析</span>
          </div>
          <div class="feature-item">
            <safety-certificate-outlined class="feature-icon" />
            <span>安全可靠</span>
          </div>
        </div>
      </div>
      
      <div class="button-section">
        <button class="enter-button" @click="enterApp">
          <span class="button-text">进入系统</span>
          <div class="button-particles">
            <div class="particle" v-for="i in 6" :key="i"></div>
          </div>
          <div class="button-glow"></div>
        </button>
        <p class="version-text">Version 1.0.0</p>
      </div>
    </div>
    
    <!-- 背景动画元素 -->
    <div class="bg-animation">
      <div class="floating-shape shape-1"></div>
      <div class="floating-shape shape-2"></div>
      <div class="floating-shape shape-3"></div>
      <div class="floating-shape shape-4"></div>
    </div>
  </div>
</template>

<script setup>
import { ShoppingOutlined, BarChartOutlined, SafetyCertificateOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const enterApp = () => {
  router.push('/dashboard')
}
</script>

<style scoped>
.welcome-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  font-family: 'Arial', sans-serif;
}

.welcome-content {
  text-align: center;
  z-index: 10;
  animation: fadeInUp 1s ease-out;
}

.title-section {
  margin-bottom: 60px;
}

.main-title {
  font-size: 4rem;
  font-weight: 700;
  margin: 0 0 20px 0;
  letter-spacing: -2px;
}

.gradient-text {
  background: linear-gradient(45deg, #ff6b6b, #feca57);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientShift 3s ease-in-out infinite;
}

.highlight-text {
  color: white;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
}

.subtitle {
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 40px 0;
  font-weight: 300;
}

.features {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 30px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  animation: slideInUp 1s ease-out;
}

.feature-item:nth-child(2) {
  animation-delay: 0.2s;
}

.feature-item:nth-child(3) {
  animation-delay: 0.4s;
}

.feature-icon {
  font-size: 1.5rem;
  color: #feca57;
}

.button-section {
  position: relative;
}

.enter-button {
  position: relative;
  padding: 18px 50px;
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
  border: none;
  border-radius: 50px;
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(255, 107, 107, 0.4);
  animation: pulse 2s infinite;
}

.enter-button:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(255, 107, 107, 0.6);
}

.enter-button:active {
  transform: translateY(-2px);
}

.button-text {
  position: relative;
  z-index: 3;
}

.button-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s;
}

.enter-button:hover .button-glow {
  transform: translateX(100%);
}

.button-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
  opacity: 0;
  animation: particleFloat 3s infinite;
}

.particle:nth-child(1) { top: 20%; left: 20%; animation-delay: 0s; }
.particle:nth-child(2) { top: 40%; left: 80%; animation-delay: 0.5s; }
.particle:nth-child(3) { top: 60%; left: 30%; animation-delay: 1s; }
.particle:nth-child(4) { top: 80%; left: 70%; animation-delay: 1.5s; }
.particle:nth-child(5) { top: 30%; left: 60%; animation-delay: 2s; }
.particle:nth-child(6) { top: 70%; left: 40%; animation-delay: 2.5s; }

.version-text {
  color: rgba(255, 255, 255, 0.6);
  margin-top: 30px;
  font-size: 0.9rem;
}

/* 背景动画 */
.bg-animation {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.floating-shape {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 100px;
  height: 100px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 10%;
  animation-delay: 2s;
}

.shape-3 {
  width: 80px;
  height: 80px;
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

.shape-4 {
  width: 120px;
  height: 120px;
  top: 10%;
  right: 30%;
  animation-delay: 1s;
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes gradientShift {
  0%, 100% {
    background: linear-gradient(45deg, #ff6b6b, #feca57);
    background-clip: text;
    -webkit-background-clip: text;
  }
  50% {
    background: linear-gradient(45deg, #feca57, #ff6b6b);
    background-clip: text;
    -webkit-background-clip: text;
  }
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 10px 30px rgba(255, 107, 107, 0.4);
  }
  50% {
    box-shadow: 0 10px 40px rgba(255, 107, 107, 0.6);
  }
}

@keyframes particleFloat {
  0%, 100% {
    opacity: 0;
    transform: translateY(0);
  }
  50% {
    opacity: 1;
    transform: translateY(-20px);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-30px) rotate(120deg);
  }
  66% {
    transform: translateY(-15px) rotate(240deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-title {
    font-size: 2.5rem;
  }
  
  .features {
    flex-direction: column;
    gap: 20px;
  }
  
  .enter-button {
    padding: 15px 40px;
    font-size: 1.1rem;
  }
}
</style> 