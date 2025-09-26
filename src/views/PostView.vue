<template>
  <div class="post-container">
    <el-card>
      <div slot="header"> 
        <h2>发布誓约</h2>
      </div>
      <el-form :model="postForm" :rules="rules" ref="postFormRef" label-width="80px">
        <el-form-item label="誓词" prop="content">
          <el-input
            type="textarea"
            v-model="postForm.content"
            placeholder="当人们听着同一首音乐时，心境会不会向着同一个方向趋近呢……指挥官，要试试吗？"
            :rows="5"
          ></el-input>

          <!-- 图片上传组件 -->
          <el-upload
            action="#"                 
            list-type="picture-card"  
            :on-preview="handlePicturePreview"  
            :on-remove="handleRemove" 
            :before-upload="beforeUpload"  
            :file-list="fileList"      
            :limit="9"              
            :on-exceed="handleExceed"  
            :auto-upload="false"       
            :on-change="handleFileChange"
          >
            <el-icon><Plus /></el-icon>

            <template #file="{ file }">
              <div>
                <img
                  class="el-upload-list__item-thumbnail"
                  :src="file.url"  
                  alt=""
                />
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click.stop="handlePicturePreview(file)" 
                  >
                    <el-icon><ZoomIn /></el-icon>
                  </span>
                  <span
                    class="el-upload-list__item-delete"
                    @click.stop="handleRemove(file)"  
                  >
                    <el-icon><Delete /></el-icon>
                  </span>
                </span>
              </div>
            </template>
          </el-upload>
          <div class="upload-tip">最多上传9张图片</div>

          <!-- 图片预览弹窗 -->
          <el-dialog 
            v-model="dialogVisible"  
            title="预览图片"        
            :close-on-click-modal="false"  
          >
            <img 
              width="100%" 
              :src="dialogImageUrl"  
              alt="预览图片" 
            />
          </el-dialog>
         </el-form-item>

        <el-form-item>
          <el-checkbox v-model="postForm.isAnonymous">匿名发布</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="postForm.isPublic">公开可见（取消则仅自己可见）</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">向世界表达爱意</el-button>
          <el-button @click="handleCancel">俺不中嘞</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePostStore } from '../stores/post'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { Plus, ZoomIn, Delete } from '@element-plus/icons-vue'
import type { UploadFile, UploadProps } from 'element-plus'

const postStore = usePostStore()
const router = useRouter()
const postFormRef = ref()

// 表单数据
const postForm = ref({
  content: '',
  isAnonymous: false,
  isPublic: true,
  images: [] as string[] // 存储图片的base64
})

// 上传文件列表 - 严格类型定义
const fileList = ref<UploadFile[]>([])
const dialogVisible = ref(false)
const dialogImageUrl = ref('')

// 表单验证规则
const rules = ref({
  content: [
    { required: true, message: '请输入表白内容', trigger: 'blur' },
    { min: 1, max: 500, message: '内容长度在 1 到 500 个字符', trigger: 'blur' }
  ]
})

// 处理图片预览
const handlePicturePreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url ?? ''
  dialogVisible.value = true
}

// 处理图片移除 - 关键修复
const handleRemove: UploadProps['onRemove'] = (file, fileList) => {
  ElMessageBox.confirm(
    '确定删除这张图片吗？',
    '确认删除',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 1. 找到要删除的文件索引 (使用uid精确匹配)
    const index = fileList.value.findIndex(item => item.uid === file.uid)
    
    if (index !== -1) {
      // 2. 从文件列表中移除
      fileList.value.splice(index, 1)
      
      // 3. 从base64数组中移除对应的图片
      postForm.value.images.splice(index, 1)
      
      // 4. 强制刷新文件列表 (解决响应式更新问题)
      fileList.value = [...fileList.value]
      
      ElMessage.success('图片已成功删除')
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 处理文件超出限制
const handleExceed = () => {
  ElNotification.warning({
    title: '提示',
    message: '最多只能上传9张图片'
  })
}

// 处理文件变化 - 新增的同步机制
const handleFileChange: UploadProps['onChange'] = (file, fileList) => {
  // 保持fileList同步
  fileList.value = fileList
}

// 上传前处理 - 改进的uid生成
const beforeUpload = (rawFile: File) => {
  // 检查文件类型
  const isImage = rawFile.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }

  // 检查文件大小 (限制10MB以内)
  const isLt10M = rawFile.size / 1024 / 1024 < 10
  if (!isLt10M) {
    ElMessage.error('图片大小不能超过10MB!')
    return false
  }

  // 将图片转为base64
  const reader = new FileReader()
  reader.readAsDataURL(rawFile)
  reader.onload = (e) => {
    const base64Str = e.target?.result as string
    // 生成唯一uid (改进版)
    const uid = 'img_' + Date.now() + '_' + Math.floor(Math.random() * 10000)
    fileList.value.push({
      name: rawFile.name,
      url: base64Str,
      uid: uid,
      status: 'success' // 标记为已上传状态
    })
    // 同步到表单数据
    postForm.value.images.push(base64Str)
    // 强制刷新
    fileList.value = [...fileList.value]
  }
  
  // 阻止自动上传
  return false
}

// 提交表单
const handleSubmit = () => {
  postFormRef.value.validate((valid: boolean) => {
    if (valid) {
      const success = postStore.createPost(postForm.value)
      if (success) {
        ElMessage.success('发布成功')
        router.push('/')
      } else {
        ElMessage.error('发布失败，请重试')
      }
    }
  })
}

// 取消
const handleCancel = () => {
  router.back()
}

onMounted(() => {
  postStore.initPosts()
})
</script>

<style scoped>
.post-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 20px;
}

.upload-tip {
  margin-top: 10px;
  color: #606266;
  font-size: 12px;
}

::v-deep .el-upload-list--picture-card .el-upload-list__item {
  width: 100px;
  height: 100px;
}

/* 确保删除按钮可点击区域足够大 */
::v-deep .el-upload-list__item-delete {
  width: 100%;
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
