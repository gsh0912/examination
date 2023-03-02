<template>
  <div>
    <el-cascader :options="options" :props="cascaderProps" @change="cascaderChange" clearable />
  </div>
</template>

<script setup lang="ts">
import { defineProps,defineEmits } from 'vue';
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
  
  // console.log(val)
  emits('getDepid',val)
  // student.depid=val
  // console.log(student.depid)
}
</script>

<style scoped></style>