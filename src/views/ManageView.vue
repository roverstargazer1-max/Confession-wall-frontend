<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import type { Post, User } from '@/types/HomeType'
import { otherPostGetApi, type otherPostGet } from '@/api/otherUser'
import { useUserStore } from '@/stores/user'
import { ChatDotRound, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { deletePostApi, revisePostApi } from '@/api/manage'
import type { UploadUserFile } from 'element-plus'
import { computed } from 'vue'
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)
const userPosts = ref<Post[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const editDialogVisible = ref(false)
const fileList = ref<UploadUserFile[]>([])
const editingPostData = reactive({
  postId: 0,
  newTitle: '',
  newContent: '',
  anonymity: false,
  isPublic: true
})

// 【修改】为 urlToFile 函数增加 try...catch 错误处理
async function urlToFile(url: string, filename: string): Promise<File | null> {
  try {
    // 1. 使用 fetch 下载图片数据
    const response = await fetch(url)
    // 【新增】检查网络请求是否成功
    if (!response.ok) {
      // 如果请求失败（如 404 Not Found），则抛出错误
      throw new Error(`Network response was not ok for url: ${url}`);
    }
    // 2. 将响应体转换为 Blob 对象
    const blob = await response.blob()
    // 3. 从 Blob 创建 File 对象
    return new File([blob], filename, { type: blob.type })
  } catch (error) {
    // 【新增】如果 fetch 或后续操作失败，在此捕获错误
    console.error(`无法将URL转换为文件: ${url}`, error)
    // 返回 null，表示转换失败
    return null
  }
}

const fetchUserPosts = async (id: number) => {
  // ... 此函数保持不变
  if (isNaN(id)) {
    error.value = '无效的用户ID'
    return
  }
  isLoading.value = true
  error.value = null
  try {
    const apiParams: otherPostGet = { userId: id }
    const postsResponse = await otherPostGetApi(apiParams)
    if (postsResponse.data.code === 200) {
      userPosts.value = postsResponse.data.data
    } else {
      throw new Error(postsResponse.data.message || '获取您的帖子失败')
    }
  } catch (err: any) {
    console.error('获取用户帖子失败:', err)
    error.value = err.message || '加载帖子时发生未知错误。'
  } finally {
    isLoading.value = false
  }
}

const handleEdit = (post: Post) => {
  // ... 此函数保持不变
  editingPostData.postId = post.postId
  editingPostData.newTitle = post.title || ''
  editingPostData.newContent = post.content
  editingPostData.anonymity = post.anonymity
  editingPostData.isPublic = post.isPublic

  // 【修改】在这里添加一个判断，安全地处理 post.pictures 可能为 null 的情况
  fileList.value = post.pictures // 先判断 post.pictures 是否为真（即不是 null）
    ? post.pictures.map((pic) => ({ // 如果是真，则执行 .map
        name: pic.url.substring(pic.url.lastIndexOf('/') + 1),
        url: pic.url,
        uid: Date.now() + Math.random()
      }))
    : [] // 如果是假 (null)，则赋值为空数组

  editDialogVisible.value = true
}

// 【重大修改】处理更新操作，将所有图片转换为 File 对象再提交
const handleUpdate = async () => {
  const formData = new FormData()

  // 1. 追加文本数据
  formData.append('newTitle', editingPostData.newTitle)
  formData.append('newContent', editingPostData.newContent)
  formData.append('anonymity', String(editingPostData.anonymity))
  formData.append('isPublic', String(editingPostData.isPublic))

  // 2. 处理图片：将所有图片（新旧）转换为 File 对象
  const filePromises = fileList.value.map((file) => {
    if (file.raw) {
      // a. 如果是新上传的文件，直接返回 File 对象
      return Promise.resolve(file.raw)
    } else if (file.url) {
      // b. 如果是已存在的图片，调用辅助函数将其URL转为 File 对象
      return urlToFile(file.url, file.name)
    }
    return Promise.resolve(null)
  })

  // 等待所有图片都处理完毕
  const allFiles = (await Promise.all(filePromises)).filter(Boolean) as File[]

  // 3. 将所有处理好的 File 对象追加到 FormData 中
  if (allFiles.length > 0) {
    allFiles.forEach((file) => {
      formData.append('pictures', file)
    })
  } else {
    // 如果一张图片都没有，可能需要传一个空值，这取决于后端如何处理
    formData.append('pictures', ''); // 如果后端需要这个来清空图片，则取消注释
  }


  try {
    // 4. 调用 API
    console.log('--- 开始检查 FormData 内容 ---');
    for (let [key, value] of formData.entries()) {
      console.log(key, ':', value);
    }
    console.log('--- FormData 内容检查完毕 ---');
    const response = await revisePostApi(formData, editingPostData.postId)
    console.log('后端返回的数据:', response.data);

    // 【新增】检查响应码，处理成功和失败两种情况
    if (response.data.code === 200) {
      ElMessage.success('帖子更新成功');
      editDialogVisible.value = false;

      // 【修改】不再手动更新列表，而是直接重新从服务器获取最新的帖子列表
      // 这可以确保数据的完全一致性
      if (userInfo.value && typeof userInfo.value.id === 'number') {
        fetchUserPosts(userInfo.value.id);
      }

    } else {
      // 如果 code 不是成功码，则显示后端的错误信息
      ElMessage.error(response.data.msg || '更新失败，请稍后再试')
    }

  } catch (err) {
    console.error('更新帖子失败:', err)
    ElMessage.error('更新失败，网络错误或服务异常')
  }
}

const handleDelete = (postToDelete: Post) => {
  // ... 此函数保持不变
  ElMessageBox.confirm('确定要删除这篇帖子吗？此操作无法撤销。', '警告', {
    confirmButtonText: '确定删除',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        await deletePostApi({ postId: postToDelete.postId })
        userPosts.value = userPosts.value.filter((post) => post.postId !== postToDelete.postId)
        ElMessage.success('删除成功')
      } catch (err) {
        console.error('删除帖子失败:', err)
        ElMessage.error('删除失败，请稍后再试')
      }
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

onMounted(() => {
  // ... 此函数保持不变
  if (userInfo.value && typeof userInfo.value.id === 'number') {
    fetchUserPosts(userInfo.value.id)
  } else {
    error.value = '无法获取您的用户信息，请尝试重新登录。'
  }
})
</script>

<template>
  <div class="user-profile-container">
    <div v-if="isLoading" class="loading-tip">正在加载您的帖子...</div>
    
    <div v-else-if="error" class="error-tip">
      <p>抱歉，加载失败</p>
      <p class="error-message">{{ error }}</p>
    </div>

    <div v-else-if="userInfo" class="profile-content">
      <header class="profile-header">
        <el-avatar :size="80" :src="userInfo.portrait || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"  />
        <div class="user-details">
          <h1>{{ userInfo.name }}</h1>
          <span class="username">@{{ userInfo.username }}</span>
        </div>
      </header>
      
      <div class="user-posts-section">
        <h2>我发布的帖子</h2>
        <div v-if="userPosts.length > 0" class="posts-list">
          <div v-for="post in userPosts" :key="post.postId" class="post-card">
            <div class="post-header">
              <div class="card-actions">
                <el-button class="edit-btn" @click="handleEdit(post)"> 编辑 </el-button>
                <el-button class="delete-btn" @click="handleDelete(post)"> 删除 </el-button>
              </div>
            </div>
            <div class="post-content">
              <h3 v-if="post.title" class="post-title">{{ post.title }}</h3>
              <p>{{ post.content }}</p>
            </div>
            <div
              v-if="post.pictures && post.pictures.length > 0"
              class="post-pictures"
              :class="`grid-${Math.min(post.pictures.length, 9)}`"
            >
              <div
                v-for="(picture, index) in post.pictures"
                :key="index"
                class="picture-item"
              >
                <el-image
                  :src="picture.url"
                  fit="cover"
                  lazy
                  :preview-src-list="post.pictures.map(p => p.url)"
                  :initial-index="index"
                />
              </div>
            </div>
            <div class="post-footer">
               <div class="action-item">
                  <el-icon><ChatDotRound /></el-icon>
                  <span>{{ post.comments > 0 ? post.comments : '评论' }}</span>
               </div>
               <div class="action-item">
                  <span :style="{ color: post.liked ? 'red' : 'inherit' }">❤️</span>
                  <span>{{ post.likes > 0 ? post.likes : '点赞' }}</span>
               </div>
            </div>
          </div>
        </div>
        <div v-else class="no-posts-tip">
          <p>您还没有发布任何帖子。</p>
        </div>
      </div>
    </div>
  </div>

  <el-dialog v-model="editDialogVisible" title="编辑帖子" width="600px">
    <el-form :model="editingPostData" label-width="80px">
      <el-form-item label="标题">
        <el-input v-model="editingPostData.newTitle" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="内容">
        <el-input
          v-model="editingPostData.newContent"
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
        ></el-input>
      </el-form-item>
      <el-form-item label="图片">
        <el-upload
          v-model:file-list="fileList"
          action="#"
          list-type="picture-card"
          :auto-upload="false"
          multiple
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="选项">
        <el-checkbox v-model="editingPostData.anonymity">匿名发送</el-checkbox>
        <el-checkbox v-model="editingPostData.isPublic">公开帖子</el-checkbox>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleUpdate"> 保存 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.user-profile-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}
.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #ebeef5;
}
.user-details h1 {
  margin: 0;
  font-size: 24px;
}
.user-details .username {
  color: #909399;
  font-size: 16px;
}
.user-posts-section h2 {
  font-size: 20px;
  margin-bottom: 1.5rem;
  color: #303133;
}
.loading-tip,
.no-posts-tip {
  text-align: center;
  color: #909399;
  padding: 40px 20px;
  font-size: 16px;
}
.error-tip {
  text-align: center;
  padding: 40px 20px;
  color: #f56c6c;
}
.error-message {
  font-size: 14px;
  color: #909399;
}
.posts-list {
  overflow: visible;
}
.post-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}
.user-info {
  margin-left: 15px;
}
.hostname {
  font-weight: bold;
  font-size: 16px;
}
.post-content .post-title {
  margin-top: 0;
  margin-bottom: 8px;
}
.post-content p {
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
}
.post-pictures {
  margin-top: 15px;
  display: grid;
  gap: 8px;
}
.grid-1 {
  grid-template-columns: minmax(0, 2fr);
}
.grid-2 {
  grid-template-columns: repeat(2, 1fr);
}
.grid-3 {
  grid-template-columns: repeat(3, 1fr);
}
.grid-4 {
  grid-template-columns: repeat(2, 1fr);
}
.grid-5,
.grid-6,
.grid-7,
.grid-8,
.grid-9 {
  grid-template-columns: repeat(3, 1fr);
}
.picture-item .el-image {
  width: 100%;
  height: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 6px;
  object-fit: cover;
}
.post-footer {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #ebeef5;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: #8a919f;
}
.action-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}
.card-actions {
  margin-left: auto;
}
</style>