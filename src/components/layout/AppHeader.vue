<script setup lang="ts">

</script>
<template>
  <el-header> 

    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">homepage</el-breadcrumb-item>
        <el-breadcrumb-item>
        <a href="/">promotion management</a>
        </el-breadcrumb-item>
        <el-breadcrumb-item>promotion list</el-breadcrumb-item>
        <el-breadcrumb-item>promotion detail</el-breadcrumb-item>
    </el-breadcrumb>

    <el-dropdown>
        <span class="el-dropdown-link">
        <!-- 后续需改为用户头像 -->
        <el-avatar :size="50" :src="'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" />
        </span>
        <template #dropdown>
        <el-dropdown-menu>
            <el-dropdown-item>用户姓名</el-dropdown-item>
            <el-dropdown-item divided>退出登录</el-dropdown-item>
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