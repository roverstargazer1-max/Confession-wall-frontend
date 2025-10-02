<template>
  <div class="post-editor-container">
    <el-card class="post-card" header="在这里表示爱意">
      <!-- 错误提示 -->
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
        <!-- 表白内容 -->
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
        
        <!-- 图片上传 -->
        <el-form-item label="图片在这里哦">
          <el-upload
            action="#"
            list-type="picture-card"
            :file-list="fileList"
            :before-upload="beforeImageUpload"
            :on-remove="handleImageRemove"
            :on-change="handleImageChange"
            :limit="9"
            :on-exceed="handleExceed"
            :auto-upload="false"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip">最多上传9张图片，每张不超过2MB</div>
        </el-form-item>
        
        <!-- 发布选项 -->
        <el-form-item label="发布选项">
          <el-space direction="vertical">
            <el-checkbox v-model="formData.isAnonymous">
              匿名发送
            </el-checkbox>
            
            <el-checkbox v-model="formData.isPublic">
              公开帖子
            </el-checkbox>
            
            <el-popover
              placement="right"
              :width="300"
              trigger="click"
            >
              <template #reference>
                <el-button link type="primary">
                  {{ formData.scheduledTime ? '已设置定时发送' : '设置定时发送' }}
                </el-button>
              </template>
              <div class="schedule-picker">
                <div class="schedule-header">
                  <span>选择发送时间</span>
                  <el-button 
                    link 
                    type="danger" 
                    @click="clearSchedule"
                    v-if="formData.scheduledTime"
                  >
                    清除
                  </el-button>
                </div>
                <el-date-picker
                  v-model="formData.scheduledTime"
                  type="datetime"
                  placeholder="选择日期时间"
                  :disabled-date="disabledDate"
                  :shortcuts="dateShortcuts"
                />
              </div>
            </el-popover>
            
            <div 
              v-if="formData.scheduledTime" 
              class="schedule-display"
            >
              定时发送时间: {{ formatScheduleTime(formData.scheduledTime) }}
            </div>
          </el-space>
        </el-form-item>
        
        <!-- 操作按钮 -->
        <el-form-item>
          <el-space>
            <el-button 
              type="primary" 
              @click="handleSubmit"
              :loading="postStore.loading"
            >
              {{ formData.scheduledTime ? '定时发布' : '立即发布' }}
            </el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-space>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, type UploadProps, type FormInstance } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { usePostStore } from '@/stores/post';
import type { CreatePostRequest, UploadImage, PostFormData } from '@/types';

const router = useRouter();
const postStore = usePostStore();

// 表单引用
const postFormRef = ref<FormInstance>();
const fileList = ref<UploadImage[]>([]);

// 表单数据
const formData = reactive<PostFormData>({
  content: '',
  isAnonymous: false,
  isPublic: true,
  scheduledTime: null,
  images: []
});

// 表单验证规则
const formRules = {
  content: [
    { required: true, message: '指挥官没什么想对我说的吗', trigger: 'blur' },
    { min: 5, message: '说的太少的话，想表达的东西都会传达不到哦', trigger: 'blur' },
    { max: 500, message: '说的太多的话，想表达的会淹没在琐碎中哦', trigger: 'blur' }
  ]
};

// 日期选择器配置
const disabledDate = (time: Date) => {
  return time.getTime() < Date.now() - 8.64e7;
};

const dateShortcuts = [
  {
    text: '1小时后',
    value: () => {
      const date = new Date();
      date.setTime(date.getTime() + 3600 * 1000);
      return date;
    }
  },
  {
    text: '明天此时',
    value: () => {
      const date = new Date();
      date.setTime(date.getTime() + 3600 * 1000 * 24);
      return date;
    }
  }
];

// 图片上传处理
const beforeImageUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const isValidType = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(rawFile.type);
  const isValidSize = rawFile.size / 1024 / 1024 < 2;

  if (!isValidType) {
    ElMessage.error('图片必须是 JPG/PNG/GIF/WEBP 格式!');
    return false;
  }
  if (!isValidSize) {
    ElMessage.error('图片大小不能超过 2MB!');
    return false;
  }
  return true;
};

const handleImageChange: UploadProps['onChange'] = (uploadFile) => {
  const newImage: UploadImage = {
    url: URL.createObjectURL(uploadFile.raw!),
    file: uploadFile.raw,
    uid: uploadFile.uid,
    name: uploadFile.name
  };
  
  const existingIndex = formData.images.findIndex(img => img.uid === uploadFile.uid);
  if (existingIndex === -1) {
    formData.images.push(newImage);
    fileList.value.push(newImage);
  }
};

const handleImageRemove: UploadProps['onRemove'] = (uploadFile) => {
  const index = formData.images.findIndex(file => file.uid === uploadFile.uid);
  if (index !== -1) {
    formData.images.splice(index, 1);
  }
  
  const fileListIndex = fileList.value.findIndex(file => file.uid === uploadFile.uid);
  if (fileListIndex !== -1) {
    fileList.value.splice(fileListIndex, 1);
  }
};

const handleExceed: UploadProps['onExceed'] = () => {
  ElMessage.warning('最多只能上传9张图片');
};

// 定时发送相关
const clearSchedule = () => {
  formData.scheduledTime = null;
};

const formatScheduleTime = (time: string) => {
  return new Date(time).toLocaleString('zh-CN');
};

// 表单提交
const handleSubmit = async () => {
  if (!postFormRef.value) return;

  try {
    await postFormRef.value.validate();

    // 准备图片文件
    const imageFiles: File[] = [];
    for (const imageFile of formData.images) {
      if (imageFile.file) {
        imageFiles.push(imageFile.file);
      }
    }

    // 准备提交数据
    const postData: CreatePostRequest = {
      content: formData.content,
      images: imageFiles,
      isAnonymous: formData.isAnonymous,
      isPublic: formData.isPublic,
      ...(formData.scheduledTime && { scheduledTime: formData.scheduledTime })
    };

    // 使用PostStore创建帖子
    const success = await postStore.createPost(postData);
    
    if (success) {
      ElMessage.success(formData.scheduledTime ? '定时发布设置成功' : '发布成功');
      handleReset();
      // 可以选择跳转到帖子列表页
      // router.push('/posts');
    }
    
  } catch (error) {
    console.error('发布失败:', error);
    // 错误信息已经在store中设置，这里不需要额外处理
  }
};

// 重置表单
const handleReset = () => {
  postFormRef.value?.resetFields();
  fileList.value = [];
  formData.images = [];
  formData.scheduledTime = null;
  formData.isPublic = true;
  formData.isAnonymous = false;
};
</script>

<style scoped>
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

.schedule-picker {
  padding: 10px 0;
}

.schedule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.schedule-display {
  font-size: 12px;
  color: #67c23a;
  margin-top: 5px;
}
</style>