<template>
  <div>
    <!-- 标题 -->
    <div class="title">
      <el-page-header @back="goBack">
        <template #content>
          <span class="text-large font-600 mr-3"> {{ title }} </span>
        </template>
      </el-page-header>
    </div>
    <!-- 搜索 -->
    <div>
      <el-form class="form" :model="tableData" label-width="68px">
        <el-form-item label="考生姓名">
          <el-input
            v-model="tableData.key"
            placeholder="请输入考生姓名"
            clearable
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            @change="select"
            v-model="tableData.state"
            placeholder="全部"
          >
            <el-option label="未阅卷" value="未阅卷" />
            <el-option label="已阅卷" value="已阅卷" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <el-cascader
            :options="departments"
            :props="{ emitPath: false, value: 'id', label: 'name' }"
            placeholder="请选择"
          />
        </el-form-item>
        <el-form-item label="班级">
          <el-select v-model="tableData.key" placeholder="请选择" disabled>
          </el-select>
        </el-form-item>
        <el-button type="primary" style="margin-left: 25px" @click="search"
          >查询</el-button
        >
      </el-form>
    </div>
    <!-- 表格 -->
    <div>
      <el-table :data="list" style="width: 100%">
        <el-table-column align="center" prop="name" label="姓名" />
        <el-table-column align="center" prop="depname" label="班级名称" />
        <el-table-column align="center" prop="scores" label="分数" />
        <el-table-column align="center" label="考试时间">
          <template #default="scoped">
            <span v-if="scoped.row.readtime">{{
              scoped.row.readtime.substring(
                0,
                scoped.row.readtime.indexOf('.') - 3
              )
            }}</span>
            <span v-else></span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template #default="scoped">
            <span v-if="scoped.row.state === '未阅卷'" style="color: red">{{
              scoped.row.state
            }}</span>
            <span v-else>{{ scoped.row.state }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scoped">
            <el-link type="primary" @click="exam(scoped.row)">阅卷</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="demo-pagination-block">
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
  <el-drawer
    v-model="drawer"
    title="I am the title"
    :with-header="false"
    size="50%"
  >
    <div v-if="examDatas.examData.length > 0">
      <span>{{ examList }}的试卷</span>
      <el-form
        ref="ruleFormRef"
        :model="examDatas"
        class="demo-ruleForm"
        :size="formSize"
        status-icon
      >
        <div
          style="margin-top: 50px"
          v-for="(item, index) in examDatas.examData"
          :key="index"
        >
          <div class="questions">
            <span>{{ index + 1 }}、{{ item.type }}</span>
            <span style="margin-left: 10px; color: rgb(202, 198, 182)"
              >分值:{{ item.scores }}</span
            >
          </div>
          <div>
            <div style="margin-top: 10px">{{ item.explains }}</div>
            <div style="margin-top: 10px">回答：</div>
            <div style="margin-top: 10px">{{ item.studentanswer }}</div>
          </div>
          <div class="mark">
            <el-form-item
              label="打分"
              :rules="studentscores(item.scores)"
              :prop="'examData.' + index + '.studentscores'"
            >
              <el-input style="width: 80px" v-model="item.studentscores" />
            </el-form-item>
            <el-form-item label="批注">
              <el-input
                style="width: 345px"
                v-model="item.comments"
                type="textarea"
              />
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <div class="notAvailable" v-else>暂无数据</div>
    <div class="accomplish">
      <div v-if="examDatas.examData.length > 0">
        <el-button type="primary" @click="submitForm()">阅卷完毕</el-button>
        <el-button type="primary" @click="drawer = false">取消</el-button>
      </div>
      <el-button class="close" v-else @click="drawer = false">关闭</el-button>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { studentList, department, question, questionUpd } from '../../api/exam';
import { ref, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import router from '../../router';
let route = useRoute();
// title标签
let title = route.query.title;
// 列表数据
let list = ref([]);
// 级联框数据
const departments = ref([]);
// 抽屉
const drawer = ref(false);
// 分页数据
const currentPage = ref(1);
const pageSize = ref(5);
const small = ref(false);
const background = ref(true);
const disabled = ref(false);
let total = ref(0);
// 接口
interface ItableData {
  page: number;
  psize: number;
  testid: number;
  key: string;
  depid: number;
  classid: number;
  state: string;
  pass: number;
  pastscores: number;
}
// 接口数据
let tableData: ItableData = reactive<any>({
  page: 1,
  psize: 10,
  testid: 0,
  key: '',
  depid: 0,
  classid: 0,
  state: '',
  pass: 0,
  pastscores: 0,
});
// 列表
console.log(route.query.testid);
const myList = async () => {
  tableData.testid = Number(route.query.testid);
  let res = await studentList(tableData);
  console.log(res);
  list.value = res.data.list;
  console.log(list.value);
  total.value = res.data.counts;
};
myList();
// 分页
const handleSizeChange = (val: number) => {
  // console.log(val);
  tableData.psize = val;
  myList();
};
const handleCurrentChange = (val: number) => {
  // console.log(val);
  tableData.page = val;
  myList();
};
// 搜索
const search = () => {
  myList();
};
// 选择框查询
const select = () => {
  myList();
};
// 部门列表
const myDepartment = async () => {
  let res = await department({});
  // console.log(res);
  departments.value = res.data.list;
  // console.log(departments.value);
};
myDepartment();
// 抽屉 阅卷
const formSize = ref('default');
const examDatas = ref<any>({
  examData: [],
});
const examList = ref('');
const exam = async (data: any) => {
  console.log(data);
  drawer.value = true;
  if (data.state === '已阅卷') {
    drawer.value = false;
    ElMessage({
      message: '您已判完卷',
      type: 'success',
    });
  }
  let res = await question({ testid: route.query.testid, studentid: data.id });
  console.log(res);
  examList.value = data.name;
  examDatas.value.examData = res.data.list;
};
//提交
const ruleFormRef = ref();
const scoresValidator = (rule: any, value: any, callback: any) => {
  // console.log(rule.maxScores);
  let max = parseInt(rule.maxScores);
  console.log(value);
  let _value = parseInt(value);
  // console.log(isNaN(value));
  // console.log(isNaN(value));
  if (isNaN(value) || value === null) {
    callback(new Error(`请输入分数`));
  } else if (_value < 0 || _value > max) {
    callback(new Error(`不能小于0,或大于${max}`));
  } else {
    callback();
  }
};

const studentscores = (scores: number) => {
  return [{ validator: scoresValidator, maxScores: scores, trigger: 'blur' }];
};

const submitForm = async () => {
  ruleFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      let data = examDatas.value.examData.map((item: any) => {
        return {
          answerid: item.answerid,
          scores: item.scores,
          comments: item.comments,
        };
      });
      console.log(1);
      let res: any = await questionUpd(data);
      console.log(res);
      if (res.errCode === 10000) {
        ElMessage({
          message: '阅卷成功',
          type: 'success',
        });
        drawer.value = false;
        myList();
      }
    } else {
      console.log('error submit!');
    }
  });
};

//返回上一个页面
const goBack = () => {
  router.push('/index/exam');
};
</script>
<style scoped lang="less">
.title {
  display: flex;
  align-items: center;
  font-size: 16px;
  margin-bottom: 15px;
}
.form {
  display: flex;
  .el-input {
    width: 200px;
  }
}
.demo-pagination-block {
  width: 100%;
  height: 75px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.questions {
  margin-top: 20px;
}
.mark {
  width: 100%;
  height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 20px;
  background-color: rgb(250, 250, 250);
}
.accomplish {
  margin: 30px 0px 20px 0px;
}
.notAvailable {
  position: absolute;
  top: 50%;
  left: 50%;
}
.close {
  position: fixed;
  bottom: 30px;
}
</style>
