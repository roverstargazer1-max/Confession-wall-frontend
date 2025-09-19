<!-- ckl你来写 -->
<!-- ckl你来写 -->
<!-- ckl你来写 -->
  
 <script setup lang="ts">
 //表单响应式数据
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { reactive } from 'vue';
import { ref } from 'vue';
const formRef = ref<FormInstance | undefined>(undefined);
import { login } from '@/api/users';

 const form = reactive({
    username:"mahiro",
    password:"woshigeshabi111"
 })
 //登陆事件处理
const onSubmit = async () => {
  try {
    // 1. 先通过表单基础校验（非空检查）
    await formRef.value?.validate();
    
    // 2. 再验证账号密码的实际正确性
    const isCorrect = form.username === "mahiro" && form.password === "woshigeshabi111";
    if (isCorrect) {
      ElMessage.success("战舰俾斯麦，开辟未来！"); // 正确时提示
    //   const res = login()
    //   console.log(res)
    } else {
      ElMessage.error("铁血的骄傲，不容任何人玷污！"); // 错误时提示
    }
  } catch (err) {
    // 基础校验失败（未填写）时的提示
    ElMessage.error("指挥官，带领大家撤退吧，再强撑下去也没有胜算。");
  }
};

 //定义表单校验规则
 const rules = reactive<FormRules>({
    username: [
        { required: true, message:"请输入用户名", trigger:"blur"},
    ],
    password: [
        { required: true, message:"请输入密码", trigger:"blur"}
    ]
 })
</script>

<template>
<div class="login">
  <el-form :model="form" :rules="rules" ref="formRef" label-width="auto" style="max-width: 600px">
    <h2>登陆界面</h2>
    <el-form-item label="账号" prop="username">
      <el-input v-model="form.username" />
    </el-form-item>

    <el-form-item label="密码" prop="password">
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
    background-color: #ddd; 
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center; 
}

.el-form {
    width: 300px;
    background-color: #fff;
    padding: 30px;
    border-radius: 10px;

    .el-form-item {
        margin-top: 20px;
    }

    .el-button {
        width: 100%;
        margin-top: 30px;
    }

}

</style>
