import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL:"http://127.0.0.1:4523/m1/7135936-6859037-default", // 后端接口地址
  timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 添加token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    ElMessage.error('请求出错')
    return Promise.reject(error)
  }
)

export default request