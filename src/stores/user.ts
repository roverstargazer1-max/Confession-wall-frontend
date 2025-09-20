// src/stores/user.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
// 假设你有一个获取用户信息的API函数
import { getUserInfoApi, type UserInfoParams } from '@/api/users' // 导入类型

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || '{}'))

  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  // action: 接收一个包含 user_id 的对象
  const fetchUserInfo = async (params: UserInfoParams) => {
    if (!token.value) return;
    try {
      // 将参数传递给API调用
      const response = await getUserInfoApi(params) 
      if (response.data.code === 200) { // 根据文档，成功code是0，但遵循您之前的代码用200
        userInfo.value = response.data.data
        localStorage.setItem('userInfo', JSON.stringify(response.data.data))
      } else {
        clearUserData()
      }
    } catch (error) {
      clearUserData()
    }
  }

  const clearUserData = () => {
    token.value = ''
    userInfo.value = {}
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  return { token, userInfo, setToken, fetchUserInfo, clearUserData }
})