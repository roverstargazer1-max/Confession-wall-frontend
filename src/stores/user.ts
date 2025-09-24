import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserInfoApi, type UserInfoParams } from '@/api/users' // 导入类型

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || '{}'))
  const targetUserInfo=ref(JSON.parse(localStorage.getItem('targetUserInfo') || '{}'))
  
  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }
  // 【新增 Action】: 用于登录成功后一次性设置所有状态
  const setUserDataOnLogin = (loginData: any) => {
    // 假设 loginData.data 是后端返回的整个 data 对象
    // { apikey: '...', user_id: 1, username: '...', ... }
    const userToken = loginData.msg
    token.value = userToken
    localStorage.setItem('token', userToken)
//userInfo：
//      {
//         "id": 0,
//         "username": "string",
//         "name": "string",
//         "password": "string",
//         "blacklist": [
//             {}
//         ],
//         "portrait": {
//             "id": 0,
//             "width": 0,
//             "height": 0,
//             "featurecode": 0,
//             "pixel": [
//                 [
//                     0
//                 ]
//             ]
//         },
//         "type": 0
//     }
    // 从 loginData.data 中提取用户信息部分并存储
    userInfo.value = loginData.data
    localStorage.setItem('userInfo', JSON.stringify(loginData.data))
  }

  //获取目标用户信息
  const fetchUserInfo = async (params: UserInfoParams) => {
    if (!token.value) return;
    try {
      // 将参数传递给API调用
      const response = await getUserInfoApi(params) 
      if (response.data.code === 200) { // 成功
        targetUserInfo.value = response.data.data
        localStorage.setItem('targetUserInfo', JSON.stringify(response.data.data))
      } else {
        clearUserData()
      }
    } catch (error) {
      clearUserData()
    }
  }
//清除
  const clearUserData = () => {
    token.value = ''
    userInfo.value = {}
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }
  return { token, userInfo, targetUserInfo, fetchUserInfo, clearUserData, setUserDataOnLogin }
})