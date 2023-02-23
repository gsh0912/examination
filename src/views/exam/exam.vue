<template>
  <div>
    <div class="title">
      <span> 阅卷管理</span>
    </div>
    <div>
      <el-form :model="tableData">
        <el-form-item label="关键字:">
          <el-input
            v-model="tableData.key"
            placeholder="请输入题库名称"
            clearable
          />
          <el-button type="primary" style="margin-left: 20px" @click="search"
            >搜索</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格 -->
    <div>
      <el-table :data="list" style="width: 100%">
        <el-table-column align="center" prop="title" label="考试名称" />
        <el-table-column align="center" prop="info" label="考试说明" />
        <el-table-column align="center" prop="subjectnum" label="题量" />
        <el-table-column align="center" prop="studentcounts" label="考试人数" />
        <el-table-column align="center" label="未判人数">
          <template #default="scoped">
            <span style="color: red">{{ scoped.row.incomplete }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="开放时间">
          <template #default="scoped">
            <span v-if="scoped.row.begindate && scoped.row.enddate"
              >{{ scoped.row.begindate }}至{{ scoped.row.enddate }}</span
            >
            <span v-else>不限</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="address" label="操作">
          <template #default="scoped">
            <el-link
              type="primary"
              @click="exam(scoped.row.id, scoped.row.title)"
              >{{ scoped.row.incomplete === 0 ? '查看' : '阅卷' }}</el-link
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="demo-pagination-block">
      <el-pagination
        v-model:current-page="currentPage4"
        v-model:page-size="pageSize4"
        :page-sizes="[5, 10, 15, 20]"
        :small="small"
        :disabled="disabled"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { testList } from '../../api/exam';
import { useRouter } from 'vue-router';
// 路由
let router = useRouter();
// 列表数据
let list = ref([]);
// 条数
let total = ref(0);
// 列表
interface ItableData {
  page: number;
  psize: number;
  key: string;
  admin: string;
  ismy: number;
  opentime: number;
  begindate: string;
  enddate: string;
  state: number;
  isread: number;
  result: string;
}
let tableData: ItableData = reactive({
  page: 1,
  psize: 5,
  key: '',
  admin: '',
  ismy: 1,
  opentime: 1,
  begindate: '',
  enddate: '',
  state: 1,
  isread: 1,
  result: '',
});
const myList = async () => {
  let res = await testList(tableData);
  console.log(res);
  list.value = res.data.list;
  Number((total.value = res.data.counts));
};
myList();
// 搜索
const search = () => {
  myList();
};
// 分页
const small = ref(false);
const currentPage4 = ref(1);
const pageSize4 = ref(5);
const background = ref(true);
const disabled = ref(false);
const handleSizeChange = (val: number) => {
  console.log(val);
  tableData.psize = val;
  myList();
};
const handleCurrentChange = (val: number) => {
  tableData.page = val;
  myList();
};
// 阅卷
const exam = (val: number, data: string) => {
  router.push({
    path: '/index/examstudent',
    query: { testid: val, title: data },
  });
};
</script>

<style scoped lang="less">
.title {
  font-size: 20px;
  margin-bottom: 15px;
}
/deep/.el-form-item__label {
  font-size: 16px;
}
.el-input {
  width: 200px;
}
.demo-pagination-block {
  width: 100%;
  height: 75px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
