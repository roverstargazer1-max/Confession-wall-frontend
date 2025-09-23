<script setup lang="ts">
import {useConfirm} from'@/utils/useConfirm'

//修改密码正则
const loginRules = {
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max:18 ,message: '密码长度6-18个字符', trigger: 'blur' }
  ]
}
</script>
<!-- 个人信息 -->
<template>
  <div class="profile-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>个人信息</span>
        </div>
      </template>

      <el-form  label-width="80px" label-position="left">
        <el-form-item label="昵称">
          <el-input  placeholder="请输入您要修改的昵称" />
        </el-form-item>

        <el-form-item label="头像">
          <!-- <el-upload
            class="avatar-uploader"
            action="/api/avatar"
            method="put"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="userInfo.avatar" :src="userInfo.avatar" class="avatar" alt="用户头像"/>
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload> -->
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" >保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>修改密码</span>
        </div>
      </template>

      <el-form 
        ref="passwordFormRef" 
        :rules="loginRules"
        label-width="120px" 
        status-icon
        label-position="left"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input  type="password" show-password />
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword">
          <el-input  type="password" show-password />
        </el-form-item>

        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input  type="password" show-password />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" >
            确认修改
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
}

.box-card {
  margin-bottom: 20px;
}

.card-header {
  font-weight: bold;
  font-size: 1.2em;
}

.avatar-uploader .avatar {
  width: 120px;
  height: 120px;
  display: block;
}


</style>