<template>
  <div>
    <header>
      <!-- 标题 -->
      <p class="classes_p">班级管理</p>
      <!-- 标题 -->
      <el-button @click="classFn" type="primary">添加班级</el-button>
    </header>

    <!-- 搜索 -->
    <div class="classes_search">
      <el-form :inline="true" :model="from" class="demo-form-inline">
        <el-form-item label="班级名称">
          <el-input
            v-model="from.config.key"
            @keyup.enter.native="searchfn"
            @submit.native.prevent
            style="width: 200px"
            @change="clearableKey"
            clearable
            placeholder="请输入关键字"
          />
        </el-form-item>
        <el-form-item label="部门">
          <cascader
            :options="options"
            :cascaderProps="cascaderProps"
            :cascaderChange="cascaderChange"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchfn">查询</el-button>
        </el-form-item>
      </el-form>
      <el-button type="danger" v-show="ids.length > 0" @click="open"
        >批量删除</el-button
      >
    </div>
    <!-- 搜索 -->

    <!-- 表格 -->
    <div class="classes_table">
      <el-table
        ref="multipleTableRef"
        :data="from.tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :header-cell-style="{ background: '#f8f8f8' }"
        :row-style="{ height: '50px' }"
      >
        <el-table-column type="selection" align="center" width="55" />
        <el-table-column property="name" align="center" label="班级名称" />
        <el-table-column property="depname" align="center" label="部门" />
        <el-table-column property="address" align="center" label="操作">
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="small"
              @click="classFnup(scope.row)"
              >修改</el-button
            >
            <el-button
              link
              type="primary"
              size="small"
              @click="deleclasses(scope.row.id)"
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

    <!-- 添加 -->
    <classadd ref="dialogshow" :getlist="list"></classadd>

    <!-- 添加 -->

    <!-- 修改弹窗 -->
    <el-dialog v-model="from.dialogFormVisible" title="修改" width="35%">
      <el-form :model="ruleForm" label-width="90px">
        <el-form-item label="班级名称" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="部门" prop="depid">
          <cascader
            ref="cascaderRef"
            :options="options"
            :cascaderProps="cascaderProps"
            :cascaderChange="cascaderChangeClass"
            @getDepid="getDepid"
          />
        </el-form-item>
        <span class="dialog-footer">
          <el-button @click="closeClass">取消</el-button>
          <el-button type="primary" @click="updateStudent"> 确定 </el-button>
        </span>
      </el-form>
    </el-dialog>
    <!-- 修改弹窗 -->
  </div>
</template>

<script setup lang="ts">
import { ElTable } from 'element-plus';
import { reactive, ref, onMounted, nextTick } from 'vue';
import {
  classeslist,
  classesdelete,
  classesdepartment,
  addClasses,
  classesides,
} from '../../api/classes';
import { ElMessage, ElMessageBox } from 'element-plus';
import cascader from '../../components/common/cascader.vue';
// import type { FormInstance, FormRules } from 'element-plus';
import classadd from './classadd.vue';
// 添加
let dialogshow = ref<any>();
const classFn = () => {
  dialogshow.value.dialogVisible = true;
};
// 修改
// 关闭修改弹出框
const closeClass = () => {
  from.dialogFormVisible = false;
};
const cascaderRef = ref();
const classFnup = (data: any) => {
  from.dialogFormVisible = true;
  let res = JSON.parse(JSON.stringify(data));
  ruleForm.id = res.id;
  nextTick(() => {
    cascaderRef.value.value = res.depid;
  });
  ruleForm.name = res.name;
  ruleForm.depid = res.depid;
  // console.log(1111, ruleForm.depid);
};

const updateStudent = async (val: any) => {
  let res: any = await addClasses({
    name: ruleForm.name,
    depid: ruleForm.depid,
    id: ruleForm.id,
  });
  // console.log(ruleForm)
  if (res.errCode === 10000) {
    from.dialogFormVisible = false;
    ElMessage({
      type: 'success',
      message: '修改成功',
    });
    list();
  }
};
// 修改

const ruleForm = reactive({
  name: '',
  depid: 0,
  id: 0,
});

// 搜索
const from = reactive({
  isshow: false,
  name: '',
  depid: '',
  tableData: [],
  total: 0,
  config: {
    depid: 0,
    key: '',
    page: 1,
    psize: 10,
  },
  dialogFormVisible: false,
});
// 搜索

const searchfn = () => {
  list();
};

// 获取搜索级联框
const cascaderChange = (val: Array<number>) => {
  if (val && val.length) {
    from.config.depid = val[val.length - 1];
  } else {
    from.config.depid = 0;
  }

  list();
};
// dialog里的弹出框
const cascaderChangeClass = (val: Array<number>) => {
  ruleForm.depid = val[val.length - 1];
};

// 部门级联
// 获取部门id
const getDepid = (val: any) => {
  ruleForm.depid = val;
};
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
  emitPath: false,
  checkStrictly: true,
});

// 部门级联

// 列表请求
const list = async () => {
  let res: any = await classeslist({
    page: from.config.page,
    psize: from.config.psize,
    depid: from.config.depid,
    key: from.config.key,
  });
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
let ids = ref<any>([]);
const handleSelectionChange = (val: []) => {
  ids.value = val.map((item: any) => {
    return item.id;
  });
};
const open = () => {
  ElMessageBox.confirm('确定要删除选定的班级？', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    center: false,
  })
    .then(async () => {
      console.log(ids.value);

      let res: any = await classesides(ids.value);
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
        type: 'error',
        message: '已取消删除',
      });
    });
};
// 批量删除

// 单个删除
const deleclasses = (index: any) => {
  ElMessageBox.confirm('确定要删除选定的班级？', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    center: false,
  })
    .then(async () => {
      let res: any = await classesdelete({ id: index });
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
        type: 'error',
        message: '已取消删除',
      });
    });
};
const clearableKey = () => {
  if (!from.config.key) {
    list();
  }
};
onMounted(() => {
  list();
  classes();
});

// 表格
</script>
<style scoped>
@import url('./classes.css');
</style>
