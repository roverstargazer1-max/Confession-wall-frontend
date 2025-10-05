<script setup lang="ts">
import type { PaginatedResponse, Post } from '@/types';
import { Loading } from '@element-plus/icons-vue';
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus';
import { apiService } from '@/api/postapi';



const post = ref<Post[]>([]);
const loading = ref(false);
const saving = ref(false);
const editDialogVisible = ref(false);
const editFormRef = ref<FormInstance>();
const currentPost = ref<Post | null>(null);

//分页设置
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

//编辑表单
const editForm = reactive({
  title: '',
  content: '',
  status: 'draft' as 'draft' | 'published'
});

//表单验证规则
const editRules: FormRules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 1, max: 100, message: '标题长度在 1 到 100 个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入内容', trigger: 'blur' },
    { min: 1, max: 1000, message: '内容长度在 1 到 1000 个字符', trigger: 'blur' }
  ]
};

// 页面加载时自动获取数据
onMounted(() => {
  fetchPosts();
});

//fetchPosts做的事情大致就是，一开始帖子列表是空的，点击刷新会获取帖子
const fetchPosts = async () => {
  try {
    loading.value = true;
    const response: PaginatedResponse<Post> = await apiService.getUserPosts(
      pagination.page,
      pagination.pageSize
    );
    
    posts.value = response.items;
    pagination.total = response.total;
  } catch (error) {
    ElMessage.error('获取帖子列表失败');
    console.error('Error fetching posts:', error);
  } finally {
    loading.value = false;
  }
};

//分页交互
//每页条数
const handleSizeChange = (newSize: number) => {
  pagination.pageSize = newSize;
  pagination.page = 1;
  fetchPosts();
};

//页码数
const handleCurrentChange = (newPage: number) => {
  pagination.page = newPage;
  fetchPosts();
};

//编辑
const handleEdit = (post: Post) => {
  currentPost.value = post;
  editForm.title = post.title;
  editForm.content = post.content;
  editForm.status = post.status;
  editDialogVisible.value = true;
};


//删除
const handleDelete = async (post: Post) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除帖子 "${post.title}" 吗？此操作不可恢复。`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );

    await apiService.deletePost(post.id);
    ElMessage.success('删除成功');
    fetchPosts(); // 重新加载列表
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败');
      console.error('Error deleting post:', error);
    }
  }
};

//保存编辑内容
const handleSave = async () => {
  if (!editFormRef.value || !currentPost.value) return;

  try {
    const valid = await editFormRef.value.validate();
    if (!valid) return;

    saving.value = true;
    await apiService.updatePost(currentPost.value.id, editForm);
    
    ElMessage.success('保存成功');
    editDialogVisible.value = false;
    fetchPosts(); // 重新加载列表
  } catch (error) {
    ElMessage.error('保存失败');
    console.error('Error saving post:', error);
  } finally {
    saving.value = false;
  }
};

//转时间格式
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN');
};
</script>

<template>
  <div class="user-post-container">
    <el-card class="post-card">
      <template #header>
        <div class="card-header">
          <h2>我的帖子</h2>
          <el-button
          type="primary"
          @click="fethchPosts"
          :Loading="Loading">
            刷新
          </el-button>
        </div>
      </template>
      <!-- 帖子列表 -->
      <el-table 
        :data="posts" 
        v-loading="loading"
        empty-text="暂无帖子"
        class="posts-table">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" min-width="200">
          <template #default="{ row }">
            <span class="post-title">{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'published' ? 'success' : 'info'">
              {{ row.status === 'published' ? '已发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column prop="likes" label="点赞" width="80" />
        <el-table-column prop="comments" label="评论" width="80" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button 
              size="small" 
              @click="handleEdit(row)"
              :disabled="row.status === 'published'"
            >
              编辑
            </el-button>
            <el-button 
              size="small" 
              type="danger" 
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页功能实现 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[5, 10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 编辑对话框 -->
     <el-dialog
      v-model="editDialogVisible"
      :title="`编辑帖子 - ${currentPost?.title}`"
      width="600px"
    >
      <el-form 
        :model="editForm" 
        :rules="editRules" 
        ref="editFormRef"
        label-width="80px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="editForm.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input 
            v-model="editForm.content" 
            type="textarea" 
            :rows="6"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="editForm.status">
            <el-radio label="draft">草稿</el-radio>
            <el-radio label="published">发布</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      
       <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button 
          type="primary" 
          @click="handleSave"
          :loading="saving"
        >
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.user-posts-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.posts-table {
  margin-bottom: 20px;
}

.post-title {
  font-weight: 500;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
