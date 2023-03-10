<template>
  <el-dialog v-model="dialogVisible" :title="props.visibleTitle" width="40%">
    <div class="title">
      <el-form :model="searchForm" label-width="70px">
        <el-form-item label="部门">
          <el-select v-model="searchForm.depid" class="m-2" placeholder="Select" @change="depChange">
            <el-option v-for="item in state.DepartmentList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="班级" v-if="formFlag === '学生'">
          <el-select v-model="searchForm.classid" class="m-2" placeholder="Select" :disabled="classFlag"
            @change="classChange">
            <el-option v-for="item in state.ClassesList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <el-transfer v-model="value" :titles="['全选', '未选']" @left-check-change="left" @right-check-change="right"
      :data="studentList" :props="{ key: 'id', label: 'name' }" />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="visibleFn">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, defineExpose, defineProps,reactive, toRefs} from 'vue'
import { ElMessageBox } from 'element-plus'
import { reqStudent, getTeacher, getMarkTeachers } from '../../../api/test'
import { reqList } from '../../../api/department'
import { classeslist } from '../../../api/classes'


// 表单搜索
interface IsearchForm {
  depid: Number | string,
  classid: Number | string
}
interface Istate {
  DepartmentList: [{ id: number, name: string }]
  ClassesList: [{ id: number, name: string }]
  searchForm: IsearchForm
}
// 表单数据
const state = reactive<Istate>({
  DepartmentList: [{ id: 1, name: '2' }],
  searchForm: {
    depid: '请选择',
    classid: '请选择'
  },
  ClassesList: [{ id: 1, name: '2' }]
})
let { searchForm } = toRefs(state)

// 获取部门列表
const getDepartmentList = async () => {
  let res = await reqList()
  console.log(res);
  state.DepartmentList = res.data.list
}


// 部门改变事件
const classFlag = ref<boolean>(true)
const depChange = async () => {
  if (formFlag.value === '学生') {
    console.log(state.searchForm);
    classFlag.value = false
    getClassesList()
    state.searchForm.classid = '请选择'
  } else if (formFlag.value === '可见') {
    let res = await getTeacher({
      depid: state.searchForm.depid
    })
    console.log(res.data);
    studentList.value = res.data.list
  } else if (formFlag.value === '阅卷老师') {
    let res = await getMarkTeachers({
      testid: id.value
    })
    studentList.value = res.data
  }
}

// 获取班级列表
const getClassesList = async () => {
  let res = await classeslist({
    depid: state.searchForm.depid
  })
  state.ClassesList = res.data.list
}

// 班级列表改变事件
const classChange = async () => {
  let res = await reqStudent({
    testid: state.searchForm.classid
  })
  studentList.value = res.data.list
  console.log(res.data.list);
}


// 点击确定
const visibleFn = () => {
  dialogVisible.value = false
  props.valueFn(value)
}

// 左侧数据点击事件
const left = (e: any) => {
  console.log(e);
  value.value = value.value.concat(e)
}
// 右侧数据点击事件
const right = (e: any) => {
  value.value = value.value.filter(item => item === e)
}
// 点击事件  
const id = ref(0)
const studentList = ref([])
const getStudentList = async () => {
  let res = await reqStudent({
    testid: id.value
  })
  studentList.value = res.data.list
}

const value = ref([])
// 控制dialog显示隐藏 
const dialogVisible = ref(false)
// 接受父组件传来的数据

const props = withDefaults(defineProps<{
  visibleTitle?: string,
  valueFn?: Function
}>(), {
  valueFn: () => { },
  visibleTitle: ''
})
// 暴露自己的属性 用于显示隐藏
const formFlag = ref<string>('')
defineExpose({
  dialogVisible,
  id,
  getStudentList,
  getDepartmentList,
  formFlag,
  state,
  value
})
</script>
<style scoped lang="less">
.el-transfer {
  display: flex;
  justify-content: space-between;
}

:deep(.el-transfer-panel) {
  width: 300px;

  .el-transfer-panel__body {
    height: 400px;
  }
}

.dialog-footer button:first-child {
  margin-right: 10px;
}

:deep(.el-transfer__buttons) {
  display: none;
}

.el-form {
  display: flex;
  align-items: center;

  .el-dialog__body {
    padding: 0 210px;
  }
}
</style>
