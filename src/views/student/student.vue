<template>
  <div>
    <!-- 标题 -->
    <div class="title">
      <p class="classes_p">班级管理</p>
      <p>
        <el-button @click="addALL">批量添加</el-button>
        <el-button type="primary" @click="addstudent">添加学生</el-button>
      </p>
    </div>
    <!-- 标题 -->

    <!-- 搜索 -->
    <div class="classes_search">
      <el-form :inline="true" :model="student" class="demo-form-inline">
        <el-form-item label="班级名称">
          <el-input
            v-model="student.key"
            @keyup.enter.native="searchfn"
            @submit.native.prevent
            clearable
            placeholder="请输入关键字"
          />
        </el-form-item>
        <el-form-item label="部门">
          <cascader
            :options="options"
            :cascaderProps="cascaderProps"
            @getDepid="getDepid"
          />
        </el-form-item>
        <el-form-item label="班级">
          <el-select placeholder="请选择班级" v-model="student.classid">
            <el-option
              v-for="item in student.classlist"
              :label="item.name"
              value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchfn">查询</el-button>
          <el-button type="danger" @click="arrall_del">批量删除</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 搜索 -->

    <!-- 表格 -->
    <el-table
      ref="multipleTableRef"
      :data="student.tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column align="center" property="name" label="学生姓名" />
      <el-table-column align="center" property="remark" label="备注" />
      <el-table-column align="center" property="depname" label="所属部门" />
      <el-table-column align="center" property="classname" label="所在班级" />
      <el-table-column align="center" property="pass" label="账号" />
      <el-table-column align="center" property="addtime" label="添加时间" />
      <el-table-column
        align="center"
        property="address"
        label="操作"
        show-overflow-tooltip
      >
        <template #default="scope">
          <el-button link type="primary" size="small" @click="uppass(scope.row)"
            >重置密码</el-button
          >
          <el-button link type="primary" size="small" @click="updatelist(scope.row)"
            >修改</el-button
          >
          <el-button link type="primary" size="small" @click="stu_delete(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格 -->

    <!-- 分页 -->
    <div class="demo-pagination-block">
      <el-pagination
        v-model:current-page="currentPage4"
        v-model:page-size="pageSize4"
        :page-sizes="[10, 20, 30, 40]"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="student.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 分页 -->

    <!-- 添加 -->
    <add ref="dialogshow" :getlist="list"></add>

    <!-- 重置密码 -->
    <pass ref="dialogformshow"></pass>

    <!-- 修改 -->
    <el-dialog v-model="student.dialogVisible" title="修改" width="32%">
      <el-form :model="form" label-width="60px">
        <el-form-item label="姓名">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.mobile" />
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="form.depid" placeholder="请选择部门">
            <el-option v-for="item in student.list" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="班级">
          <el-select v-model="form.classid" placeholder="请选择班级">
            <el-select placeholder="请选择班级">
              <el-option
                v-for="item in student.classlist"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remarks" type="textarea" />
        </el-form-item>
        <span class="dialog-footer footer_qu">
          <el-button @click="dialog">取消</el-button>
          <el-button type="primary" @click="uponfirm()"> 确定 </el-button>
        </span>
      </el-form>
    </el-dialog>

    <!-- 重置密码 -->
    <el-dialog v-model="student.centerDialogVisible" title="重置密码" width="32%">
      <el-form label-width="75px">
        <el-form-item label="姓名" prop="name">{{ password.name }}</el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input v-model="password.pass" type="password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="password">
          <el-input v-model="student.oldpass" type="password" />
        </el-form-item>
        <span class="dialog-footer">
          <el-button @click="student.centerDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="adduppass"> 确定 </el-button>
        </span>
      </el-form>
    </el-dialog>
    <!-- 重置密码 -->
  </div>
</template>

<script setup lang="ts">
import { ElTable, ElMessage, ElMessageBox } from "element-plus";
import { reactive, ref, onMounted } from "vue";
import { studentlist, studentdelete, classesdes, studentupdata } from "../../api/student";
import { classesdepartment, classeslist } from "../../api/classes";
import add from "./studentss/add.vue";
import pass from "./studentss/pass.vue";
import { reqList } from "../../api/department";
import cascader from "../../components/common/cascader.vue";

const form = ref<any>({
  id: 1,
  name: "",
  classid: "",
  depid: "",
  mobile: "",
  username: "",
  pass: "",
  classname: "",
  remarks: "",
});

const ss = reactive({
  name: "",
  region: "",
  date1: "",
  date2: "",
  delivery: false,
  type: [],
  resource: "",
  desc: "",
});

const student = reactive<any>({
  centerDialogVisible: false,
  id: 1,
  list: [],
  classlist: [],
  dialogVisible: false,
  total: 0,
  page: 1,
  psize: 10,
  key: "",
  depid: "",
  classid: "",
  tableData: [],
});

const password = ref({
  oldpass: "",
  pass: "",
  checkPass: "",
  id: 0,
  name: "",
  classid: "",
  username: "",
});

// 表格
const list = async () => {
  let { data }: any = await studentlist({
    page: student.page,
    psize: student.psize,
    key: student.key,
    depid: student.depid,
  });
  student.tableData = data.list;
  student.total = data.counts;
};
// 表格

// 分页
const currentPage4 = ref(1);
const pageSize4 = ref(10);
const background = ref(true);
const handleSizeChange = (val: number) => {
  student.psize = val;
  list();
};
const handleCurrentChange = (val: number) => {
  student.page = val;
  list();
};
// 分页

// 删除
const stu_delete = (id: string) => {
  ElMessageBox.confirm("确定要删除此条消息吗", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: " 取消",
    type: "warning",
  })
    .then(async () => {
      ElMessage({
        type: "success",
        message: "删除成功",
      });
      list();
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消删除",
      });
    });
};
// 删除

// 批量删除
let ids = ref<any>("");
const handleSelectionChange = (val: []) => {
  const arr: any = val.map((item: { id: any }) => {
    return item.id;
  });
  ids = arr;
};
const arrall_del = () => {
  ElMessageBox.confirm("确定要删除选定的班级？", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    center: false,
  })
    .then(async () => {
      let res: any = await classesdes(ids);
      if (res.errCode === 10000) {
        ElMessage({
          type: "success",
          message: "删除成功",
        });
        list();
      }
    })
    .catch(() => {
      ElMessage({
        type: "error",
        message: "已取消删除",
      });
    });
};
const getDepid = async (val: any) => {
  student.depid = val;
  const res: any = await classeslist({ depid: student.depid });
  if (res.errCode === 10000) {
    student.classlist = res.data.list;
  }
};
// 批量删除

// 添加
let dialogshow = ref<any>();
const addstudent = () => {
  dialogshow.value.dialogVisible = true;
};

//添加
const dialogformshow = ref<any>();
const addALL = () => {
  dialogformshow.value.dialogVisible = true;
};
// 添加

const department = async () => {
  let res: any = await reqList();
  student.list = res.data.list;
};

// 修改
const dialog=()=>{
  student.dialogVisible=false
}
const updatelist = (data: any) => {
  let res = JSON.parse(JSON.stringify(data));
  student.dialogVisible = true;
  form.value.id = res.id;
  form.value.name = res.name;
  form.value.classid = res.classid;
  form.value.remarks = res.remarks;
  form.value.depid = res.depid;
  form.value.classname = res.classname;
  form.value.mobile = res.mobile;
  form.value.username = res.username;
};
const uponfirm = async () => {
  let res: any = await studentupdata({
    id: form.value.id,
    name: form.value.name,
    classid: form.value.classid,
    depid: form.value.depid,
    classname: form.value.classname,
    remarks: form.value.remarks,
    mobile: form.value.mobile,
    username: form.value.username,
  });
  if (res.errCode === 10000) {
    ElMessage({
      type: "success",
      message: "修改成功",
    });
    list();
    student.dialogVisible = false;
  }
};
// 修改

// 部门级联
let id = ref<Number>();
const classes = async () => {
  let res: any = await classesdepartment({});
  if (res.errCode === 10000) {
    options.value = res.data.list;
  }
};
interface Iprops {
  value: string;
  label: string;
  children?: [];
}
const options = ref<Array<Iprops>>([]);
interface IcascaderProps {
  value: string;
  label: string;
  expandTrigger?: string;
  checkStrictly: boolean;
  emitPath: boolean;
}
const cascaderProps = ref<IcascaderProps>({
  label: "name",
  value: "id",
  expandTrigger: "hover" as const,
  checkStrictly: true,
  emitPath: false,
});
// 部门级联

// 搜索
const searchfn = () => {
  list();
};

// 重置秘密
const uppass = (data: any) => {
  student.centerDialogVisible = true;
  password.value.name = data.name;
  password.value.classid = data.classid;
  password.value.id = data.id;
  password.value.oldpass = data.oldpass;
  password.value.username = data.username;
};
const adduppass = async () => {
  let res: any = await studentupdata({
    classid: password.value.classid,
    id: password.value.id,
    name: password.value.name,
    oldpass: password.value.pass,
    pass: password.value.pass,
    username: password.value.username,
  });
  if (res.errCode === 10000) {
    student.centerDialogVisible = false;
    ElMessage({
      type: "success",
      message: "重置成功",
    });
    list();
  }
};
// 重置密码
onMounted(() => {
  list();
  department();
  classes();
});
</script>
<style scoped>
@import url("./student.css");
</style>
