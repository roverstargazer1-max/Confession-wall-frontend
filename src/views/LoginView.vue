<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { reactive } from 'vue';

const form = reactive({
    phone:"18006681319",
    password:"12345678",
})
const onSubmit=()=>{
    ElMessage.success("提交表单数据")
}
</script>
<template>
<div class="login">
  <el-form :model="form" label-width="120px" label-position="top">
    <h2 style="justify-self: center;">登录</h2>
    <el-form-item label="手机号">
      <el-input v-model="form.phone" />
    </el-form-item>

    <el-form-item label="密码">
      <el-input v-model="form.password" />
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
    width: 400px;
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
