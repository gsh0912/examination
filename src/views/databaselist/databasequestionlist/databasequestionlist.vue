<template>
  <div class="databasequestionlist">
    <div class="title">
      <el-page-header @back="goBack">
        <template #content>
          <span class="text-large font-600 mr-3">
            {{ tableData.database.title }}
          </span>
        </template>
      </el-page-header>
      <div>
        <el-button @click="addDatabasequestion">添加试题</el-button>
        <el-button type="primary" @click="addDatabasequestions">批量添加试题</el-button>
      </div>
    </div>
    <div>
      <el-form :model="Data">
        <el-form-item label="题目名称：">
          <el-input v-model="Data.key" placeholder="请输入题目名称" clearable />
        </el-form-item>
        <el-form-item label="创建人：">
          <el-input v-model="Data.admin" placeholder="请输入创建人" clearable />
        </el-form-item>
        <el-form-item label="题目类型：">
          <el-select @change="select" v-model="Data.type" placeholder="请选择" clearable>
            <el-option label="单选题" value="单选题" />
            <el-option label="多选题" value="多选题" />
            <el-option label="判断题" value="判断题" />
            <el-option label="填空题" value="填空题" />
            <el-option label="问答题" value="问答题" />
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="danger" @click="delAll" :disabled="multipleSelection.length === 0">批量删除</el-button>
        <el-button @click="importExcel">导出excel</el-button>
      </el-form>
      <el-table :data="tableData.list" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column  label="题目名称">
          <template #default="scope">
            <div class="spanTitle" @click="detailsDrawers(scope.row)">
              <p v-html="scope.row.title"></p>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="type" label="题目类型" />
        <el-table-column align="center" label="创建时间">
          <template #default="scope">
            {{ moment(scope.row.addtime).format('YYYY-MM-DD HH:mm') }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="admin" label="创建人" />
        <el-table-column align="center" label="操作">
          <template #default="scope">
            <el-link style="margin-right: 10px" type="primary" @click="compileFn(scope.row)">编辑</el-link>
            <el-link type="primary" @click="del(scope.row.id)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <div class="paging">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 15, 20]"
          :small="small" :disabled="disabled" :background="background" layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>
  </div>
  <!-- 添加试题抽屉 -->
  <drawer ref="leftDrawer" @getChildren="submit" v-if="flag" />
  <!-- 添加批量考试试题 -->
  <addDialog ref="addDialogRef" />
  <!-- 单条数据详情 -->
  <detailsDrawer ref="details" :ids="ids.data" />
</template>

<script setup lang="ts">
import moment from 'moment';
import { ElMessage, ElMessageBox } from 'element-plus';
import { reactive, ref, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import {
  databasequestion,
  databasequestionDel,
  databasequestionDelall,
  exportExcel,
} from '../../../api/databaselist';
import router from '../../../router';
import drawer from './drawer.vue';
import addDialog from './addDialog.vue';
import { questionAdd } from '../../../api/databaselist';
import detailsDrawer from './detailsDrawer .vue';
let flag = ref<boolean>(false);
let route = useRoute();
//分页数据
const currentPage = ref(1);
const pageSize = ref(10);
const small = ref(false);
const background = ref(true);
const disabled = ref(false);
// 返回上一个页面
const goBack = () => {
  router.push('/index/databaselist');
};
// 点击编辑
const leftDrawer = ref();
const compileFn = (data: any) => {
  flag.value = true;
  nextTick(() => {
    leftDrawer.value.drawer = true;
    leftDrawer.value.radio = data.type;
    leftDrawer.value.info.id = data.id;
    nextTick(() => {
      leftDrawer.value.EditorRef.valueHtml = data.title;
    });
    // // 选项
    data.answers.forEach((element: any) => {
      leftDrawer.value.state.answers.forEach((item: any) => {
        if (item.answerno === element.answerno) {
          item.content = element.content;
        }
      });
    });
    // 分值
    leftDrawer.value.scores = data.scores;
    if (data.type === '多选题') {
      leftDrawer.value.rightcehckboxAnswers = data.answer.split('|');
    }
    if (data.type === '单选题') {
      leftDrawer.value.rightAnswers = data.answer;
      console.log(data);
    }
    if (data.type === '判断题') {
      leftDrawer.value.estimateAnswer = data.answer;
    }
    if (data.type === '填空题' || data.type === '问答题') {
      leftDrawer.value.tags = data.tags;
    }
  });
  console.log(data.title);
};

// 添加试题 点击时清空上次数据
const addDatabasequestion = () => {
  flag.value = true;
  nextTick(() => {
    leftDrawer.value.drawer = true;
    leftDrawer.value.title = '试题添加';
    leftDrawer.value.radio = '单选题';
    leftDrawer.value.rightAnswers = '';
    leftDrawer.value.scores = 1;
    leftDrawer.value.EditorRef.valueHtml
      ? (leftDrawer.value.EditorRef.valueHtml = '')
      : '';
    leftDrawer.value.state.answers.forEach((item: any) => {
      item.content = '';
    });
  });
};
// 添加批量试题
const addDialogRef = ref();
const addDatabasequestions = () => {
  addDialogRef.value.dialogVisible = true;
};

// 导出Excel表格
const importExcel = async () => {
  const res: any = await exportExcel({
    id: route.query.id,
  }); //请求接口返回文件流

  console.log(res);
  let blob = new Blob([res], { type: 'application/vnd.ms-excel' });
  let url = URL.createObjectURL(blob);
  let a = document.createElement('a');
  a.href = url;
  a.setAttribute('download', '123.xlsx');
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// 列表
interface Ipaper {
  databaseid: number;
  page: number;
  psize: number;
  key: string;
  tags: string;
  type: string;
  admin: string;
}
const Data: any = reactive<Ipaper>({
  databaseid: 0,
  page: 1,
  psize: 10,
  key: '',
  tags: '',
  type: '',
  admin: '',
});
const tableData = reactive<any>({
  list: [],
  database: [],
  total: 0,
});
const getList = async () => {
  Data.databaseid = route.query.id;
  let result = await databasequestion(Data);
  console.log(result);
  tableData.database = result.data.database;
  tableData.list = result.data.list;
  tableData.total = result.data.counts;
};
// 分页
const handleSizeChange = (val: number) => {
  Data.psize = val;
  getList();
};
const handleCurrentChange = (val: number) => {
  Data.page = val;
  getList();
};
// 搜索
const search = () => {
  getList();
};
const select = () => {
  getList();
};
// 删除
const del = async (id: number) => {
  ElMessageBox.confirm('确定要删除吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      let result: any = await databasequestionDel({ id: id });
      console.log(result);
      if (result.errCode === 10000) {
        ElMessage({
          message: '删除成功.',
          type: 'success',
        });
        getList();
      }
    })
    .catch(() => {
      ElMessage.error('删除失败');
    });
};
//
const multipleSelection: any = ref<any[]>([]);
const handleSelectionChange = (val: any[]) => {
  multipleSelection.value = val.map((item: any) => item.id);
  // console.log(multipleSelection.value);
};
// 批量删除
const delAll = async () => {
  console.log(multipleSelection.value);
  ElMessageBox.confirm('确定要删除吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      let res: any = await databasequestionDelall({
        ids: multipleSelection.value,
      });
      console.log(res);
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

// 保存
const submit = async (val: any) => {
  console.log(val);
  let res: any = await questionAdd(val);
  console.log(res);
  if (res.errCode === 10000) {
    leftDrawer.value.drawer = false;
    getList();
  }
  flag.value = false;
};
//单条页面详情
const ids: any = reactive({
  data: {

  }
});
const details = ref();
const detailsDrawers = (val: any) => {
  details.value.drawer = true;
  Object.assign(ids.data, val)
  if (ids.data.type === '填空题') {
    let arr = ids.data.answer.split('|')
    arr.forEach((data: string) => {
      ids.data.title = ids.data.title.replace(
        /\[\]/,
        `<input type="text" value="${data}" disabled style="width:100px;border:none;border-bottom:1px solid #000;margin-left:10px"/>`
      );
    })
  }
};
onMounted(() => {
  getList();
});
</script>
<style scoped lang="less">
.title {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.el-form {
  margin-top: 15px;
  margin-bottom: 10px;
  display: flex;

  .el-form-item {
    display: flex;
    align-items: center;
    margin-left: 10px;

    .el-input {
      width: 170px;
      height: 30px;
    }

    .el-select {
      width: 150px;
      height: 30px;
    }
  }

  .el-button {
    margin-left: 10px;
  }
}

.paging {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.spanTitle {
  color: #409eff;
  cursor: pointer;
}
</style>
