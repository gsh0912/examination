<template>
  <div>
    <el-dialog v-model="dialogVisible" title="Tips" width="30%" :before-close="handleClose">
      <span>This is a message</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="dialogVisible = false">
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, defineExpose } from 'vue'
import { ElMessageBox } from 'element-plus'

let dialogVisible = ref(false)

defineExpose({
  dialogVisible
})

// 点击旁白或关闭按钮 关闭dialog弹窗
const handleClose = (done: () => void) => {
  ElMessageBox.confirm('Are you sure to close this dialog?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}
</script>

<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>