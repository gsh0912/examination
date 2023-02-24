<template>
  <div class="box">
    <div class="head">
      <div class="left">师资管理</div>
      <div class="right">
        <el-button>批量添加</el-button>
        <el-button type="primary" @click="onShow" style="float:right">添加教学资源</el-button>
        <el-form ref="ruleFormRefAdd" :model="addteacher" :rules="teacherRules" label-width="110px" status-icon>
          <el-form-item class="add">

            <el-dialog v-model="dialogFormVisible" width="33%" :title="title + '老师'" v-if="dialogFormVisible == true">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="addteacher.name" style="width:400px" />
              </el-form-item>
              <el-form-item label="电话" prop="tel">
                <el-input v-model="addteacher.tel" />
              </el-form-item>
              <el-form-item label="部门">
                <cascader :options="options" :cascaderProps="cascaderProps" :cascaderChange="cascaderChange" />
              </el-form-item>
              <el-form-item label="角色">
                <el-select v-model="addteacher.roleid" placeholder="请选择">
                  <el-option v-for="item in addtable.jueshe" :value="item.id">{{ item.name }}</el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="账号" v-if="isshow" prop="username" style="margin-top:15px">
                <el-input v-model="addteacher.username" style="width:400px" />
              </el-form-item>
              <el-form-item label="密码" prop="pwd" v-if="isshow" style="margin-top:15px">
                <el-input v-model="addteacher.pass" type="password" placeholder="" style="width:400px" />
              </el-form-item>
              <template #footer>
                <span class="dialog-footer">
                  <el-button @click="close">取消</el-button>
                  <el-button type="primary" @click="adds(ruleFormRefAdd)">确定</el-button>
                </span>
              </template>
            </el-dialog>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 关键词 -->
    <el-form :inline="true" :model="tableData" class="demo-form-inline">
      <el-form-item label="关键词">
        <el-input v-model="tableData.listConfig.name" placeholder="请输入关键字" />
      </el-form-item>
      <!-- 部门 -->
      <el-form-item label="部门">
        <cascader :options="options" :cascaderProps="cascaderProps" :cascaderChange="cascaderChange" />
      </el-form-item>
      <!-- 角色 -->
      <el-form-item label="角色">
        <el-select v-model="tableData.listConfig.rolename" placeholder="请选择">
          <el-option v-for="item in addtable.jueshe" :value="item.id">{{ item.name }}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchFn">搜索</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :data="tableData.tableArr" style="width: 100%;background-color: aliceblue;">
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="depname" label="部门" />
      <el-table-column prop="tel" label="电话" />
      <el-table-column prop="rolename" label="角色" />
      <el-table-column prop="username" label="账号" />
      <el-table-column label="设置">
        <template #default="scope">
          <div>
            <span class="spanActive" @click="anew(scope.row)">从新设置密码</span>
            <span class="spanActive" @click="modification(scope.row)">修改</span>
            <span class="spanActive" @click="del(scope.row.id)">剪除</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination v-model:current-page="currentPage4" v-model:page-size="pageSize4" :page-sizes="[5, 10, 15, 20]"
        :small="small" background layout="total, sizes, prev, pager, next, jumper" :total="tableData.counts"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
  <!-- 从新设置密码弹框 -->
  <el-dialog v-model="tableData.dialogVisible" title="重置密码" width="35%" @close="beforeClose">
    <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="120px" class="demo-ruleForm">
      <el-form-item label="姓名" prop="name">
        {{ addtable.add.name }}
      </el-form-item>

      <el-form-item label="输入密码" prop="pass">
        <el-input v-model="addtable.add.oldpass" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input v-model="addtable.add.confirmPass" type="password" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updatepass">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 修改的弹出框 -->
  <el-dialog v-model="tableData.dialogVisibles" title="修改老师" width="35%">

    <el-form ref="ruleFormRef" :model="ruleForm" :rules="teacherRules" label-width="100px" class="demo-ruleForm"
      :size="formSize" status-icon>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="modificationList.modification.name" />
      </el-form-item>
      <el-form-item label="电话" prop="tel">
        <el-input v-model="modificationList.modification.tel" />
      </el-form-item>
      <el-form-item label="部门">
        <cascader :options="options" :cascaderProps="cascaderProps" :cascaderChange="cascaderChange" />
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="tableData.listConfig.rolename" placeholder="请选择">
          <el-option v-for="item in addtable.jueshe" :value="item.id">{{ item.name }}</el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisibles = false">取消</el-button>
        <el-button type="primary" @click="dialogVisibles = false">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang='ts'>
import { reactive, ref, onMounted } from 'vue'
import { teacherList, deleteList, addList, classesdepartment } from '../../api/teacher'
import { roleList } from '../../api/role'

import { ElMessageBox, ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import cascader from "../../components/common/cascader.vue";
const dialogFormVisible = ref(false);
const isshow = ref(false);
const title = ref()
const ruleFormRefAdd = ref();
const options = ref<Array<Iprops>>([])
const dialogVisible = ref(false)  // 新设置密码弹框
const dialogVisibles = ref(false)// 修改弹框
const formSize = ref('default')// 修改表单
const ruleFormRef = ref<FormInstance>()
// 弹出窗关闭之前调用
const beforeClose = () => {
  ruleForm.checkPass = ''
  ruleForm.pass = ''
}
// 添加弹窗
const addteacher = reactive({
  id: 0,
  username: "",
  pass: "",
  name: "",
  tel: "",
  depid: 0,
  roleid: "",
  depids: ''
});
//添加按钮
const onShow = () => {
  dialogFormVisible.value = true;
  isshow.value = true;
  title.value = '添加'
};
// 取消按钮
const close = () => {
  dialogFormVisible.value = false;
  addteacher.name = "";
  addteacher.tel = "";
  addteacher.username = "";
  addteacher.pass = "";
  addteacher.depid = 0;
  addteacher.roleid = "";
}
// 添加
const adds = async (formEl: FormInstance | undefined) => {
  console.log(formEl);
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      let res = await addList(tableData.listConfig)
      console.log(res);
      dialogFormVisible.value = false;
      addteacher.name = "";
      addteacher.tel = "";
      addteacher.roleid = "";
      addteacher.username = "";
      addteacher.pass = "";
      getData()
      if (addteacher.id == 0) {
        ElMessage({
          showClose: true,
          message: "添加成功",
          type: "success",
        });
      } else {
        ElMessage({
          showClose: true,
          message: "修改成功",
          type: "success",
        });
      }
    }
  })

}

// 从新设置密码
const anew = (data: any) => {
  console.log(data)
  addtable.add.id = data.id
  addtable.add.username = data.username
  addtable.add.pass = data.pass
  addtable.add.name = data.name
  addtable.add.tel = data.tel
  addtable.add.depid = data.depid
  addtable.add.roleid = data.roleid
  addtable.add.confirmPass = data.confirmPass
  tableData.dialogVisible = true
  addtable.add.oldpass = data.oldpass
}

// 调用修改密码数据
const updatepass = async () => {
  let res: any = await addList({
    id: addtable.add.id,
    username: addtable.add.username,
    pass: addtable.add.pass,
    name: addtable.add.name,
    tel: addtable.add.tel,
    depid: addtable.add.depid,
    roleid: addtable.add.roleid
  })
  if (res.errCode === 10000) {
    tableData.dialogVisible = false
    ElMessage({
      type: 'success',
      message: "修改成功"
    })
  }
  console.log(res);
}
interface IlistConfig {
  id: 0,
  page: number,
  psize: number,
  name: string,
  depname: string,
  tel: string,
  rolename: string,
  username: string,
  pass: string
}
interface ItableData {
  listConfig: IlistConfig,
  tableArr: [],
  counts: number,
  dialogVisible: boolean,
  dialogVisibles: boolean
}
// 修改
const modification = (data: any) => {
  console.log(data);
  modificationList.modification.name = data.name
  modificationList.modification.tel = data.tel
  modificationList.modification.depid = data.depid
  modificationList.modification.roleid = data.roleid
  tableData.dialogVisibles = true
}

// 表格相关配置
const tableData = reactive<ItableData>({
  dialogVisible: false,
  dialogVisibles: false,
  listConfig: {
    id: 0,
    page: 1,
    psize: 10,
    name: '',
    depname: '',
    tel: '',
    rolename: '',
    username: '',
    pass: ''

  },
  tableArr: [],
  counts: 0
})
const addtable = reactive<any>({
  jueshe: [],
  add: {
    id: 0,
    username: "",
    pass: "",
    name: "",
    tel: "",
    depid: '',
    roleid: '',
    confirmPass: '',
    oldpass: ""
  }
})

const modificationList = reactive({
  modification: {
    name: "",
    tel: "",
    depid: '',
    roleid: '',

  }
})

//请求列表接口
const getData = async () => {
  const res: any = await teacherList(tableData.listConfig);
  console.log(res);
  tableData.tableArr = res.data.list
  tableData.counts = res.data.counts
}
//单删
const del = (id: number) => {
  ElMessageBox.confirm(
    '确定要删除该条数据吗',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    let res: any = await deleteList({ id })
    console.log(res);

    if (res.errCode === 10000) {
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
      getData()
    }
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消',
    })
  })

}

// 部门
const cascaderChange = (val: Array<number>) => {
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
// 搜索
const searchFn = () => {
  console.log(123);

}
// 分页
const currentPage4 = ref(1)
const pageSize4 = ref(5)
const small = ref(false)

// 一页有多少条
const handleSizeChange = (val: number) => {
  tableData.listConfig.psize = val
  getData()
}
// 第几页
const handleCurrentChange = (val: number) => {
  tableData.listConfig.page = val
  getData()
}

// 从新设置密码表单校验
const ruleForm = reactive({
  pass: '',
  checkPass: '',
})

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    if (ruleForm.checkPass !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('checkPass', () => null)
    }
    callback()
  }
}
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请重新输入密码'))
  } else if (value !== ruleForm.pass) {
    callback(new Error("两次密码不一致"))
  } else {
    callback()
  }
}
const rules = reactive({
  pass: [{ validator: validatePass, trigger: 'blur' }],
  checkPass: [{ validator: validatePass2, trigger: 'blur' }]
})

// 修改老师验证
const teacherRules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  tel: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { max: 11, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' }
  ],
  pwd: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
})


// 角色
const roleLists = async () => {
  let res: any = await roleList()
  if (res.errCode === 10000) {
    addtable.jueshe = res.data.list
    console.log(addtable.jueshe);

  }
}
onMounted(() => {
  getData();
  classes()
  roleLists()
})
</script>
<style scoped>
@import url("./teacher.less");
</style>