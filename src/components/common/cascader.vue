<template>
  <div>
    <el-cascader v-model="value" :options="options" :props="cascaderProps" @change="cascaderChange" clearable />
  </div>
</template>

<script setup lang="ts">
import { defineProps,defineEmits,ref,defineExpose } from 'vue';
let value = ref<string>()
interface Iprops {
  value: string,
  label: string,
  children?: []
}
const props = withDefaults(defineProps<{
  cascaderProps: Iprops,
  options: Array<Iprops>
}>(), {
  cascaderProps: () => {
    return { value: 'id', label: 'name', children: [] }
  }
})
const emits=defineEmits(['getDepid'])
const cascaderChange=(val:any)=>{
  
  console.log(val)
  emits('getDepid',val)
  // student.depid=val
  // console.log(student.depid)
}
defineExpose({
  value
})
</script>

<style scoped></style>