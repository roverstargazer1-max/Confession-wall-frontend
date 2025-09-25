<template>
  <div class="post-container">
    <el-card>
      <div slot="header"> 
        <!-- 标题 -->
        <h2>发布表白</h2>
      </div>
      <el-form :model="postForm" :rules="rules" ref="postFormRef" label-width="80px">
        <el-form-item label="誓约" prop="content">
            <!-- 表白内容框 -->
          <el-input
            type="textarea"
            v-model="postForm.content"
            placeholder="当人们听着同一首音乐时，心境会不会向着同一个方向趋近呢……指挥官，要试试吗？"
            :rows="5"
          ></el-input>
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
//导入组件
import { ref, onMounted } from 'vue'
import { usePostStore } from '@/stores/post'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/user'

const postStore = usePostStore()
const router = useRouter()
const postFormRef = ref()

//定义表单数据变量
const postForm = ref({
  content: '',
  isAnonymous: false,
  isPublic: true
})

//定义表单验证规则
const rules = ref({
  content: [
    { required: true, message: '请输入表白内容', trigger: 'blur' },
    { min: 1, max: 500, message: '内容长度在 1 到 500 个字符', trigger: 'blur' }
  ]
})


// 定义发布按钮点击事件
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

//定义取消按钮点击事件
const handleCancel = () => {
  router.back()
}

onMounted(() => {
  // 初始化帖子数据
  postStore.initPosts()
})
</script>

<!-- CSS 到时候再改改 -->
<style scoped>
.post-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 20px;
}
</style>