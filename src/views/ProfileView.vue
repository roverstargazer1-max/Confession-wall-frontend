<script setup lang="ts">
import {useConfirm} from'@/utils/useConfirm'
import { Plus } from '@element-plus/icons-vue'
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { UploadProps } from 'element-plus'
import { useUserStore } from '@/stores/user' 
import{reviseNameApi,revisePasswApi,revisePortraitApi}  from '@/api/revise'
import NotFoundView from './NotFoundView.vue'
const userStore = useUserStore()

const newnameForm = reactive({
  // 从 userStore 初始化newname
  newname: userStore.userInfo.name 
})
const passwordFormRef = ref() // 用于获取表单实例
const nameFormRef =ref()

const passwordForm = reactive({
  originpassword: '',
  newPassword: '',
  confirmPassword: ''
})
//修改昵称
const handleProfileSave = async () => {
  try{
    await nameFormRef.value.validate()
    try {
      const params = { newname: newnameForm.newname, user_id: userStore.userInfo.id }
      await reviseNameApi(params)
      ElMessage.success('昵称修改成功！')
      // 更新 pinia 中的用户信息
      userStore.userInfo.name = newnameForm.newname
      localStorage.setItem('userInfo', JSON.stringify(userStore.userInfo))
    } catch (error) {
      ElMessage.error('昵称修改失败')
    }
  }catch( validationError){
    console.log('表单验证失败', validationError);
  }
}

const handlePasswordChange = async () => {
  try {
    // 步骤 1: 尝试验证，如果失败会直接跳转到 catch
    await passwordFormRef.value.validate()

    // 步骤 2: 只有验证成功才会执行这里
    try {
      const params = { newpassword: passwordForm.newPassword, user_id: userStore.userInfo.id , originpassword:passwordForm.originpassword}
      const Response = await revisePasswApi(params)
      if(Response.data.code === 200){
        
        ElMessage.success('密码修改成功！')
        passwordFormRef.value.resetFields()
      }
      else{ElMessage.error('密码修改失败')}
    } catch (apiError) {
      ElMessage.error('密码修改失败')
    }
  } catch (validationError) {
    // 步骤 3: 验证失败时进入这里
    console.log('密码表单验证失败', validationError)
  }
}

//创建一个变量来存储上传后头像的预览 URL。
const imageUrl = ref('')


//在文件真正开始上传前，这个函数会进行校验。它检查了文件是否为 image/jpeg 格式，
// 以及大小是否超过 2MB，如果不符合要求就阻止上传并弹出错误提示。
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('图片必须是jpg格式!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}
//修改密码正则
const validateConfirmPassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入新密码'))
  } else if (value !== passwordForm.newPassword) {
    callback(new Error("两次输入的密码不一致!"))
  } else {
    callback()
  }
}
const passwordRules = reactive({
  originpassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 18, message: '密码长度应为 6-18 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    // 使用上面的自定义校验器
    { validator: validateConfirmPassword, trigger: 'blur' } 
  ]
})

//修改昵称正则
const newnameRules ={
  newname:[
    {required: true, message: '请输入昵称', trigger: 'blur' },
    {min: 1, max:18 ,message: '昵称长度1-18个字符', trigger: 'blur'}
  ]
}
// 手动上传图片
const handleUpload = async (options: any) => {
  // options.file 就是用户选择的文件
  console.log(options.file)

  // 创建 FormData 对象
  const formData = new FormData()

  // 添加字段
  formData.append('user_id', userStore.userInfo.id)
  formData.append('picture', options.file)

  // 调用 API 并处理结果
  try {
    const response = await revisePortraitApi(formData)
    console.log(response)
    if (response.data.code === 200) {
      ElMessage.success('头像上传成功！')
      // 为了即时预览，仍然使用 createObjectURL
      imageUrl.value = URL.createObjectURL(options.file)
            // 假设后端在 response.data.data 中返回了新的头像 URL
      const newAvatarUrl = response.data.data 

      // 更新本地预览图，使用后端返回的永久地址
      imageUrl.value = newAvatarUrl

      // 【核心步骤】将新的头像 URL 更新到 Pinia Store 中
      userStore.userInfo.portrait = newAvatarUrl
      localStorage.setItem('userInfo', JSON.stringify(userStore.userInfo))
      
    } else {
      ElMessage.error(response.data.msg || '头像上传失败')
    }
  } catch (error) {
    ElMessage.error('头像上传失败')
  }
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

      <el-form 
      ref="nameFormRef" 
      :model="newnameForm"
      :rules="newnameRules"
      label-width="80px" 
      label-position="left">
        <el-form-item label="昵称" prop="newname">
          <el-input v-model="newnameForm.newname" placeholder="请输入您要修改的昵称" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleProfileSave" >保存</el-button>
        </el-form-item>

        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :http-request="handleUpload"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
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
        :model="passwordForm"
        :rules="passwordRules"
        label-width="120px" 
        status-icon
        label-position="left"
      >
        <el-form-item label="原密码" prop="originpassword">
          <el-input  v-model="passwordForm.originpassword" type="password" show-password />
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword">
          <el-input  v-model="passwordForm.newPassword" type="password" show-password />
        </el-form-item>

        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input  v-model="passwordForm.confirmPassword" type="password" show-password />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handlePasswordChange">
            确认修改
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
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
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

</style>