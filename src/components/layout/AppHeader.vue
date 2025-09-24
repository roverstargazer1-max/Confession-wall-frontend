<script setup lang="ts">
// 1. 导入我们刚刚创建的组合式函数
import router from '@/router'
import { useConfirm } from '@/utils/useConfirm'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user' 
import { computed } from 'vue'


// 获取到 userStore 函数
const userStore = useUserStore()
//获得用户昵称
const name = computed(()=> userStore.userInfo.name)

// 【新增】创建一个计算属性来获取头像 URL
// 如果 store 中没有头像地址，就使用一个默认的头像作为备选
const avatarUrl = computed(() => {
  const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
  return userStore.userInfo.portrait || defaultAvatar
})
// 获取到 showConfirm 函数
const { showConfirm } = useConfirm()

// 异步
const leaveAccount = async () => {
  try {
    // 3. 调用 showConfirm 函数，并等待用户操作
    await showConfirm('您确定要退出登录吗？', '退出确认')
    
    // 如果用户点击了“确定”，代码会继续往下执行
    console.log('用户确认退出')
    // 清除本地存储的 token、调用后端的退出接口、跳转到登录页等
    //要先删除token，否则根据导航守卫无法退出
    userStore.clearUserData()
    router.push('/login')
    ElMessage.success('已成功退出登录')

  } catch (error) {
    // 如果用户点击了“取消”或关闭了弹窗，代码会进入 catch 块
    console.log('用户取消退出')
    ElMessage.success('取消退出')

  }
}
</script>
<template>
  <el-header> 

    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    </el-breadcrumb>

    <el-dropdown>
        <span class="el-dropdown-link">
        <!-- 后续需改为用户头像 -->
        <el-avatar :size="50" :src="avatarUrl" />
        </span>
        <template #dropdown>
        <el-dropdown-menu>
            <el-dropdown-item>{{name}}</el-dropdown-item>
            <el-dropdown-item divided @click="leaveAccount">退出登录</el-dropdown-item>
        </el-dropdown-menu>
        </template>
    </el-dropdown>

  </el-header>
</template>
<style lang="scss" scoped>
.el-header{
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: rgb(222, 223, 224);
    justify-content: space-between; 
}
.el-dropdown-link{
    border-style: hidden;
}
</style>