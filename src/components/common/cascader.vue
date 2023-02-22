<template>
  <div>
    <el-cascader :options="options" :props="cascaderProps" @change="cascaderChange" clearable />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
interface Iprops {
  value: string,
  label: string,
  children?: []
}
const props = withDefaults(defineProps<{
  cascaderProps: Iprops,
  options: Array<Iprops>,
  cascaderChange: Function
}>(), {
  cascaderProps: () => {
    return { value: 'id', label: 'name', children: [] }
  }
})

const cascaderChange = (val: Array<number>) => {
  console.log(val);
}
console.log(props.options);
</script>

<style scoped></style>