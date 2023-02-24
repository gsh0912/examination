<template>
  <div class="top">
    <div class="left">题库管理</div>
    <div class="right">
      <el-button type="primary">创建题库</el-button>
    </div>
  </div>
  <!-- 搜索项 -->
  <div class="search">
    <el-form inline>
      <el-form-item label="题库名称:">
        <el-input v-model="Data.listConfig.key" />
      </el-form-item>
      <el-form-item label="创建人:">
        <el-input v-model="Data.listConfig.admin" />
      </el-form-item>
    </el-form>
    <el-checkbox v-model="Data.lookChecked" label="只看我创建的" size="large" @change="isMyFn" />
    <el-button type="primary" style="margin:0 8px" @click="serachFn">查询</el-button>
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
        <span class="isActive">试题</span>
        <span class="isActive">编辑</span>
        <span class="isActive">删除</span>
      </template>
    </el-table-column> />
  </el-table>
  <!-- 分页 -->
  <div class="pagination">
    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 15, 20]"
      :small="small" :disabled="disabled" :background="background" layout="total, sizes, prev, pager, next, jumper"
      :total="Data.counts" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </div>
</template>

<script setup lang='ts'>
import { reactive, onMounted } from 'vue'
import { ref } from 'vue'
import { ElTable } from 'element-plus'
import { reqList } from '../../api/databaselist'
import { deleteAllList } from '../../api/databaselist'

// 批量删除
const delAllFn =async () => {
  let res = await deleteAllList({
    ids: tableChecked.value.map((item: { id: number }) => item.id)
  })
  console.log(res);

}
// 我创建的
const isMyFn = () => {
  if (Data.lookChecked) {
    Data.listConfig.ismy = 1
  } else {
    Data.listConfig.ismy = 0
  }
  console.log(Data.listConfig.ismy);

}

// 搜索
const serachFn = () => {
  getList()
}
// 分页
const currentPage = ref(1)
const pageSize = ref(5)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)
// 每页多少条
const handleSizeChange = (val: number) => {
  Data.listConfig.psize = val
  getList()
}
// 第几页
const handleCurrentChange = (val: number) => {
  Data.listConfig.page = val
  getList()
}
const tableChecked = ref([])
// 表格选中的数据
const handleSelectionChange = (val: any) => {
  tableChecked.value = val
}
interface IlistConfig {
  page: number,
  psize: number,
  key: string,
  admin: string,
  ismy: number
}

interface Idata {
  lookChecked: boolean,
  counts: number,
  tableData: Array<any>,
  listConfig: IlistConfig
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
    ismy: 0
  }
})
const searchForm = reactive({
  name: '',
})
// 请求列表
const getList = async () => {
  const res = await reqList(Data.listConfig)
  Data.counts = res.data.counts
  Data.tableData = res.data.list
}

onMounted(() => {
  getList()
})

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