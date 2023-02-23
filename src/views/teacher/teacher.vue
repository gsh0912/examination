<template>
  <div class="box">
    <div class="head">
      <div class="left">师资管理</div>
      <div class="right">
        <el-button>批量添加</el-button>
        <el-button type="primary">添加教学资源</el-button>
      </div>
    </div>
    <!-- 关键词 -->
    <el-form :inline="true" :model="tableData" class="demo-form-inline">
      <el-form-item label="关键词">
        <el-input v-model="tableData.listConfig.name" placeholder="请输入关键字" />
      </el-form-item>
      <!-- 部门 -->
      <el-form-item label="部门">
        <el-cascader v-model="value" :options="options" @change="handleChange" />
      </el-form-item>
      <!-- 角色 -->
      <el-form-item label="角色">
        <el-select v-model="tableData.listConfig" placeholder="请选择">
          <el-option v-for="item in getData"></el-option>
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
            <span class="spanActive" @click="dialogVisibles = true">修改</span>
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
      <el-form-item label="再次输入密码" prop="checkPass">
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
  <el-dialog v-model="dialogVisibles" title="修改老师" width="30%">

    <el-form ref="ruleFormRef" :model="ruleForm" :rules="teacherRules" label-width="120px" class="demo-ruleForm"
      :size="formSize" status-icon>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="ruleForm2.name" />
      </el-form-item>
      <el-form-item label="电话" prop="tel">
        <el-input v-model="ruleForm2.tel" />
      </el-form-item>
      <el-form-item label="部门" prop="depname">
        <el-cascader v-model="ruleForm2.depname" :options="options" @change="handleChange" />
      </el-form-item>
      <el-form-item label="角色" prop="region">
        <el-select v-model="ruleForm2.region" placeholder="请选择角色">
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
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
import { teacherList, deleteList, addList } from '../../api/teacher'

import { ElMessageBox, ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { update } from 'lodash';
const searchlog = ref('');
// 弹出窗关闭之前调用
const beforeClose = () => {
  ruleForm.checkPass = ''
  ruleForm.pass = ''
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
const updatepass = async () => {
  let res:any = await addList({
    id:  addtable.add.id,
    username: addtable.add.username,
    pass: addtable.add.pass,
    name: addtable.add.name,
    tel: addtable.add.tel,
    depid:  addtable.add.depid,
    roleid: addtable.add.roleid
  })
    if(res.errCode===10000){
      tableData.dialogVisible=false
    ElMessage({
      type:'success',
      message:"修改成功"
    })
    }  
  console.log(res);
  
}
// 新设置密码弹框
const dialogVisible = ref(false)
const value = ref([])
// 修改弹框
const dialogVisibles = ref(false)

// 修改表单
const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()

interface IlistConfig {
  page: number,
  psize: number,
  name: string,
  depname: string,
  tel: string,
  rolename: string,
  username: string
}
interface ItableData {
  listConfig: IlistConfig,
  tableArr: [],
  counts: number,
  dialogVisible: boolean,
}

// 表格相关配置
const tableData = reactive<ItableData>({
  dialogVisible: false,
  listConfig: {
    page: 1,
    psize: 5,
    name: '',
    depname: '',
    tel: '',
    rolename: '',
    username: ''

  },
  tableArr: [],
  counts: 0
})

const addtable = reactive({
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


// 重置密码input框
const formInline = reactive({
  user: '',
  region: '',
})
// 修改表单
const ruleForm2 = reactive({
  tel: '',
  name: '',
  depname: '',
  region: '',
})
// 部门级联
const handleChange = (value: any) => {
  console.log(value)
}

// 级联
const options = [
  {
    value: 'guide',
    label: 'Guide',
    children: [
      {
        value: 'disciplines',
        label: 'Disciplines',
        children: [
          {
            value: 'consistency',
            label: 'Consistency',
          },
          {
            value: 'feedback',
            label: 'Feedback',
          },
          {
            value: 'efficiency',
            label: 'Efficiency',
          },
          {
            value: 'controllability',
            label: 'Controllability',
          },
        ],
      },
      {
        value: 'navigation',
        label: 'Navigation',
        children: [
          {
            value: 'side nav',
            label: 'Side Navigation',
          },
          {
            value: 'top nav',
            label: 'Top Navigation',
          },
        ],
      },
    ],
  },
  {
    value: 'component',
    label: 'Component',
    children: [
      {
        value: 'basic',
        label: 'Basic',
        children: [
          {
            value: 'layout',
            label: 'Layout',
          },
          {
            value: 'color',
            label: 'Color',
          },
          {
            value: 'typography',
            label: 'Typography',
          },
          {
            value: 'icon',
            label: 'Icon',
          },
          {
            value: 'button',
            label: 'Button',
          },
        ],
      },
      {
        value: 'navigation',
        label: 'Navigation',
        children: [
          {
            value: 'menu',
            label: 'Menu',
          },
          {
            value: 'tabs',
            label: 'Tabs',
          },
          {
            value: 'breadcrumb',
            label: 'Breadcrumb',
          },
          {
            value: 'dropdown',
            label: 'Dropdown',
          },
          {
            value: 'steps',
            label: 'Steps',
          },
        ],
      }
    ],
  },
  {
    value: 'resource',
    label: 'Resource',
    children: [
      {
        value: 'axure',
        label: 'Axure Components',
      },
      {
        value: 'sketch',
        label: 'Sketch Templates',
      },
      {
        value: 'docs',
        label: 'Design Documentation',
      },
    ],
  },
]
// 搜索
const searchFn = () => {
  console.log(123);
  // tableData.listConfig.name = searchlog ;
  // getData()
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
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
  ],
  tel: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { max: 11, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  region: [
    {
      required: true,
      message: '请选择角色',
      trigger: 'change',
    },
  ],
  depname: [
    {
      required: true,
      message: '请选择部门',
      trigger: 'change',
    }
  ]
})

onMounted(() => {
  getData()
})
</script>
<style scoped>
.box .head {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
}

.box .head .left {
  font-size: 20px;
}

.el-table {
  margin-bottom: 40px;
}

.pagination {
  display: flex;
  justify-content: center;
}

span {
  color: #409eff;
  cursor: pointer;
  font-size: 14px;
  margin: 0 5px;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>