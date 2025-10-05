import axios from "axios";
import { ElMessage } from 'element-plus'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { useUserStore } from '@/stores/user' 

const request= axios.create({
  baseURL:"https://m1.apifoxmock.com/m1/7178788-6903177-default" 
})

// // export default request;
// //http://172.20.10.2:8080
// //https://m1.apifoxmock.com/m1/7178788-6903177-default
request.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 获取token，这里假设token存储在pinia的userStore中
    const userStore = useUserStore?.();
    const token = userStore?.token;
    
    if (token && config.headers) {
      config.headers['x-api-key'] = token;
    }
    
    // 如果是FormData，不设置Content-Type，让浏览器自动设置
    if (config.data instanceof FormData && config.headers) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    ElMessage.error('请求配置错误');
    return Promise.reject(error);
  }
);

// 响应拦截器 - 统一错误处理
request.interceptors.response.use(
  (response: AxiosResponse) => {
    // 根据你的后端API结构调整
    // 假设后端返回 { code: number, data: any, message: string }
    const { data } = response;
    
    if (data.code === 200 || data.code === 0) {
      return data; // 直接返回业务数据
    } else {
      ElMessage.error(data.message || '请求失败');
      return Promise.reject(new Error(data.message || '请求失败'));
    }
  },
  (error) => {
    // HTTP状态码错误处理
    const { status, data } = error.response || {};
    
    switch (status) {
      case 401:
        ElMessage.error('未授权，请重新登录');
        // 可以在这里跳转到登录页
        break;
      case 403:
        ElMessage.error('拒绝访问');
        break;
      case 404:
        ElMessage.error('请求地址不存在');
        break;
      case 500:
        ElMessage.error('服务器内部错误');
        break;
      default:
        ElMessage.error(data?.message || '网络错误');
    }
    
    return Promise.reject(error);
  }
);

export default request;