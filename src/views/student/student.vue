<template>
  <div>
    <!-- 标题 -->
    <p class="classes_p">班级管理</p>
    <!-- 标题 -->

    <!-- 搜索 -->
    <div class="classes_search">
      <el-form :inline="true" :model="from" class="demo-form-inline">
        <el-form-item label="班级名称">
          <el-input
            v-model="from.config.key"
            @keyup.enter.native="searchfn"
            @submit.native.prevent
            clearable
            placeholder="请输入关键字"
          />
        </el-form-item>
        <el-form-item label="部门">
          <el-cascader :options="options" :props="props1" clearable />
        </el-form-item>
        <el-form-item label="班级">
          <el-select v-model="from.name" placeholder="please select your zone">
            <el-option label="Zone one" value="shanghai" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchfn">查询</el-button>
          <el-button type="danger" disabled>批量删除</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 搜索 -->

    <!-- 表格 -->
    <div class="classes_table">
      <el-table
        ref="multipleTableRef"
        :data="from.tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column property="name" label="学生姓名" />
        <el-table-column property="pass" label="备注" />
        <el-table-column property="classname"  label="所属部门" />
        <el-table-column property="depname"  label="所在班级" />
        <el-table-column property="username" label="账号" />
        <el-table-column property="addtime" label="添加时间" />
        <el-table-column property="address"  label="操作">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="uppassword(scope.row)"
              >重置密码</el-button
            >
            <el-button link type="primary" size="small" @click="updatelist(scope.row)"
              >修改</el-button
            >
            <el-button link type="primary" size="small" @click="deleclasses(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 表格 -->

    <!-- 分页 -->
    <div class="classes_pagsing">
      <el-pagination
        v-model:current-page="currentPage4"
        v-model:page-size="pageSize4"
        :page-sizes="[10, 20, 30, 40]"
        :small="small"
        :disabled="disabled"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="from.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 分页 -->

    <!-- 修改弹窗 -->
    <el-dialog v-model="from.dialogFormVisible" width="30%" title="修改">
      <el-form :model="from" class="from_width">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="from.updata.name" />
        </el-form-item>
        <el-form-item label="电话" prop="region">
          <el-input v-model="from.updata.mobile" />
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="from.updata.classid">
            <el-option
              v-for="item in from.carlist"
              :label="item.label"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="班级" v-model="from.updata.classid">
          <el-select>
            <el-option label="" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="uplist"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 修改弹窗 -->

    <!-- 重置密码弹窗 -->
    <el-dialog v-model="from.centerDialogVisible" title="重置密码" width="30%">
      <el-form
        ref="ruleFormRef"
        :model="from.updata"
        status-icon
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item label="姓名" prop="pass">
          {{ from.passw.name }}
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input v-model="from.passw.pass" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input v-model="from.passw.oldpass" type="password" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="from.centerDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="uppass()"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 重置密码弹窗 -->
  </div>
</template>

<script setup lang="ts">
import { ElTable, FormInstance } from "element-plus";
import { reactive, ref, onMounted } from "vue";
import {
  studentlist,
  studentdelete,
  studentupdata,
  classesdepartment,
} from "../../api/student";
import { ElMessage, ElMessageBox } from "element-plus";

// 搜索
const from = reactive({
  id: 0,
  dialogFormVisible: false, //修改弹窗
  centerDialogVisible: false, //重置弹窗
  disabled: false,
  name: "",
  depid: "",
  tableData: [], //表格数据
  carlist: [] as any[],
  //修改数据
  updata: {
    id: 1,
    name: "",
    classid: "",
    mobile: "",
    username: "",
    pass: "",
    classname: "",
  },
  total: 0,
  //分页搜索
  config: {
    depid: "",
    key: "",
    page: 1,
    psize: 10,
  },
  passw: {
    oldpass: "",
    pass: "",
    checkPass: "",
    id: 0,
    name: "",
    classid: "",
    username: "",
  },
});

// 搜索
const searchfn = () => {};
// 搜索

// 部门级联
const classes = async () => {
  let res: any = await classesdepartment({});
  console.log(111, 2, res);
  if (res.errCode === 10000) {
    from.carlist = res.data.list;
  }
};
const props1 = {
  lazy: true,
  checkStrictly: true,
};
const options: any = [
  {
    value: "",
    label: "",
    children: [],
  },
];
// 部门级联


// 表格
interface User {
  date: string;
  name: string;
  address: string;
}
const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const multipleSelection = ref<User[]>([]);
const toggleSelection = (rows?: User[]) => {
};
const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val;
};
// 表格

// 列表请求
const list = async () => {
  let res: any = await studentlist({
    page: from.config.page,
    psize: from.config.psize,
  });
  console.log(res);
  if (res.errCode === 10000) {
    from.tableData = res.data.list;
    from.total = res.data.counts;
  }
};
// 列表请求

// 分页
const currentPage4 = ref(1); //默认页
const pageSize4 = ref(10); //默认条
const small = ref(false); //按钮大小
const background = ref(true); //是否开启背景颜色
const disabled = ref(false); //是否禁用
const handleSizeChange = (val: number) => {
  from.config.psize = val;
  list();
};
const handleCurrentChange = (val: number) => {
  from.config.page = val;
  list();
};
// 分页


// 批量删除
const open = () => {
  ElMessageBox.confirm("确定要删除选定的班级？", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    center: false,
  })
    .then(() => {
      ElMessage({
        type: "success",
        message: "删除成功",
      });
    })
    .catch(() => {
      ElMessage({
        type: "error",
        message: "已取消删除",
      });
    });
};
// 批量删除


// 单个删除
const deleclasses = (index: any) => {
  console.log(index);
  ElMessageBox.confirm("确定要删除选定的班级？", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    center: false,
  })
    .then(async () => {
      let res: any = await studentdelete({ id: index });
      console.log(res);
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
// 单个删除


// 修改
const dialogFormVisible = ref(false);
const updatelist = (data: any) => {
  from.dialogFormVisible = true;
  from.updata = data;
};
const uplist = async () => {
  if (from.id === 1) {
    let res: any = await studentupdata({
      id: from.updata.id,
      name: from.updata.name,
      mobile: from.updata.mobile,
      classid: from.updata.classid,
    });
    if (res.errCode === 10000) {
      ElMessage({
        type: "success",
        message: "修改成功",
      });
      from.dialogFormVisible = false;
      list();
    }
  }
};
// 修改


// 重置密码
const uppassword = (data: any) => {
  console.log(data);
  from.passw.name = data.name;
  from.passw.classid = data.classid;
  from.passw.id = data.id;
  from.passw.oldpass = data.oldpass;
  from.passw.username = data.username;
  from.centerDialogVisible = true;
};
const uppass = async () => {
  if (from.id === 0) {
    let res: any = await studentupdata({
      classid: from.passw.classid,
      id: from.passw.id,
      name: from.passw.name,
      oldpass: from.passw.pass,
      pass: from.passw.pass,
      username: from.passw.username,
    });
    console.log(1111, res);
  }
};
// 重置密码


onMounted(() => {
  list();
  classes();
});


</script>
<style scoped>
@import url("./student.css");
</style>
