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
          <el-button
            type="danger"
            :disabled="student.disabled"
            @click="arrall_del"
            >批量删除</el-button
          >
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
      :header-cell-style="{ background: '#f8f8f8' }"
      :row-style="{ height: '50px' }"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column property="name" label="学生姓名" />
      <el-table-column property="remarks" label="备注" />
      <el-table-column property="depname" label="所属部门" />
      <el-table-column property="classname" label="所在班级" />
      <el-table-column property="username" label="账号" />
      <el-table-column label="添加时间">
        <template #default="scope">
          {{ moment(scope.row.addtime).format('YYYY-MM-DD HH:mm') }}
        </template>
      </el-table-column>
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
          <el-button
            link
            type="primary"
            size="small"
            @click="updatelist(scope.row)"
            >修改</el-button
          >
          <el-button
            link
            type="primary"
            size="small"
            @click="stu_delete(scope.row.id)"
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

    <!-- 批量添加 -->
    <pass ref="dialogformshow"></pass>

    <!-- 修改 -->
    <el-dialog v-model="student.dialogVisible" title="修改" width="35%">
      <el-form
        :model="form"
        label-width="60px"
        ref="ruleFormRef"
        status-icon
        :rules="rules"
        class="demo-ruleForm"
      >
        <el-form-item label="姓名">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.mobile" />
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="form.depid" placeholder="请选择部门">
            <el-option
              v-for="item in student.list"
              :label="item.name"
              :key="item.id"
              @click.native="changeGateway(item)"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="班级">
          <el-select v-model="form.classid" placeholder="请选择班级">
            <el-option
              v-for="item in student.class"
              :label="item.name"
              :key="item.id"
              :value="item.id"
            />
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
    <el-dialog
      v-model="student.centerDialogVisible"
      title="重置密码"
      width="32%"
    >
      <el-form
        label-width="80px"
        :model="password"
        :rules="rules"
        ref="ruleFormRef"
      >
        <el-form-item label="姓名">{{ password.name }}</el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input v-model="password.pass" type="password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="oldpass">
          <el-input v-model="password.oldpass" type="password" />
        </el-form-item>
        <span class="dialog-footer">
          <el-button @click="student.centerDialogVisible = false"
            >取消</el-button
          >
          <el-button type="primary" @click="adduppass(ruleFormRef)">
            确定
          </el-button>
        </span>
      </el-form>
    </el-dialog>
    <!-- 重置密码 -->
  </div>
</template>

<script setup lang="ts">
import {
  ElTable,
  ElMessage,
  ElMessageBox,
  FormRules,
  FormInstance,
} from 'element-plus';
import { reactive, ref, onMounted } from 'vue';
import {
  studentlist,
  studentdelete,
  classesdes,
  studentupdata,
} from '../../api/student';
import { classesdepartment, classeslist } from '../../api/classes';
import add from './studentss/add.vue';
import pass from './studentss/pass.vue';
import { reqList } from '../../api/department';
import cascader from '../../components/common/cascader.vue';
import moment from 'moment';
const form = ref<any>({
  //修改数据
  id: 1,
  name: '',
  classid: '请选择班级',
  depid: '请选择部门',
  mobile: '',
  username: '',
  pass: '',
  classname: '',
  remarks: '',
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
  key: '',
  depid: '',
  classid: '',
  tableData: [],
  disabled: true,
  class: [],
});

const password = ref({
  oldpass: '',
  pass: '',
  checkPass: '',
  id: 0,
  name: '',
  classid: '',
  username: '',
  remarks: '',
});

// 表格
const list = async () => {
  let res: any = await studentlist({
    page: student.page,
    psize: student.psize,
    key: student.key,
    depid: student.depid,
  });
  student.tableData = res.data.list;
  student.total = res.data.counts;
};
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
  ElMessageBox.confirm('确定要删除此条消息吗', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: ' 取消',
    type: 'warning',
  })
    .then(async () => {
      let res: any = await studentdelete({ id: id });
      if (res.errCode === 10000) {
        ElMessage({
          type: 'success',
          message: '删除成功',
        });
        list();
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      });
    });
};
// 删除

// 批量删除
let ids = ref<any>('');
const handleSelectionChange = (val: []) => {
  if(val.length<=0){
    student.disabled = true;
  }
  const arr: any = val.map((item: { id: any }) => {
    student.disabled = false;
    return item.id;
  });
  ids = arr;
};
const arrall_del = () => {
  ElMessageBox.confirm('确定要删除选定的班级？', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    center: false,
  })
    .then(async () => {
      let res: any = await classesdes(ids);
      if (res.errCode === 10000) {
        ElMessage({
          type: 'success',
           
             message: '删除成功',
        });
        list();
        student.disabled = true;
      }
    })
    .catch(() => {
      ElMessage({
        type: 'error',
        message: '已取消删除',
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

//批量添加
const dialogformshow = ref<any>();
const addALL = () => {
  dialogformshow.value.dialogVisible = true;
};

// 修改
const dialog = () => {
  student.dialogVisible = false;
};
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
      type: 'success',
      message: '修改成功',
    });
    list();
    student.dialogVisible = false;
  }
};

// 部门级联
const department = async () => {
  let res: any = await reqList();
  student.list = res.data.list;
};

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
  label: 'name',
  value: 'id',
  expandTrigger: 'hover' as const,
  checkStrictly: true,
  emitPath: false,
});
// 部门级联

// 搜索
const searchfn = () => {
  list();
};

// 重置密码
const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'));
  } else if (value.toString().length < 6 || value.toString().length > 18) {
    callback(new Error('密码长度为6-18位'));
  } else {
    callback();
  }
};

const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'));
  } else if (value !== password.value.pass) {
    callback(new Error("两次密码不一致"));
  } else {
    callback();
  }
};

const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  pass: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 18, message: '学员密码为6-18个字符', trigger: 'blur' },
    { validator: validatePass, trigger: 'blur' },
  ],
  oldpass: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { min: 6, max: 18, message: '学员密码为6-18个字符', trigger: 'blur' },
    { validator: validatePass2, trigger: 'blur' },
  ],
});
const uppass = (data: any) => {
  student.centerDialogVisible = true;
  password.value.name = data.name;
  password.value.classid = data.classid;
  password.value.id = data.id;
  password.value.oldpass = data.oldpass;
  password.value.username = data.username;
};
const adduppass = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
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
          type: 'success',
          message: '重置成功',
        });
        list();
      }
    }
  });
};

// 修改班级
const changeGateway = async (val: any) => {
  let res: any = await classeslist({ depid: val.id });
  if (res.errCode === 10000) {
    student.class = res.data.list;
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
@import url('./student.css');
</style>
