<template>
  <div>
    <header>
      <!-- 标题 -->
      <p class="classes_p">班级管理</p>
      <!-- 标题 -->
      <el-button @click="classFn(0)" type="primary">添加班级</el-button>
    </header>
    <!-- 搜索 -->
    <div class="classes_search">
      <el-form :inline="true" :model="from" class="demo-form-inline">
        <el-form-item label="班级名称">
          <el-input v-model="from.config.key" @keyup.enter.native="searchfn" @submit.native.prevent clearable
            placeholder="请输入关键字" />
        </el-form-item>
        <el-form-item label="部门">
          <cascader :options="options" :cascaderProps="cascaderProps" :cascaderChange="cascaderChange" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchfn">查询</el-button>
        </el-form-item>
      </el-form>
      <el-button type="danger" v-if="from.isshow" @click="open">批量删除</el-button>
    </div>
    <!-- 搜索 -->

    <!-- 表格 -->
    <div class="classes_table">
      <el-table ref="multipleTableRef" :data="from.tableData" style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column property="name" label="班级名称" />
        <el-table-column property="depname" label="部门" />
        <el-table-column property="address" label="操作">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="classFn(scope.row)">修改</el-button>
            <el-button link type="primary" size="small" @click="deleclasses(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 表格 -->

    <!-- 分页 -->
    <div class="classes_pagsing">
      <el-pagination v-model:current-page="currentPage4" v-model:page-size="pageSize4" :page-sizes="[10, 20, 30, 40]"
        :small="small" :disabled="disabled" :background="background" layout="total, sizes, prev, pager, next, jumper"
        :total="from.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <!-- 分页 -->

    <!-- 修改弹窗 -->
    <el-dialog v-model="dialogFormVisible" title="修改">
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" status-icon>
        <el-form-item label="班级名称" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="部门" prop="depid">
          <cascader :options="options" :cascaderProps="cascaderProps" :cascaderChange="cascaderChangeClass" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeClass">取消</el-button>
          <el-button type="primary" @click="updateStudent">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 修改弹窗 -->
  </div>
</template>

<script setup lang="ts">
import { ElTable } from "element-plus";
import { reactive, ref, onMounted } from "vue";
import { classeslist, classesdelete, classesdepartment, addClasses } from "../../api/classes";
import { ElMessage, ElMessageBox } from "element-plus";
import cascader from "../../components/common/cascader.vue";
import type { FormInstance, FormRules } from 'element-plus'
// 关闭修改弹出框
const closeClass = ()=>{
  console.log(1111);
  
  ruleForm.depid = 0
  dialogFormVisible.value = false
}

// 添加 / 修改 班级
const classFn = (val: any) => {
  if (val === 0) {
    ruleForm.id = 0
    ruleForm.name = ''
    ruleForm.depid = 0
  } else {
    ruleForm.name = val.name
    ruleForm.depid = val.depid
    ruleForm.id = val.id
  }
  dialogFormVisible.value = true
}
// 点击确定 提交
const updateStudent = () => {
  console.log({
        id: ruleForm.id,
        name: ruleForm.name,
        depid: ruleForm.depid
      });
  ruleFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      let res: any = await addClasses({
        id: ruleForm.id,
        name: ruleForm.name,
        depid: ruleForm.depid
      })
      console.log(res);
      if (res.errCode === 10000) {
        ElMessage.success('修改成功')
        list()
        dialogFormVisible.value = false
      }
    } else {
      console.log('error submit!')
    }
  })
}

const ruleForm = reactive({
  name: '',
  depid: 0,
  id: 0
})
const ruleFormRef = ref()
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入班级名称', trigger: 'blur' },
    { min: 1, max: 8, message: '班级名称为1-8个字符', trigger: 'blur' }
  ],
  depid: [
    {
      required: true,
      message: '请选择部门',
      trigger: 'change',
    },
  ],
})

// 搜索
const from = reactive({
  isshow: false,
  // user: "",
  // region: "",
  name: "",
  depid: "",
  tableData: [],
  total: 0,
  config: {
    depid: 0,
    key: "",
    page: 1,
    psize: 10,
  },
});

// 搜索
const searchfn = () => {
  list()
};
// 获取搜索级联框
const cascaderChange = (val: Array<number>) => {
  if (val && val.length) {
    from.config.depid = val[val.length - 1]
  } else {
    from.config.depid = 0
  }
  list()
}
// dialog里的弹出框
const cascaderChangeClass = (val: Array<number>) => {
  ruleForm.depid = val[val.length - 1]
}
// 部门级联
const classes = async () => {
  let res: any = await classesdepartment({});
  if (res.errCode === 10000) {
    options.value = res.data.list;
  }
};
interface Iprops {
  value: string,
  label: string,
  children?: []
}
const options = ref<Array<Iprops>>([])
interface IcascaderProps {
  value: string,
  label: string,
  expandTrigger?: string,
  checkStrictly: boolean
}
const cascaderProps = ref<IcascaderProps>({
  label: 'name',
  value: 'id',
  expandTrigger: 'hover' as const,
  checkStrictly: true
});

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

// 列表请求
const list = async () => {
  let res: any = await classeslist({
    page: from.config.page,
    psize: from.config.psize,
    depid: from.config.depid,
    key: from.config.key
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
  ElMessageBox.confirm("确定要删除选定的班级？", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    center: false,
  })
    .then(async () => {
      let res: any = await classesdelete({ id: index });
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

// 修改
const dialogFormVisible = ref(false);
// 修改

onMounted(() => {
  list();
  classes();
});

// 表格
</script>
<style scoped>
@import url("./classes.css");
</style>
