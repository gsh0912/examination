<template>
  <header>
    <span>{{ title }}</span>
    <slot></slot>
  </header>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    title: string;
  }>(),
  {
    title: "标题",
  }
);
</script>
<style lang="less" scoped>
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 34px;
  margin-bottom: 10px;
  span {
    font-size: 20px;
  }
}
</style>
