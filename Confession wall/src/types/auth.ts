// 登录表单数据类型
export interface LoginFormData {
  username: string;
  password: string;
  remember: boolean;
}

// 登录响应数据类型
export interface LoginResponse {
  code: number;
  message: string;
  data: {
    token: string;
    userInfo: {
      id: number;
      username: string;
      nickname: string;
      avatar: string;
    }
  }
}