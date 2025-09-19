<script setup lang="ts">
import { ElMessage, messageConfig } from 'element-plus';
import { reactive } from 'vue';
import { User,Lock } from '@element-plus/icons-vue'
const loginForm = reactive({
    username:"",
    password:"",
})
const loginRules={
    username:[
        {required:true,message:'帐号不能为空',trigger:"blur"},
        {min:3,max:18,message:"帐号在3-18位",trigger:"blur"},
    ],
    password:[
        {required:true,message:'密码不能为空',trigger:"blur"},
        {min:6,max:18,message:"密码长度在8-18位",trigger:"blur"},
    ],
    
}
const onSubmit=()=>{
    ElMessage.success("提交表单数据")
}
</script>
<template>
<div class="login">
  <el-form :model="loginForm" label-width="120px" label-position="top" :rules="loginRules">
    <h2 style="justify-self: center;">登录</h2>
    <el-form-item label="帐号" prop="username">
      <el-input :suffix-icon="User" v-model="loginForm.username" />
    </el-form-item>

    <el-form-item label="密码" prop="password">
      <el-input :suffix-icon="Lock" v-model="loginForm.password" type ="password" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSubmit">登录</el-button>
    </el-form-item>
  </el-form>
</div>
</template>


<style scoped>
.login{
    display: flex;
    background-color: aliceblue;
    align-items: center;
    height: 100%;
    justify-content: center;
    flex-direction: column;
}
.el-form{
    width: 450px;
    background-color: #fff;
    padding: 30px;
    border-radius: 10px;
}
.el-form-item{
    margin-top: 20px;
}
.el-button{
    width: 100%;
    margin-top: 30px ;
}
</style>
