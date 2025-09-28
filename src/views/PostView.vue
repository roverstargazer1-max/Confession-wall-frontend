<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'

const textarea = ref('')
import type { UploadFile } from 'element-plus'

const fileList = ref<UploadFile[]>([])
const imageUrl = ref('')
const dialogVisible = ref(false)
const submitting = ref(false)

//处理图片删除
const handleRemove = (file: UploadFile) => {
  console.log('删除文件：', file)
}
//处理图片预览
const handlePicturePreview = (file: UploadFile) => {
  imageUrl.value = file.url || ''
  dialogVisible.value = true
}
//上传前验证
//验证格式
const beforeUpload = (file: File) => {
  const typeIsImage = file.type.startsWith('image/')
  if (!typeIsImage) {
    ElMessage.error('指挥官，暂时只接受图片示爱哦~')
    return false
  }
  return true
}
//验证数量
const handleExceed = () => {
  ElMessage.warning("图片太多可是会显得很不专一哦，指挥官~")
}
//文件变化处理
const handleFileChange = (file: UploadFile, currentFileList: UploadFile[]) => {
  // fileList会自动更新，这里可以添加额外处理
  console.log('文件列表更新:', currentFileList)
}

//提交表白
const handleSubmit = async () => {
  if (!textarea.value.trim()) {
    ElMessage.warning('指挥官，对我无话可说吗......')
    return
  }
  try {
    await ElMessageBox.confirm(
      '真的想对我说这些话吗',
      '真的真的要对我说哦',
      {
        confirmButtonText: '确定',
        cancelButtonText: '再想想', // 修正：改为 cancelButtonText
        type: 'warning'
      }
    )
    //设置提交状态
    submitting.value = true

    const formData = new FormData()
    formData.append('content', textarea.value.trim())

    fileList.value.forEach((file, index) => {
      if (file.raw) {
        formData.append('images', file.raw)
      }
    })
    //发送请求
    const response = await axios.post('/api/post', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 30000
    })
    if (response.data.success) {
      ElMessage.success("指挥官的声音，我好好听到了哦！")
      handleCancel() // 修正：拼写错误
    } else {
      ElMessage.error("啊嘞，出了点问题……")
    }

  } catch (error: any) {
    console.error('提交错误', error)

    // 点击取消对话框
    if (error === "cancel" || error?.action === 'cancel') {
      return
    }

    // 处理API错误
    if (error && error.response) {
      // 服务器返回错误状态码
      const status = error.response.status
      if (status === 401) {
        ElMessage.error('请先登录')
      } else if (status === 413) {
        ElMessage.error('上传文件过大')
      } else if (status >= 500) {
        ElMessage.error('服务器错误，请稍后重试')
      } else {
        ElMessage.error(error.response.data.message || `发布失败: ${status}`)
      }
    } else if (error && error.request) {
      // 请求发出但没有收到响应
      ElMessage.error('网络错误，请检查连接')
    } else {
      // 其他错误
      ElMessage.error('发布失败，请重试')
    }
  } finally {
    // 无论成功失败，都重置提交状态
    submitting.value = false
  }
}

const handleCancel = () => {
  // 清空文本内容
  textarea.value = ''
  // 清空文件列表
  fileList.value = []
  // 给出提示
  ElMessage.info('已取消发布')
}
</script>

<template>
  <h2>
    发布誓约
  </h2>

  <div class="postpage">
    <!-- 文本区域 -->
    <div class="showlove">
      <el-input v-model="textarea" 
      style="width: 700px" 
      :rows="3" 
      type="textarea"
      placeholder="当人们听着同一首音乐时，心境会不会向着同一个方向趋近呢……指挥官，要试试吗？" />
    </div>
    <!-- 上传图片 -->
    <div class="image-upload">
      <el-upload 
        action="/api/post" 
        list-type="picture-card" 
        :on-preview="handlePicturePreview" 
        :on-remove="handleRemove"
        :before-upload="beforeUpload" 
        v-model:file-list="fileList" 
        :limit="9" 
        :on-exceed="handleExceed" 
        :auto-upload="false"
        :on-change="handleFileChange">
        <div class="upload-placeholder">
          <el-icon><Plus /></el-icon>
          <span>在此添加图片</span>
        </div>
      </el-upload>
      
      <el-dialog v-model="dialogVisible" title="图片预览">
        <img :src="imageUrl" alt="预览图片" style="width: 100%" />
      </el-dialog>
    </div>
    <!-- 按钮区域 -->
    <div class="submit-button">
      <el-button type="success" plain @click="handleSubmit" :loading="submitting">是否在此表达爱意</el-button>
      <el-button type="danger" plain @click="handleCancel">俺不中嘞</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.postpage {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

h2 {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0 1rem;
  font-size: 1.8rem;
  color: #2c3e50;
  position: relative;
  padding-bottom: 0.8rem;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background-color: #42b983;
    border-radius: 3px;
  }
}

.showlove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  .el-input {
    width: 100% !important;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    }
  }
}

.image-upload {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #f1f3f5;
  }

  .el-upload {
    width: 100%;
  }
  
  .upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
}

.submit-button {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;

  .el-button {
    padding: 0.6rem 2rem;
    font-size: 1rem;
    transition: all 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    &:active {
      transform: translateY(0);
    }
  }
}

// 响应式调整
@media (max-width: 768px) {
  .postpage {
    margin: 1rem;
    padding: 1.5rem;
    gap: 1.5rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  .submit-button {
    flex-direction: column;
    gap: 1rem;

    .el-button {
      width: 100%;
    }
  }
}
</style>