import axios from 'axios';
import type { LoginFormData, LoginResponse } from '@/types/auth';

// 创建axios实例
const service = axios.create({
  baseURL: "http://127.0.0.1:4523/m1/7135936-6859037-default",
  timeout: 5000
});

// 登录接口
export const login = (data: LoginFormData): Promise<LoginResponse> => {
  return service.post('/auth/login', data);
};

// 退出登录接口
export const logout = () => {
  return service.post('/auth/logout');
};

export default service;