<!-- ckl你来写 -->
<!-- ckl你来写 -->
<!-- ckl你来写 -->
  
 <script setup lang="ts">
// 表单响应式数据
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';
import { login } from '@/api/users';

const formRef = ref<FormInstance | undefined>(undefined);

const form = reactive({
  username: "mahiro",
  password: "woshigeshabi111"
});

// 登录事件处理
const onSubmit = async () => {
  try {
    // 1. 表单基础校验（非空检查）
    await formRef.value?.validate();
    
    // 2. 验证账号密码格式是否匹配预期
    const isCorrect = form.username === "mahiro" && form.password === "woshigeshabi111";
    if (isCorrect) {
      ElMessage.success("战舰俾斯麦，开辟未来！"); 
      
      // 3. 发送登录请求
      const res = await login(form);
      if (!res.data.success) {
        ElMessage.error("铁血的骄傲，不容任何人玷污！"); 
        throw new Error("铁血的骄傲，不容任何人玷污！");
      }
      console.log("ciallo", res.data);
      
    } else {
      // 账号/密码格式不匹配时的提示
      ElMessage.error("真理只在我的射程范围内。！");
    }
  } catch (error) {
    // 捕获「表单校验失败」或「登录接口异常」
    ElMessage.error("指挥官，带领大家撤退吧，再强撑下去也没有胜算。");
    console.error("ciallonya", error); 
  }
};

// 表单校验规则
const rules = reactive<FormRules>({
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" }
  ]
});
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
