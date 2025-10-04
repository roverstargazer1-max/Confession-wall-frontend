import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserInfoApi, type UserInfoParams } from '@/api/users'

// [新增] 安全地从 localStorage 解析 JSON 的辅助函数
function getStoredJson(key: string, defaultValue: any) {
  const storedValue = localStorage.getItem(key);
  if (!storedValue) {
    return defaultValue;
  }
  try {
    return JSON.parse(storedValue);
  } catch (error) {
    console.error(`Error parsing JSON from localStorage key "${key}":`, error);
    // 如果解析失败，清除损坏的数据并返回默认值
    localStorage.removeItem(key);
    return defaultValue;
  }
}

export const useUserStore = defineStore('user', () => {
  // [修正] 使用安全的辅助函数来初始化状态
  const token = ref(localStorage.getItem('token') || '');
  const userInfo = ref(getStoredJson('userInfo', {}));
  const targetUserInfo = ref(getStoredJson('targetUserInfo', {}));
  
  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  const setUserDataOnLogin = (loginData: any) => {
    const userToken = loginData.msg
    token.value = userToken
    localStorage.setItem('token', userToken)

    userInfo.value = loginData.data
    localStorage.setItem('userInfo', JSON.stringify(loginData.data))
  }

  const fetchUserInfo = async (params: UserInfoParams) => {
    if (!token.value) return;
    try {
      const response = await getUserInfoApi(params) 
      if (response.data.code === 200) {
        targetUserInfo.value = response.data.data
        localStorage.setItem('targetUserInfo', JSON.stringify(response.data.data))
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
    targetUserInfo.value = {} // 登出时也清除目标用户信息
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('targetUserInfo') // 登出时也清除
  }
  
  return { token, userInfo, targetUserInfo, fetchUserInfo, clearUserData, setUserDataOnLogin }
})