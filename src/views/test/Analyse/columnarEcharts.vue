<template>
  <div ref="root" class="eacharts">
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineExpose } from 'vue';
import * as echarts from 'echarts';
import columnarOptions from '../echartsOptions/columnarChartOptions'
onMounted(() => {
  init()
})
// 图表相关的配置项
const options = ref(columnarOptions)
// 基于准备好的dom，初始化echarts实例
let root = ref()
const myChart = ref()
const init = () => {
  // 基于准备好的dom，初始化echarts实例
  myChart.value = echarts.init(root.value);
  // 绘制图表
  myChart.value.setOption(options.value);
  window.onresize = function () {
    myChart.value.resize();
  };
}
defineExpose({
  options,
  myChart
})
</script>

<style scoped lang="less">
.eacharts {
  height: 350px;
  width: 840px;
}
</style>