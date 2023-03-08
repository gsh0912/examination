<template>
  <div>
    <div>
      <div class="title">试卷管理</div>
    </div>
    <div class="fromData">
      <el-form :model="subjects">
        <el-form-item label="关键字">
          <el-input v-model="subjects.key" clearable placeholder="考试名称" />
        </el-form-item>
        <el-form-item label="创建人" style="margin-left: 20px">
          <el-input v-model="subjects.admin" clearable placeholder="创建人" />
        </el-form-item>
        <el-form-item label="" style="margin-left: 20px">
          <el-checkbox
            label="只看我创建的"
            @change="myestablish"
            true-label="1"
            false-label="0"
            v-model="subjects.ismy"
          />
        </el-form-item>
        <el-button @click="search" type="primary" style="margin-left: 10px"
          >查询</el-button
        >
      </el-form>
      <div style="margin-top: -35px">
        <el-button type="primary" @click="createSubject">创建考试</el-button>
      </div>
    </div>
    <el-table :data="subjectsData.list" style="width: 100%; font-size: 12px">
      <el-table-column align="center" prop="title" label="试卷名称" />
      <el-table-column align="center" prop="counts" label="题量" />
      <el-table-column align="center" prop="singles" label="单选" />
      <el-table-column align="center" prop="multiples" label="多选" />
      <el-table-column align="center" prop="judges" label="判断" />
      <el-table-column align="center" prop="blanks" label="填空" />
      <el-table-column align="center" prop="qas" label="问答" />
      <el-table-column align="center" prop="scores" label="总分" />
      <el-table-column align="center" prop="admin" label="创建人" />
      <el-table-column align="center" label="更新时间">
        <template #default="scope">
          {{ moment(scope.row.addtime).format('YYYY-MM-DD HH:mm') }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="address" label="操作">
        <template #default="scope">
          <el-link type="primary" @click="compile(scope.row)">编辑</el-link>
          <span style="margin: 0px 5px">|</span>
          <el-link type="primary" @click="del(scope.row.id)">删除</el-link>
        </template>
      </el-table-column>
    </el-table>
    <div class="paging">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
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
import moment from 'moment';
import { ref, reactive, onMounted } from 'vue';
import { subjectsList, subjectsDel } from '../../api/subjects';
import { useRouter } from 'vue-router';
const router = useRouter();
onMounted(() => {
  getList();
});
// 点击创建考试
const createSubject = () => {
  console.log(111);
  router.push('/index/subjectAdd');
};
// 编辑
const compile = (val: any) => {
  console.log(val);
  router.push({ path: '/index/subjectAdd', query: { id: val.id } });
};

const currentPage = ref(1);
const pageSize = ref(10);
const small = ref(false);
const background = ref(true);
const disabled = ref(false);
const total = ref(0);
const subjectsData = reactive({
  list: [],
});
interface Isubjects {
  page: number;
  psize: number;
  key: string;
  admin: string;
  ismy: number;
}
const subjects: Isubjects = reactive({
  page: 1,
  psize: 10,
  key: '',
  admin: '',
  ismy: 0,
});
const getList = async () => {
  let res = await subjectsList(subjects);
  console.log(res);
  subjectsData.list = res.data.list;
  // console.log(subjectsData.list);
  total.value = res.data.counts;
};
const handleSizeChange = (val: number) => {
  subjects.psize = val;
  getList();
};
const handleCurrentChange = (val: number) => {
  subjects.page = val;
  getList();
};
const search = () => {
  getList();
};
// 删除
const del = async (id: number) => {
  let res = await subjectsDel({ id: id });
  console.log(id);
  console.log(res);
  getList();
};
const myestablish = () => {
  getList();
};
</script>

<style scoped lang="less">
.title {
  font-size: 20px;
}

.fromData {
  display: flex;
  justify-content: space-between;

  .el-form {
    display: flex;
    margin-top: 20px;

    .el-input {
      width: 180px;
      height: 30px;
    }
  }
}

.paging {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 30px;
}
</style>
