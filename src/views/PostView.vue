<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { UploadFile } from 'element-plus'
import request from '@/utils/request'

const textarea = ref('')
const fileList = ref<UploadFile[]>([])
const imageUrl = ref('')
const dialogVisible = ref(false)
const submitting = ref(false)
const isAnonymous = ref(false) // 匿名发布状态

// 处理图片删除
const handleRemove = (file: UploadFile) => {
  console.log('删除文件：', file)
}

// 处理图片预览
const handlePicturePreview = (file: UploadFile) => {
  imageUrl.value = file.url || ''
  dialogVisible.value = true
}

// 上传前验证格式
const beforeUpload = (file: File) => {
  const typeIsImage = file.type.startsWith('image/')
  if (!typeIsImage) {
    ElMessage.error('指挥官，暂时只接受图片示爱哦~')
    return false
  }
  return true
}

// 验证数量
const handleExceed = () => {
  ElMessage.warning("图片太多可是会显得很不专一哦，指挥官~")
}

// 文件变化处理
const handleFileChange = (file: UploadFile, currentFileList: UploadFile[]) => {
  console.log('文件列表更新:', currentFileList)
}

// 获取匿名确认消息
const getAnonymousConfirmMessage = () => {
  if (isAnonymous.value) {
    return '选择匿名后，其他用户将无法看到您的身份信息，确定要继续吗？'
  }
  return '真的想对我说这些话吗'
}

// 提交表白
const handleSubmit = async () => {
  if (!textarea.value.trim()) {
    ElMessage.warning('指挥官，对我无话可说吗......')
    return
  }

  try {
    await ElMessageBox.confirm(
      getAnonymousConfirmMessage(),
      isAnonymous.value ? '匿名发布确认' : '发布确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '再想想',
        type: isAnonymous.value ? 'info' : 'warning'
      }
    )

    submitting.value = true

    const formData = new FormData()
    formData.append('content', textarea.value.trim())
    formData.append('anonymous', isAnonymous.value ? 'true' : 'false')

    fileList.value.forEach((file) => {
      if (file.raw) {
        formData.append('images', file.raw)
      }
    })

    // 使用封装的 request 发送请求
    const response = await request.post('/api/post', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 30000
    })

    if (response.data.success) {
      const successMessage = isAnonymous.value 
        ? "匿名表白已发送，我会好好珍藏这份心意哦！" 
        : "指挥官的声音，我好好听到了哦！"
      ElMessage.success(successMessage)
      handleCancel()
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
    if (error?.response) {
      const status = error.response.status
      if (status === 401) {
        ElMessage.error('请先登录')
      } else if (status === 413) {
        ElMessage.error('上传文件过大')
      } else if (status >= 500) {
        ElMessage.error('服务器错误，请稍后重试')
      } else {
        ElMessage.error(error.response.data?.message || `发布失败: ${status}`)
      }
    } else if (error?.request) {
      ElMessage.error('网络错误，请检查连接')
    } else {
      ElMessage.error('发布失败，请重试')
    }
  } finally {
    submitting.value = false
  }
}

const handleCancel = () => {
  textarea.value = ''
  fileList.value = []
  isAnonymous.value = false
  ElMessage.info('已取消发布')
}
</script>

<template>
  <h2>发布誓约</h2>

  <div class="postpage">
    <!-- 文本区域 -->
    <div class="showlove">
      <el-input 
        v-model="textarea" 
        style="width: 700px" 
        :rows="3" 
        type="textarea"
        placeholder="当人们听着同一首音乐时，心境会不会向着同一个方向趋近呢……指挥官，要试试吗？" 
      />
    </div>
    
    <!-- 上传图片 -->
    <div class="image-upload">
      <el-upload 
        :action="`${request.defaults.baseURL}/api/post`"
        list-type="picture-card" 
        :on-preview="handlePicturePreview" 
        :on-remove="handleRemove"
        :before-upload="beforeUpload" 
        v-model:file-list="fileList" 
        :limit="9" 
        :on-exceed="handleExceed" 
        :auto-upload="false"
        :on-change="handleFileChange"
      >
        <div class="upload-placeholder">
          <el-icon><Plus /></el-icon>
          <span>在此添加图片</span>
        </div>
      </el-upload>
      
      <el-dialog v-model="dialogVisible" title="图片预览">
        <img :src="imageUrl" alt="预览图片" style="width: 100%" />
      </el-dialog>
    </div>
    
    <!-- 匿名选项 -->
    <div class="anonymous-option">
      <el-checkbox v-model="isAnonymous" label="匿名发布" size="large">
        <span class="anonymous-label">悄悄说出心里话</span>
        <el-tooltip
          content="像给我个惊喜吗？最喜欢指挥官啦"
          placement="top"
        >
          <el-icon class="tip-icon"><InfoFilled /></el-icon>
        </el-tooltip>
      </el-checkbox>
      <div v-if="isAnonymous" class="anonymous-tip">
        <el-icon><View /></el-icon>
        <span>将以"神秘指挥官"的身份发布</span>
      </div>
    </div>
    
    <!-- 按钮区域 -->
    <div class="submit-button">
      <el-button 
        type="success" 
        plain 
        @click="handleSubmit" 
        :loading="submitting"
        :class="{ 'anonymous-button': isAnonymous }"
      >
        {{ isAnonymous ? '匿名表达爱意' : '公开表达爱意' }}
      </el-button>
      <el-button type="danger" plain @click="handleCancel">
        俺不中嘞
      </el-button>
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

.anonymous-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 8px;
  border: 1px solid #e9ecef;

  .anonymous-label {
    font-weight: 500;
    margin-right: 0.5rem;
  }

  .tip-icon {
    color: #6c757d;
    cursor: help;
    margin-left: 0.25rem;
  }

  .anonymous-tip {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: #e7f3ff;
    border-radius: 6px;
    color: #1890ff;
    font-size: 0.9rem;

    .el-icon {
      font-size: 1rem;
    }
  }

  :deep(.el-checkbox) {
    .el-checkbox__label {
      display: flex;
      align-items: center;
    }
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

  .anonymous-button {
    background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
    border-color: #67c23a;
    color: white;

    &:hover {
      background: linear-gradient(135deg, #5daf34 0%, #78c25c 100%);
      border-color: #5daf34;
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

  .anonymous-option {
    padding: 0.75rem;
    
    .anonymous-tip {
      padding: 0.4rem 0.8rem;
      font-size: 0.85rem;
    }
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