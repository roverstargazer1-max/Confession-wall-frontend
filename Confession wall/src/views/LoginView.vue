<!-- ckl你来写 -->
<!-- ckl你来写 -->
<!-- ckl你来写 -->
<!-- 收到！保证完成任务！ -->
<!-- 收到！保证完成任务！ -->
<!-- 收到！保证完成任务！ -->


<template>
  <div class="login-container">
    <el-card class="login-card" shadow="hover">
      <div class="login-header">
        <h2>校园表白墙</h2>
        <p>全舰火力全开 Feuer</p>
      </div>
      
      <el-form 
        ref="loginFormRef" 
        :model="loginForm" 
        :rules="loginRules" 
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input 
            v-model="loginForm.username" 
            placeholder="请输入账号" 
            prefix-icon="User"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input 
            v-model="loginForm.password" 
            type="password" 
            placeholder="请输入密码" 
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        
        <el-form-item class="form-actions">
          <el-button 
            type="primary" 
            class="login-btn" 
            @click="handleLogin"
            round
          >
            登录
          </el-button>
        </el-form-item>
        
        <div class="link-group">
          <router-link to="/register" class="link">注册账号</router-link>
          <router-link to="/forgot-password" class="link">忘记密码</router-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login } from '@/api/user' // 后续创建的API请求

// 表单引用
const loginFormRef = ref()

// 路由实例
const router = useRouter()

// 表单数据
const loginForm = reactive({
  username: '',
  password: ''
})

// 表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 4, max: 16, message: '账号长度在4-16个字符之间', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' }
  ]
}

// 登录处理
const handleLogin = async () => {
  // 表单验证
  const valid = await loginFormRef.value.validate()
  if (!valid) return
  
  try {
    // 调用登录API
    const response = await login(loginForm)
    const { token, userInfo } = response.data
    
    // 存储登录状态
    localStorage.setItem('token', token)
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
    
    ElMessage.success('登录成功')
    router.push('/home') // 跳转首页
  } catch (error) {
    ElMessage.error('账号或密码错误')
  }
}
</script>

<style scoped lang="scss">
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.login-card {
  width: 400px;
  padding: 30px;
  border-radius: 12px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
  h2 {
    color: #303133;
    margin-bottom: 10px;
  }
  p {
    color: #606266;
    font-size: 14px;
  }
}

.login-form {
  .el-form-item {
    margin-bottom: 20px;
  }
}

.login-btn {
  width: 100%;
  padding: 12px 0;
  font-size: 16px;
}

.link-group {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  .link {
    color: #409eff;
    text-decoration: none;
    font-size: 14px;
    &:hover {
      color: #66b1ff;
    }
  }
}
</style>