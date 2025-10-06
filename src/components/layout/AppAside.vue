<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const isCollapse = ref(false)

//  获取当前路由对象
const route = useRoute()

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const asideWidth = computed(() => isCollapse.value ? '65px' : '200px')

</script>
<template>
  <el-aside :style="{ width: asideWidth }">
    <div class="toggle-button-container">
      <el-button @click="isCollapse = !isCollapse" class="toggle-button">
        <el-icon ><IEpMenu/></el-icon>
      </el-button>
    </div>

    <el-menu 
        :default-active="route.path"
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
        @open="handleOpen"
        @close="handleClose"
        :router="true"  
        >
        <el-menu-item index="/home">
            <el-icon> <IEpHouse/> </el-icon>
            <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/management">
            <el-icon><IEpMessageBox /></el-icon>
            <span>个人主页</span>
        </el-menu-item>
        <el-menu-item index="/post">
            <el-icon><IEpEdit /></el-icon> 
            <span>发布帖子</span>
        </el-menu-item>
        <el-menu-item index="/profile">
            <el-icon> <IEpUserFilled /> </el-icon>
            <span>修改资料</span>
        </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<style lang="scss" scoped>
.el-aside{
    background-color: rgb(233, 233, 235);
    height: 100vh;
    width: auto;
    /* 防止菜单项宽度变化时文字溢出 */
    transition: width 0.3s;
}
.el-menu{
    background-color: rgb(233, 233, 235);
    /* 去掉菜单右侧的边框 */
    border-right: none;
}
.radio-group-container{
    display: flex;
    justify-content: center;
    
}
.toggle-button{
  // border-style: hidden;
  background-color: rgb(233, 233, 235);
  margin-left: 9px;
  margin-top: 9px;
  margin-bottom: 18px;
}
.el-menu-item.is-active {
  background-color: #f8eded !important; // 设置一个与背景色稍有区别的颜色
}
</style>