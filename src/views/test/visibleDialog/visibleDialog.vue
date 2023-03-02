<template>
  <el-dialog v-model="dialogVisible" :title="props.visibleTitle" width="40%">
    <el-transfer v-model="value" :titles="['全选', '未选']" @left-check-change="left" @right-check-change="right"
      :data="data" />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="visibleFn">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, defineExpose, defineProps, onMounted,nextTick } from 'vue'
import { ElMessageBox } from 'element-plus'
import { reqStudent } from '../../../api/test'

// 
const visibleFn = () => {
  dialogVisible.value = false
  console.log(value.value);
}

// 穿梭框
interface Option {
  key: number
  label: string
  disabled: boolean
}

const left = (e: any) => {
  console.log(e);
  value.value = value.value.concat(e)
}
const right = () => {
  console.log(111);
}
// 点击事件  

const id = ref(0)
const getStudentList = async () => {
  let res = await reqStudent({
    id: id.value
  })
  console.log(res.data.list);
}

const data = ref<Option[]>()
const value = ref([])
// 控制dialog显示隐藏 
const dialogVisible = ref(false)
// 接受父组件传来的数据
const props = defineProps({
  // dialog标题
  visibleTitle: {
    type: String
  }
})
// 暴露自己的属性 用于显示隐藏
defineExpose({
  dialogVisible,
  id,
  getStudentList
})
</script>
<style scoped lang="less">
.el-transfer {
  display: flex;
  justify-content: space-between;
}

:deep(.el-transfer-panel) {
  width: 300px;

  .el-transfer-panel__body {
    height: 400px;
  }
}

.dialog-footer button:first-child {
  margin-right: 10px;
}

:deep(.el-transfer__buttons) {
  display: none;
}
</style>
