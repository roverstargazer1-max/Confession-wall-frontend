import { ElMessage, ElMessageBox } from 'element-plus'

// 按照约定，组合式函数名以 "use" 开头
export function useConfirm() {

  /**
   * 显示一个确认对话框
   * @param content 提示内容
   * @param title 提示标题
   * @returns Promise<void> - 用户点击“确定”时，Promise会成功解析；点击“取消”则会失败并被捕获。
   */
  const showConfirm = (content: string, title = '提示') => {
    return ElMessageBox.confirm(
      content,
      title,
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
  }

  // 将需要暴露给外部使用的函数返回
  return {
    showConfirm
  }
}
