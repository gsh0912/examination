<template>
  <el-scrollbar
    :height="tableConfig.height ? tableConfig.height + 'vh' : '80vh'"
    :always="true"
  >
    <!-- 表格封装 -->
    <el-table
      ref="multipleTableRef"
      :lazy="true"
      :data="tableConfig.tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      :header-cell-style="{ backgroundColor: 'rgba(250, 250, 250)' }"
    >
      <el-table-column type="selection" v-if="tableConfig.isCheck" />
      <el-table-column
        align="center"
        v-for="(item, index) in tableData"
        :key="index"
        :fixed="item.fixed"
        :label="item.label"
        :width="item.width ? item.width : 'auto'"
      >
        <template #default="scope">
          <!-- 考试名称 -->
          <span
            @click="emit('onShowtest', scope.row)"
            v-if="item.prop === 'title'"
            class="col"
          >
            {{ scope.row.title }}
          </span>
          <!-- 题库 -->
          <span v-else-if="item.prop === 'titleA'" class="topic">
            <el-link type="primary" :underline="false">
              {{ scope.row.title }}
            </el-link>
          </span>
          <!-- 试卷名称 -->
          <span
            @click="emit('onshowexamination', scope.row)"
            v-else-if="item.prop === 'titleB'"
            class="topic"
          >
            <el-link type="primary" :underline="false">
              {{ scope.row.title }}
            </el-link>
          </span>
          <!-- 题目名称 -->
          <span
            @click="emit('onshowtestquestions', scope.row)"
            v-else-if="item.prop === 'titleC'"
            class="topic"
          >
            <el-link type="primary" :underline="false">
              {{ scope.row.title }}
            </el-link>
          </span>
          <!-- 更新时间 -->
          <span v-else-if="item.prop === 'addtime'">
            {{ moment(scope.row.addtime).format("YYYY-MM-DD HH:mm") }}
          </span>
          <!-- 阅卷title -->
          <span v-else-if="item.prop === 'titleK'">
            {{ scope.row.title }}
          </span>
          <!-- 阅卷状态 -->
          <span
            :style="{
              color: scope.row.state === '已阅卷' ? 'rgba(135, 92, 20)' : 'red',
            }"
            v-else-if="item.prop === 'stateA'"
          >
            {{ scope.row.state }}
          </span>
          <!-- 考试时间 -->
          <span v-else-if="item.prop === 'stuBeginTime'">
            {{ moment(scope.row.stuBeginTime).format("YYYY-MM-DD HH:mm") }}
          </span>
          <!-- 未判人数 -->
          <span style="color: red" v-else-if="item.prop === 'incomplete'">
            {{ scope.row.incomplete }}
          </span>
          <!-- 选择已有时间 题库名称 -->
          <span v-else-if="item.prop === 'questionB'">
            <div style="text-align: left; margin-left: 30%">
              <el-radio-group @change="onRadioTitle" v-model="radio">
                <el-radio :label="scope.row.id" size="large">{{
                  scope.row.title
                }}</el-radio>
              </el-radio-group>
            </div>
          </span>
          <!-- 考试状态 -->
          <span v-else-if="item.prop === 'state'">
            <el-link
              :underline="false"
              type="primary"
              v-show="scope.row.state === 1"
              >已发布</el-link
            >
            <el-link
              @click="$emit('onUpdateState', scope.row.id)"
              v-show="scope.row.state === 2"
              type="danger"
              >未发布</el-link
            >
          </span>
          <!-- 开放时间 -->
          <span v-else-if="item.prop === 'begintime'">
            <span v-if="scope.row.begintime && scope.row.endtime"
              >{{ moment(scope.row.begintime).format("YYYY-MM-DD HH:mm") }}至{{
                moment(scope.row.endtime).format("YYYY-MM-DD HH:mm")
              }}</span
            >
            <span v-else>不限</span>
          </span>
          <!-- 功能操作 -->
          <span v-else-if="item.prop === 'handle'">
            <span v-for="(item1, index1) in item.functions" :key="index1">
              <el-link
                @click="$emit(item1.event, scope.row)"
                class="mar"
                :type="item1.type ? item1.type : 'primary'"
                >{{ item1.text }}</el-link
              >
              <!-- 竖杠 -->
              <span
                v-if="index1 !== 2 && item.functions.length > 3 && index1 !== 5"
                >|</span
              >
            </span>
          </span>
          <!-- 普通列 -->
          <span class="size" v-else>{{ scope.row[item.prop] }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="paging-container">
      <!-- 分页 -->
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 20, 30]"
        :background="background"
        :small="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableConfig.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { ElTable } from "element-plus";
import type { ITable } from "../../types/table";
import { useMainStore } from "../../stores/dialog";
import moment from "moment"; // 时间格式化
const store = useMainStore();
const multipleSelection = ref([]); // 复选框选中一行的数据存放在里面
const emit = defineEmits([
  "onSelectMsg",
  "onPage",
  "onPsize",
  "onShowtest",
  "onSelectRadio",
  "onshowexamination",
  "onshowtestquestions",
]);
const radio = ref(0);
// 如果选中已有题库dialog关闭，单选框清零
watch(
  () => store.showTestpaperDialog,
  (newVal) => {
    if (!newVal) radio.value = 0;
  },
  { deep: true }
);
// tableConfig 表格配置
// tableData 表格数据
const props = withDefaults(
  defineProps<{
    tableConfig: any;
    tableData: Array<ITable>;
  }>(),
  {
    tableConfig: () => {},
    tableData: () => [],
  }
);
const currentPage = ref(1); // 默认页数
const pageSize = ref(10); // 默认每页多少条
const background = ref(true); // 是否显示分页背景样式
// 每页多少条
const handleSizeChange = (val: number) => {
  emit("onPsize", val);
};
// 多少页
const handleCurrentChange = (val: number) => {
  emit("onPage", val);
};
// 获取复选框选中信息
const handleSelectionChange = (val: any) => {
  if (props.tableConfig.flag) {
    emit("onSelectMsg", val);
  } else {
    multipleSelection.value = val.map((item: any) => item.id);
    emit("onSelectMsg", multipleSelection.value);
  }
};
// 选择试卷获取id
const onRadioTitle = (id: number) => {
  emit("onSelectRadio", id);
};
</script>
<style lang="less" scoped>
:deep(.cell) {
  text-align: center;
  font-size: 12px;
}
.col {
  color: #409eff;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
.mar {
  margin: 0 3px;
}
.col {
  color: #409eff;
  cursor: pointer;
}
.mar {
  margin: 0 3px;
}

.paging-container {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}
.mar {
  margin: 0 3px;
}
</style>
