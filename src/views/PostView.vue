<template>
  <div class="post-container">
    <el-card>
      <div slot="header"> 
        <!-- 标题 -->
        <h2>发布誓约</h2>
      </div>
      <el-form :model="postForm" :rules="rules" ref="postFormRef" label-width="80px">
        <el-form-item label="誓词" prop="content">
            <!-- 表白内容框 -->
          <el-input
            type="textarea"
            v-model="postForm.content"
            placeholder="当人们听着同一首音乐时，心境会不会向着同一个方向趋近呢……指挥官，要试试吗？"
            :rows="5"
          ></el-input>
        <!-- 图片上传 -->
         <!-- 表单组件，绑定数据，验证规则，表单引用 -->
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
          >
          <!-- 上传按钮图标 -->
            <el-icon><Plus /></el-icon>

             <!-- 自定义已上传文件的显示样式 -->
            <template #file="{ file }">
              <div>
                <!-- 显示缩略图 -->
                <img
                  class="el-upload-list__item-thumbnail"
                  :src="file.url"  
                  alt=""
                />
                <!-- 图片操作按钮组 -->
                <span class="el-upload-list__item-actions">
                  <!-- 预览按钮 -->
                  <span
                    class="el-upload-list__item-preview"
                    @click.stop="handlePicturePreview(file)" 
                  >
                    <el-icon><ZoomIn /></el-icon>
                  </span>
                  <!-- 删除按钮 -->
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
          <!-- 上传提示文字 -->
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
        <!-- 匿名项 -->
        <el-form-item>
          <el-checkbox v-model="postForm.isAnonymous">匿名发布</el-checkbox>
          <!-- 勾选状态会存到postForm.isAnonymous里 -->
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="postForm.isPublic">公开可见（取消则仅自己可见）</el-checkbox>
        </el-form-item>
        <!-- 发布按钮 -->
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
import { ElMessage, ElNotification } from 'element-plus'
import { useUserStore } from '../stores/user'
import { Plus, ZoomIn, Delete } from '@element-plus/icons-vue'

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

// 上传文件列表
const fileList = ref<any[]>([])
// 图片预览相关
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

// 处理图片移除
import type { UploadFile } from 'element-plus'

const handleRemove = (file: UploadFile) => {
  const index = fileList.value.indexOf(file)
  if (index !== -1) {
    fileList.value.splice(index, 1)
    // 同步更新postForm.images
    postForm.value.images.splice(index, 1)
  }
}

// 处理文件超出限制
const handleExceed = () => {
  ElNotification.warning({
    title: '提示',
    message: `最多只能上传9张图片`
  })
}

// 上传前处理
const beforeUpload = (rawFile: File) => {
  // 检查文件类型
  const isImage = rawFile.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  
  // 检查文件大小
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
    // 添加到文件列表
    fileList.value.push({
      name: rawFile.name,
      url: base64Str,
      uid: Date.now() + Math.random()
    })
    // 添加到表单数据
    postForm.value.images.push(base64Str)
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
</style>
