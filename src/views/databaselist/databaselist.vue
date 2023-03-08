<template>
  <div class="top">
    <div class="left">题库管理</div>
    <div class="right">
      <el-button type="primary" @click="createQuestion">创建题库</el-button>
    </div>
  </div>
  <!-- 搜索项 -->
  <div class="search">
    <el-form inline>
      <el-form-item label="题库名称:">
        <el-input v-model="Data.listConfig.key" placeholder="请输入题库名称" clearable />
      </el-form-item>
      <el-form-item label="创建人:">
        <el-input v-model="Data.listConfig.admin" placeholder="请输入创建人" clearable />
      </el-form-item>
    </el-form>
    <el-checkbox v-model="Data.lookChecked" label="只看我创建的" size="large" @change="isMyFn" />
    <el-button type="primary" style="margin: 0 8px" @click="serachFn">查询</el-button>
    <el-button type="danger" :disabled="tableChecked.length === 0" @click="delAllFn">批量删除</el-button>
  </div>
  <!-- 表格 -->
  <el-table ref="multipleTableRef" :data="Data.tableData" style="width: 100%" @selection-change="handleSelectionChange"
    :header-cell-style="{ 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }">
    <el-table-column type="selection" width="55" />
    <el-table-column label="题库" width="120">
      <template #default="scope">{{ scope.row.title }}</template>
    </el-table-column>
    <el-table-column property="counts" label="题目数量" width="120" />
    <el-table-column property="addtime" label="创建时间" show-overflow-tooltip />
    <el-table-column property="admin" label="创建人" show-overflow-tooltip />
    <el-table-column label="操作">
      <template #default="scope">
        <span class="isActive" @click="questions(scope.row.id)">试题</span>
        <span class="isActive" @click="updateFn(scope.row)">编辑</span>
        <span class="isActive" @click="delFn(scope.row.id)">删除</span>
      </template>
    </el-table-column>

  </el-table>
  <!-- 分页 -->
  <div class="pagination">
    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 15, 20]"
      :small="small" :disabled="disabled" :background="background" layout="total, sizes, prev, pager, next, jumper"
      :total="Data.counts" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </div>
  <!-- 创建题库的弹出框 -->
  <databaseListDialog ref="databaseListDialogRef" :getList="getList"/>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { ref } from 'vue';
import { ElTable, ElMessageBox, ElMessage } from 'element-plus';
import { reqList } from '../../api/databaselist';
import { deleteAllList, deleteList } from '../../api/databaselist';
import { useRouter } from 'vue-router';
import databaseListDialog from './databastListDialog.vue'
let router = useRouter();
// 编辑
const updateFn = (data: any) => {
  databaseListDialogRef.value.dialogVisible = true
  databaseListDialogRef.value.ruleForm.isshow = data.isshow
  databaseListDialogRef.value.ruleForm.title = data.title
  databaseListDialogRef.value.ruleForm.id = data.id
}

// 创建题库
const databaseListDialogRef = ref()
const createQuestion = () => {
  databaseListDialogRef.value.ruleForm.id = 0
  databaseListDialogRef.value.dialogVisible = true
}
// 批量删除
const delFn = (id: number) => {

  ElMessageBox.confirm('确定要删除吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      let res: any = await deleteList({ id: id });
      if (res.errCode === 10000) {
        ElMessage({
          message: '删除成功',
          type: 'success',
        });
        getList();
      }
    })
    .catch(() => {
      ElMessage.info('已取消');
    });
};
const delAllFn = async () => {
  ElMessageBox.confirm('确定要删除吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      let res: any = await deleteAllList({
        ids: tableChecked.value.map((item: any) => {
          return item.id;
        }),
      });
      if (res.errCode === 10000) {
        ElMessage({
          message: '删除成功',
          type: 'success',
        });
        getList();
      }
    })
    .catch(() => {
      ElMessage.error('删除失败');
    });
};
// 我创建的
const isMyFn = () => {
  if (Data.lookChecked) {
    Data.listConfig.ismy = 1;
    getList();
  } else {
    Data.listConfig.ismy = 0;
    getList();
  }
};

// 搜索
const serachFn = () => {
  getList();
};
// 分页
const currentPage = ref(1);
const pageSize = ref(5);
const small = ref(false);
const background = ref(false);
const disabled = ref(false);
// 每页多少条
const handleSizeChange = (val: number) => {
  Data.listConfig.psize = val;
  getList();
};
// 第几页
const handleCurrentChange = (val: number) => {
  Data.listConfig.page = val;
  getList();
};
const tableChecked = ref([]);
// 表格选中的数据
const handleSelectionChange = (val: any) => {
  tableChecked.value = val;
};
interface IlistConfig {
  page: number;
  psize: number;
  key: string;
  admin: string;
  ismy: number;
}

interface Idata {
  lookChecked: boolean;
  counts: number;
  tableData: Array<any>;
  listConfig: IlistConfig;
}
// data相关数据
const Data = reactive<Idata>({
  lookChecked: false,
  tableData: [],
  counts: 0,
  listConfig: {
    page: 1,
    psize: 5,
    key: '',
    admin: '',
    ismy: 0,
  },
});
const searchForm = reactive({
  name: '',
});
// 请求列表
const getList = async () => {
  const res = await reqList(Data.listConfig);
  Data.counts = res.data.counts;
  Data.tableData = res.data.list;
};
const questions = (id: number) => {
  router.push({ path: '/index/databasequestionlist', query: { id: id } });
};
onMounted(() => {
  getList();
});
</script>

<style scoped>
.top {
  display: flex;
  font-size: 20px;
  justify-content: space-between;
}

.search {
  display: flex;
  align-items: center;
}

.el-form-item {
  margin: 0;
  margin-right: 10px;
}

.isActive {
  color: #409eff;
  margin: 0 5px;
  cursor: pointer;
}

.isActive:hover {
  color: #409eff;
  opacity: 0.5;
}

.pagination {
  display: flex;
  justify-content: center;
  margin: 20px 0px;
}
</style>
