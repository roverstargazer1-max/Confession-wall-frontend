import request from '@/utils/request'

// 登录参数类型
export interface LoginParams {
  username: string
  password: string
}

// 登录接口
export const loginApi = (params: LoginParams) => {
  return request ({
    "headers":{
      "Content-Type": "application/json",
    } ,
    url: 'api/user/login',
    method: 'post',
    data: params
  })
}
// 定义 getUserInfoApi 的参数类型
export interface UserInfoParams {
  user_id: number;
}
// 刷新用户信息：
// 当用户进入“个人资料”页面 (ProfileView.vue) 时，您应该主动调用一次 fetchUserInfo。
// 这可以确保用户看到的是最新的信息，以防他们在其他设备上修改了资料。

// 持久化登录/会话恢复：
// 当用户关闭浏览器再重新打开时，由于您使用了 localStorage，用户的 token 还在。这时，
// 需要在应用初始化时（例如在 App.vue 或路由守卫中）检查是否存在 token。
// 如果存在，就应该调用 fetchUserInfo 来重新获取用户信息，恢复用户的登录状态，
// 而不需要用户再次输入密码。

//获取当前登录用户信息的接口
export const getUserInfoApi = (params: UserInfoParams) => {
  return request({
    url: '/api/user', 
    method: 'get',
    data: params     
  })
}