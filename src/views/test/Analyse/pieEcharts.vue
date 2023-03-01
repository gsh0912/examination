<template>
  <div ref="root" class="eacharts">
    123123
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineExpose } from 'vue';
import * as echarts from 'echarts';
import { pieChartOption } from '../echartsOptions/pieChartOption'
// 基于准备好的dom，初始化echarts实例
let root = ref()
let options = ref(pieChartOption)
onMounted(() => {
  init()
})

const myChart = ref()
const init = () => {
  // 基于准备好的dom，初始化echarts实例
  myChart.value = echarts.init(root.value);
  // 绘制图表
  myChart.value.setOption(options.value);
}
defineExpose({
  options,
  myChart
})
</script>

<style scoped lang="less">
.eacharts {
  height: 350px;
  width: 440px;
}
</style>