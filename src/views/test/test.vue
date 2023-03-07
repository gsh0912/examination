<template>
  <header>
    <div class="left">考试管理</div>
    <div class="right">
      <el-button type="primary" @click="createTest">创建考试</el-button>
    </div>
  </header>
  <!-- 搜索 -->
  <div class="search">
    关键字
    <el-input
      v-model="tableData.listConfig.key"
      placeholder="考试名称"
      style="width: 130px; margin: 0 10px"
      clearable
      @keyup.enter="searchFn"
    />
    创建人
    <el-input
      v-model="tableData.listConfig.admin"
      @input="inpAdmin"
      placeholder="创建人"
      style="width: 130px; margin: 0 10px"
      clearable
    />
    <div class="ismy">
      <el-checkbox
        v-model="ismy"
        @change="stateChange"
        label="我创建的"
        size="large"
      />
    </div>
    <div class="openTime">
      开放时间
      <el-radio-group v-model="tableData.listConfig.opentime" class="ml-4">
        <el-radio :label="1" size="large">永久开放</el-radio>
        <el-radio :label="0" size="large">部分时段</el-radio>
      </el-radio-group>
    </div>
    <div class="timer">
      <el-date-picker
        v-model="timer"
        type="monthrange"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        size="default"
        :shortcuts="shortcuts"
        @change="timesChange"
      />
    </div>
    状态
    <el-select
      v-model="tableData.listConfig.state"
      class="m-2"
      placeholder="请选择"
      style="width: 140px; margin-left: 10px"
    >
      <el-option
        v-for="item in stateArr"
        :key="item"
        :label="item"
        :value="item"
      />
    </el-select>
    <el-button type="primary" class="searchBtn" @click="searchFn"
      >查询</el-button
    >
  </div>
  <!-- 操作按钮 -->
  <div class="button" v-if="selectChecked.length">
    <el-button type="danger" @click="delAll">批量删除</el-button>
    <el-button type="primary" @click="announceFn(1)">发布考试</el-button>
    <el-button type="success" @click="announceFn(2)">取消发布</el-button>
  </div>
  <!-- 表格 -->
  <el-table
    ref="multipleTableRef"
    :data="tableData.tableArr"
    :header-cell-style="{ 'text-align': 'center' }"
    :cell-style="{ 'text-align': 'center' }"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column label="考试名称" width="120">
      <template #default="scope">
        <span class="spanTitle" @click="titleFn(scope.row.id)">{{
          scope.row.title
        }}</span>
      </template>
    </el-table-column>
    <el-table-column label="状态" width="120">
      <template #default="scope">
        <span class="spanActive" v-if="scope.row.state === 1">已发布</span>
        <span class="spanRed" @click="openState(1, scope.row.id)" v-else
          >未发布</span
        >
      </template>
    </el-table-column>
    <el-table-column property="scores" label="总分" show-overflow-tooltip />
    <el-table-column
      property="pastscores"
      label="通过分数"
      show-overflow-tooltip
    />
    <el-table-column
      property="studentcounts"
      label="考试人数"
      show-overflow-tooltip
    />
    <el-table-column
      property="passCounts"
      label="通过人数"
      show-overflow-tooltip
    />
    <el-table-column label="开放时间" width="120">
      <template #default="scope">
        {{
          scope.row.begintime & scope.row.endtime
            ? scope.row.begintime + '至' + scope.row.endtime
            : '不限'
        }}</template
      >
    </el-table-column>
    <el-table-column property="admin" label="创建人" show-overflow-tooltip />
    <el-table-column label="更新时间">
      <template #default="scope">{{
        moment(scope.row.addtime).format('YYYY-MM-DD HH:mm')
      }}</template>
    </el-table-column>
    <el-table-column label="操作" width="160">
      <template #default="scope">
        <div class="operate">
          <span
            class="spanActive"
            @click="visibleDialogFn('学生可见列表', scope.row.id)"
            >学生</span
          >
          <div class="border"></div>
          <span
            class="spanActive"
            @click="visibleDialogFn('可见老师', scope.row.id)"
            >可见</span
          >
          <div class="border"></div>
          <span
            class="spanActive"
            @click="visibleDialogFn('阅卷老师', scope.row.id)"
            >阅卷老师</span
          >
          <span class="spanActive" @click="analyseFn(scope.row)">分析</span>
          <div class="border"></div>
          <span class="spanActive" @click="handleAnalyse(scope.row)">编辑</span>
          <div class="border"></div>
          <span @click="del(scope.row.id)">删除</span>
        </div>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <div class="pagination">
    <el-pagination
      v-model:current-page="currentPage4"
      v-model:page-size="pageSize4"
      :page-sizes="[5, 10, 15, 20]"
      :small="small"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="tableData.counts"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
  <!-- title弹出框 -->
  <titleDialog
    ref="dialogTitle"
    :testNameId="testNameId"
    :titleData="titleData"
  />
  <!-- visible弹出框 -->
  <visibleDialog ref="dialogVisible" :visibleTitle="visibleTitle" />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue';
import {
  testList,
  testDelete,
  testDeleteAll,
  updateState,
  testStart,
  testGet,
} from '../../api/test';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
import moment from 'moment';
import titleDialog from './titleDialog/titleDialog.vue';
import visibleDialog from './visibleDialog/visibleDialog.vue';
//pinia
import { useMainStore } from '../../stores/dialog';
const store = useMainStore();

const router = useRouter();
const dialogTitle = ref();
const dialogVisible = ref();
const visibleTitle = ref<string>('');
// 点击学生/可见/阅卷老师
const visibleDialogFn = async (title: string, id: number) => {
  let res = await testGet({ id });
  console.log(res);
  visibleTitle.value = title;
  dialogVisible.value.dialogVisible = true;
  console.log(dialogVisible.value.id);
  nextTick(() => {
    dialogVisible.value.id = id;
    dialogVisible.value.getStudentList();
  });
};

// 点击分析 跳转页面
const analyseFn = async (data: any) => {
  if (data.studentcounts == 0) {
    ElMessage({
      message: '没有学生考试',
      type: 'error',
    });
  } else if (data.incomplete != 0) {
    ElMessage({
      message: '该试卷未判完',
      type: 'error',
    });
  } else {
    router.push({
      path: '/index/Analyse',
      query: { id: data.id },
    });
  }
};

// 创建考试
const createTest = () => {
  router.push('/index/testAdd');
};
// 编辑
const handleAnalyse = async (data: any) => {
  if (data.studentcounts > 0)
    return ElMessage.error('本场考试已有学生参加，不可编辑');
  const res: any = await testGet({ id: data.id });
  if (res.errCode === 10000) {
    router.push('/index/testAdd');
    store.$patch((state) => {
      state.createTestData = res.data;
    });
  }
};
// 请求网络接口
onMounted(() => {
  getTabList();
});
// 点击考试名称
const titleData = ref({});
let testNameId = ref<number>(0);
const titleFn = async (testid: number) => {
  testNameId.value = testid;
  let res = await testStart({ testid });
  titleData.value = res.data;
  dialogTitle.value.dialogVisible = true;
};

// 修改状态
const openState = async (state: number, id: number) => {
  ElMessageBox.confirm('此操作将修改选中的考试状态, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      let res: any = await updateState({
        state,
        ids: [id],
      });
      console.log(res);
      if (res.errCode === 10000) {
        ElMessage({
          type: 'success',
          message: '修改成功',
        });
        getTabList();
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled',
      });
    });
};
// 修改发布状态
const announceFn = async (state: number) => {
  let res: any = await updateState({
    state,
    ids: selectChecked.value.map((item: { id: number }) => item.id),
  });
  if (res.errCode === 10000) {
    ElMessage.success('修改成功');
  } else {
    ElMessage.error('修改失败');
  }
  getTabList();
};
// 单删
const del = (id: number) => {
  ElMessageBox.confirm('确定要删除该条数据吗', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      let res: any = await testDelete({
        id,
      });
      if (res.errCode === 10000) {
        ElMessage({
          type: 'success',
          message: '删除成功',
        });
        getTabList();
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消',
      });
    });
};
// 批量删除
const delAll = async () => {
  ElMessageBox.confirm('确定要删除数据吗', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const ids: any = [];
      selectChecked.value.map((item: any) => {
        ids.push(item.id);
      });
      const res: any = await testDeleteAll({ ids });
      console.log(res);
      if (res.errCode === 10000) {
        ElMessage({
          type: 'success',
          message: '删除成功',
        });
        getTabList();
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消',
      });
    });
};
// 搜索框创建人change事件
const inpAdmin = () => {
  if (tableData.listConfig.admin) {
    return (ismy.value = false);
  }
};

// 日期选择器
const timer = ref([]);
// 日期选择器change事件
const timesChange = () => {
  tableData.listConfig.begindate = moment(timer.value[0]).format(
    'YYYY-MM-DD HH:mm:ss'
  );
  tableData.listConfig.enddate = moment(timer.value[1]).format(
    'YYYY-MM-DD HH:mm:ss'
  );
};
// 状态改变触发
const ismy = ref(false);
const stateChange = () => {
  ismy.value
    ? (tableData.listConfig.ismy = 1)
    : (tableData.listConfig.ismy = 0);
  // 如果选择了我创建的 则创建人清空
  if (ismy) tableData.listConfig.admin = '';
};
// 分页
const currentPage4 = ref(1);
const pageSize4 = ref(5);
const small = ref(false);
// 一页多少条
const handleSizeChange = (val: number) => {
  tableData.listConfig.psize = val;
  getTabList();
};
// 第几页
const handleCurrentChange = (val: number) => {
  tableData.listConfig.page = val;
  getTabList();
};

// 选择状态
const stateArr = ref([]);
// 接口
interface IlistConfig {
  page: number;
  psize: number;
  ismy: number;
  key: string;
  admin: string;
  state: string;
  begindate: string;
  enddate: string;
  opentime: number;
}
interface ItableData {
  listConfig: IlistConfig;
  tableArr: [];
  counts: number;
}
// 表格相关配置
const tableData = reactive<ItableData>({
  listConfig: {
    page: 1,
    psize: 5,
    ismy: 0,
    key: '',
    admin: '',
    state: '',
    begindate: '',
    enddate: '',
    opentime: 1,
  },
  tableArr: [],
  counts: 0,
});
// 搜索表格内容
const searchFn = () => {
  getTabList();
};
// 请求表格接口
const getTabList = async () => {
  let res = await testList(tableData.listConfig);
  tableData.tableArr = res.data.list;
  tableData.counts = res.data.counts;
};
// 表格多选框
const selectChecked = ref([]);
const handleSelectionChange = (val: any) => {
  selectChecked.value = val;
};
// 时间选择器快捷选项
const shortcuts = [
  {
    text: '今天',
    value: [new Date(), new Date()],
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date();
      const start = new Date(new Date().getFullYear(), 0);
      return [start, end];
    },
  },
  {
    text: '最近六个月',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 6);
      return [start, end];
    },
  },
];
</script>

<style scoped lang="less">
header {
  display: flex;
  justify-content: space-between;

  .left {
    font-size: 20px;
  }
}

.search {
  display: flex;
  color: #606266;
  font-size: 14px;
  align-items: center;
  height: 50px;

  :deep(.timer) {
    width: 330px;
  }

  .searchBtn {
    margin: 0 20px;
  }

  .ismy {
    margin: 0 20px;
  }

  .openTime {
    width: 280px;
    font-size: 14px;

    span {
      margin-right: 10px;
    }

    .el-radio {
      margin-right: 10px;
      margin-left: 10px;
    }
  }
}

.operate {
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  .border {
    width: 1px;
    background-color: black;
    margin: 0 5px;
    height: 15px;
  }

  span {
    color: #409eff;
    cursor: pointer;
    font-size: 14px;
  }

  span:last-child {
    color: red;
  }
}

.pagination {
  display: flex;
  justify-content: center;
  margin: 20px;
}

.spanActive {
  color: #409eff;
  cursor: pointer;
}

.button {
  margin: 10px 0;
  padding-left: 20px;
}

.spanRed {
  color: red;
  cursor: pointer;
}

.spanRed:hover {
  border-bottom: 1px solid red;
}

.spanTitle {
  color: #409eff;
  cursor: pointer;
}

.spanTitle:hover {
  border-bottom: 1px solid #409eff;
}
</style>
