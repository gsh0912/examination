<template>
  <el-dialog v-model="dialogVisible" :title="props.visibleTitle" width="50%">
    <el-transfer v-model="value"
    :titles="['全选', '未选']"
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
import { ref, defineExpose, defineProps } from 'vue'
import { ElMessageBox } from 'element-plus'

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

const generateData = () => {
  const data: Option[] = []
  for (let i = 1; i <= 15; i++) {
    data.push({
      key: i,
      label: `Option ${i}`,
      disabled: i % 4 === 0,
    })
  }
  return data
}

const data = ref<Option[]>(generateData())
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
  dialogVisible
})
</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
