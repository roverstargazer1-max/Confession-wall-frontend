<script setup lang="ts">
import { ref } from 'vue'
import {  computed } from 'vue'
const isCollapse = ref(true)
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
        default-active="2"
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
        @open="handleOpen"
        @close="handleClose">
        <el-menu-item index="1">
            <el-icon> <IEpHouse/> </el-icon>
            <span>首页</span>
        </el-menu-item>
        <el-menu-item index="2">
            <el-icon><IEpMessageBox /></el-icon>
            <span>内容管理</span>
        </el-menu-item>
        <el-menu-item index="3">
            <el-icon><IEpEdit /></el-icon> 
            <span>发布帖子</span>
        </el-menu-item>
        <el-menu-item index="4">
            <el-icon> <IEpUserFilled /> </el-icon>
            <span>个人资料</span>
        </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<style lang="scss" scoped>
.el-aside{
    background-color: rgb(233, 233, 235);
    height: 100vh;
    width: auto;
}
.el-menu{
    background-color: rgb(233, 233, 235);
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
</style>