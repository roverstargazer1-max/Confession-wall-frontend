<template>
  <div class="login-container">
    <el-card class="login-card" shadow="hover">
      <div class="login-header">
        <h2>JM表白墙</h2>
        <p>战舰俾斯麦 开辟未来！</p>
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
          <!-- @click="handleLogin" -->
          <el-button 
            type="primary" 
            class="login-btn" 
            round
            @click="handleLogin"
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
import { loginApi } from '@/api/users' 
import { ElMessage } from 'element-plus'
// 创建了 Pinia store
import { useUserStore } from '@/stores/user' 

// 表单引用
const loginFormRef = ref()

// 路由实例
const router = useRouter()
// Pinia store 实例
const userStore = useUserStore()

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
    { min: 6, max:18 ,message: '密码长度6-18个字符', trigger: 'blur' }
  ]
}

// 登录处理 
const handleLogin = async () => {
  try{
    await loginFormRef.value.validate()
    
    try {
      const response = await loginApi(loginForm)

      if (response.data.code === 200 ) { 
        // 调用新的 action，直接传入后端返回的 data 对象
        userStore.setUserDataOnLogin(response.data)
        
        ElMessage.success('登录成功！')
        router.push('/home')
        console.log('user_id是',response.data.user_id)

      } 
      else {
        ElMessage.error(response.data.msg || '登录失败')
      }

    } catch (error) {
      ElMessage.error('账号或密码错误')
    }
  } catch(validationError){
    console.log('表单验证失败', validationError)
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