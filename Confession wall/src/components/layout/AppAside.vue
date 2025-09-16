<script setup lang="ts">

</script>
<template>
  <el-aside>
    <el-menu>
        <el-menu-item>
            <el-icon> <IEpHouse/> </el-icon>  <span>首页</span>
        </el-menu-item>
        <el-menu-item>
            <el-icon> <IEpSetting /> </el-icon> <span> 用户管理</span>
        </el-menu-item>
    </el-menu>
  </el-aside>
</template>
<style lang="scss" scoped>
.el-aside{
    background-color: #eee;
    height: 100vh;
    width: auto;
}
.el-menu{
    background-color: #eee;
    width: 160px;
}
</style>