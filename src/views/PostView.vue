<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

function resetForm() {
  textarea.value = ''
  fileList.value = []
}

const textarea = ref('')
const fileList = ref<any[]>([])
const isSubmitting = ref(false)

//图片上传
const handlePicturePreview = (file: any) => {
  console.log('预览图片：', file)
}
const handleRemove = (file: any, fileList: any[]) => {
  console.log('移除图片:', file)
}

const handleFileChange = (file: any, fileList: any[]) => {
  fileList.value = fileList
  console.log('文件变化:', file, fileList)
}

//图片验证
// 上传前验证
const beforeUpload = (file: File) => {
  // 1. 验证文件类型
  const isJPGOrPNG = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJPGOrPNG) {
    ElMessage.error('只能上传JPG/PNG格式的图片!')
    return false  // 阻止上传
  }

  // 2. 验证文件大小（限制5MB）
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过5MB!')
    return false  // 阻止上传
  }

  return true  // 验证通过，允许上传
}

// 处理文件超出限制（最多9张）
const handleExceed = (files: any[], fileList: any[]) => {
  ElMessage.warning(`最多只能上传9张图片，本次已忽略${files.length}张`)
}

//取消编辑（作用于“俺不中嘞”）
const handleCancel = async () => {
  // 语义化变量：判断是否有未保存的内容
  const changesUnsaved = Boolean(textarea.value || fileList.value.length)
  if (!changesUnsaved) {
    resetForm()
    return
  }
  try {
    await ElMessageBox.confirm(
      '确定要放弃编辑吗？已输入的内容将会丢失。',
      '确认放弃', // 对话框标题
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning' // 警告类型，显示对应图标
      }
    )
    // 用户确认后：重置表单并提示
    resetForm()
    ElMessage.info('已取消编辑')
  } catch (error) {
    // 用户取消操作（无需处理，静默退出）
    return
  }
}

//提交表单

</script>


<template>
  <h2>
    发布誓约
  </h2>

  <div class="postpage">
    <div class="showlove">
      <el-input v-model="textarea" style="width: 700px" :rows="3" type="textarea"
        placeholder="当人们听着同一首音乐时，心境会不会向着同一个方向趋近呢……指挥官，要试试吗？" />
    </div>
    <div class="image-upload">
      <el-upload action="#" list-type="picture-card" :on-preview="handlePicturePreview" :on-remove="handleRemove"
        :before-upload="beforeUpload" :file-list="fileList" :limit="9" :on-exceed="handleExceed" :auto-upload="false"
        :on-change="handleFileChange">在此添加图片
      </el-upload>
    </div>
    <div class="submit-button">
      <el-button type="success" plain>是否在此表达爱意</el-button>
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
