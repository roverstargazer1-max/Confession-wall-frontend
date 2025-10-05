<template>
  <div class="post-editor-container">
    <el-card class="post-card" header="在这里表示爱意">
      <el-alert
        v-if="postStore.error"
        :title="postStore.error"
        type="error"
        show-icon
        closable
        @close="postStore.clearError()"
        style="margin-bottom: 20px;"
      />
      
      <el-form 
        :model="formData" 
        :rules="formRules" 
        ref="postFormRef"
        label-width="100px"
      >
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="formData.title"
            placeholder="给表白起个标题吧"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="在这里表白" prop="content">
          <el-input
            v-model="formData.content"
            type="textarea"
            :rows="5"
            placeholder="指挥官有什么想对我说的吗？"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="图片在这里哦">
          <el-upload
            action="#"
            list-type="picture-card"
            v-model:file-list="formData.images" 
            :before-upload="beforeImageUpload"
            :limit="9"
            :on-exceed="handleExceed"
            :auto-upload="false"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip">最多上传9张图片，每张不超过2MB</div>
        </el-form-item>
        
        <el-form-item label="发布选项">
          <el-space direction="vertical" alignment="flex-start">
            <el-checkbox v-model="formData.anonymity">
              匿名发送
            </el-checkbox>
            
            <el-checkbox v-model="formData.isPublic">
              公开帖子
            </el-checkbox>

            </el-space>
        </el-form-item>
        
        <el-form-item>
          <el-space>
            <el-button 
              type="primary" 
              @click="handleSubmit"
              :loading="postStore.loading"
            >
              立即发布
            </el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-space>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage, type UploadProps, type FormInstance, type UploadFile } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { usePostStore } from '@/stores/personalPosts';
import type { CreatePostRequest } from '@/types/index';

// 定义与表单绑定的数据类型
interface PostFormData {
  title: string;
  content: string;
  anonymity: boolean; // 【修改】
  isPublic: boolean;
  images: UploadFile[];
}

const postStore = usePostStore();
const postFormRef = ref<FormInstance>();

// 【修改】更新表单数据
const formData = reactive<PostFormData>({
  title: '',
  content: '',
  anonymity: false,
  isPublic: true,
  images: []
});

// 【修改】更新表单验证规则
const formRules = {
  title: [
    { required: true, message: '标题不能为空哦', trigger: 'blur' },
  ],
  content: [
    { required: true, message: '指挥官没什么想对我说的吗', trigger: 'blur' },
    { min: 5, message: '说的太少的话，想表达的东西都会传达不到哦', trigger: 'blur' },
  ]
};

// 图片上传处理
const beforeImageUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const isValidType = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'].includes(rawFile.type);
  if (!isValidType) {
    ElMessage.error('图片格式不支持!');
    return false;
  }
  return true;
};

const handleExceed: UploadProps['onExceed'] = () => {
  ElMessage.warning('最多只能上传9张图片');
};

// 表单提交
const handleSubmit = async () => {
  if (!postFormRef.value) return;

  try {
    await postFormRef.value.validate();

    const imageFiles: File[] = formData.images.map(file => file.raw!).filter(Boolean);

    // 【修改】准备提交的数据，与API对齐
    const postData: CreatePostRequest = {
      title: formData.title,
      content: formData.content,
      images: imageFiles,
      anonymity: formData.anonymity,
      isPublic: formData.isPublic,
    };

    const success = await postStore.createPost(postData);
    
    if (success) {
      ElMessage.success('发布成功');
      handleReset();
    }
    
  } catch (error) {
    console.error('表单验证失败:', error);
  }
};

// 重置表单
const handleReset = () => {
  postFormRef.value?.resetFields();
  formData.images = [];
  formData.anonymity = false;
  formData.isPublic = true;
};
</script>

<style scoped>
/* 样式保持不变 */
.post-editor-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
.post-card {
  border-radius: 8px;
}
.upload-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}
</style>