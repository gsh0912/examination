<template>
  <div>
    <el-drawer
      v-model="drawer"
      title="试题详情"
      size="50%"
      :with-header="false"
    >
      <div class="top">
        <span>试题详情</span>
        <span></span>
        <el-icon @click="drawer = false"><CloseBold /></el-icon>
      </div>
      <div class="type">
        <span class="scores">{{ prop.ids.type }}</span>
        分值: <span class="scores">{{ prop.ids.scores }}</span>
      </div>

      <div class="title" v-html="prop.ids.title"></div>
      <div class="chooses" v-if="prop.ids.type === '单选题'">
        <div
          class="choose"
          v-for="data in prop.ids.answers"
          :key="data.id"
          :class="data.answerno === prop.ids.answer ? 'chooseed' : ''"
        >
          <el-radio-group v-model="prop.ids.answer">
            <el-radio disabled :label="data.answerno" size="large"
              >{{ data.answerno }} :
              <span class="radioContent">{{ data.content }}</span>
            </el-radio>
          </el-radio-group>
        </div>
      </div>
      <div v-if="prop.ids.type === '填空题'">
        <div class="isBox">
          <div class="is">
            <span>正确答案： </span><span> {{ prop.ids.answer }}</span>
          </div>
        </div>
        <div class="parseBox">
          <div class="parse">
            <span> 答案解析：{{ prop.ids.explains }}</span>
          </div>
        </div>
      </div>
      <div v-if="prop.ids.type === '判断题'">
        <div class="isBox">
          <div class="is">
            <span>正确答案： </span><span>{{ prop.ids.answer }}</span>
          </div>
        </div>
      </div>
      <div v-if="prop.ids.type === '多选题'">
        <el-checkbox-group class="chooses" v-model="prop.ids.answer">
          <div
            v-for="data in prop.ids.answers"
            :key="data.id"
            class="choose"
            :class="
              prop.ids.answer.indexOf(data.answerno) !== -1 ? 'chooseed' : ''
            "
          >
            <el-checkbox :label="data.answerno" disabled>
              {{ data.answerno }} :
              <span class="radioContent">{{ data.content }}</span>
            </el-checkbox>
          </div>
        </el-checkbox-group>
      </div>
      <div class="parseBox" v-if="prop.ids.type === '问答题'">
        <div class="parse">
          <span> 答案解析：{{ prop.ids.explains }}</span>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, nextTick,onMounted } from 'vue';
import { CloseBold } from '@element-plus/icons-vue';

const drawer = ref(false);
defineExpose({
  drawer,
});
// 接受父组件的数据
let prop = defineProps({
  ids: {
    type: Object,
    required: true,
  },
  detailsType: {
    detailsType: String,
    required: true,
  },
})
console.log(prop.detailsType);

</script>
<style scoped lang="less">
.top {
  display: flex;
  justify-content: space-between;
  height: 60px;
  align-items: center;
  padding: 0 10px;
}
.type {
  padding: 10px 15px 0;
  span:first-of-type {
    margin-right: 20px;
    color: #666;
  }
  span:last-of-type {
    font-size: 14px;
    color: #999;
  }
}
.title {
  padding: 0 25px;
  font-size: 14px;
  margin-top: 10px;
  margin-bottom: 15px;
}
.chooses {
  padding: 0 15px;
}
.choose {
  padding: 0 15px;
  height: 40px;
  display: flex;
  align-items: center;
  border-radius: 3px;
  margin-top: 10px;
}
.el-radio__input.is-disabled + span.el-radio__label {
  color: #000;
}
.el-checkbox__input.is-disabled + span.el-checkbox__label {
  color: #000;
}
.chooseed {
  background-color: #f0faf6;
}
.isBox {
  padding: 0 15px;
  color: #84d5b1;
  font-size: 14px;
  border-radius: 3px;
  .is {
    padding: 0 15px;
    height: 40px;
    display: flex;
    align-items: center;
    background-color: #f0faf6;
  }
}
.parseBox {
  padding: 0 15px;
  margin-top: 20px;
  .parse {
    padding: 0 15px;
    height: 40px;
    display: flex;
    align-items: center;
    background-color: #f6faff;
    margin-right: 20px;
    color: #a0adbd;
    font-size: 14px;
    border-radius: 3px;
  }
}
</style>
