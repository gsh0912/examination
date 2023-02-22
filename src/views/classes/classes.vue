<template>
  <div>
    <!-- 标题 -->
    <p class="classes_p">班级管理</p>
    <!-- 标题 -->

    <!-- 搜索 -->
    <div class="classes_search">
      <el-form :inline="true" :model="from" class="demo-form-inline">
        <el-form-item label="班级名称">
          <el-input v-model="from.config.key" @keyup.enter.native="searchfn" @submit.native.prevent clearable
            placeholder="请输入关键字" />
        </el-form-item>
        <el-form-item label="部门">
          <cascader :options="options" :cascaderProps="cascaderProps" :cascaderChange="cascaderChange"/>
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
            <el-button link type="primary" size="small" @click="dialogFormVisible = true">修改</el-button>
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
      <el-form :model="from" class="from_width">
        <el-form-item label="Activity name" prop="name">
          <el-input v-model="from.name" />
        </el-form-item>
        <el-form-item label="Activity zone" prop="region">
          <cascader :options="options" :cascaderProps="cascaderProps" :cascaderChange="cascaderChange" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">Cancel</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">
            Confirm
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
import { classeslist, classesdelete, classesdepartment } from "../../api/classes";
import { ElMessage, ElMessageBox } from "element-plus";
import cascader from "../../components/common/cascader.vue";

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
    depid: "",
    key: "",
    page: 1,
    psize: 10,
  },
});

// 搜索
const searchfn = () => {
  list()
};
// cascaderChange
const cascaderChange = (val:Array<number>)=>{
  console.log(val);
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
  expandTrigger?:string,
  checkStrictly:boolean
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
// 单个删除

// 修改
const dialogTableVisible = ref(false);
const dialogFormVisible = ref(false);
const formLabelWidth = "140px";
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
