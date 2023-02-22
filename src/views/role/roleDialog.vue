<template>
  <div>
    <el-dialog v-model="dialogVisible" title="修改" width="40%" @close="beforeClose">
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" status-icon>
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="ruleForm.name" style="width: 250px;" />
        </el-form-item>
        <div class="checkbox">
          <p>权限</p>
          <div class="checkboxs" v-for="item in roleData.roleJurisdiction">
            <el-checkbox :label="item.id" v-model="item.checked" @change="checkboxAll($event, item)">
              {{ item.name }}
            </el-checkbox>
            <el-checkbox-group v-model="checkList" @change="checkboxOne($event, item)">
              <el-checkbox :label="item1.id" v-for="item1 in item.sub">
                {{ item1.name }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">

          <el-button @click="beforeClose">取消</el-button>
          <el-button type="primary" @click="roleUpdate">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">

import type { FormInstance, FormRules } from 'element-plus'
import { roleAdd } from '../../api/role'
import { getData } from '../../utils/Infinitus'
import { ElMessage } from 'element-plus'
import { ref, reactive, defineProps, watch } from 'vue'

const dialogVisible = ref(false)
// 关闭dialog弹出框时清空表单内容
const beforeClose = () => {
  props.sonDialog(false)
  checkList.value = []
  // 清空表单内容
  roleData.roleJurisdiction.forEach(item => {
    checkboxAll(false, item)
  })
  ruleForm.name = ''
}

const props = withDefaults(defineProps<{
  dialogFlag: boolean
  updateRoleName: string
  updateAndAdd: number
  updateRole: Array<any>
  sonDialog: Function
  getRole: Function
}>(), {
  sonDialog: () => { }
})
// 监听dialog显示或隐藏
watch(() => props.dialogFlag, (newVal) => {
  dialogVisible.value = newVal
})
// 监听是修改还是添加 id为0则添加
watch(() => props.updateAndAdd, (newVal) => {
  ruleForm.id = newVal
})
// 监听角色相对应的权限
watch(() => props.updateRole, (newVal) => {
  let arr: number[] = []
  newVal.forEach(item => {
    item.children.forEach((item1: { checked: boolean; id: number }) => item1.checked ? arr.push(item1.id) : 0)
    checkboxOne(arr, item)
  });
  checkList.value = arr
  ruleForm.name = props.updateRoleName
})
// 点击确定 判断修改还是添加
const roleUpdate = async () => {
  if(!ruleForm.name) return ElMessage.error('角色名称不能为空')
  
  if(!checkList.value.length) return ElMessage.error('请给角色分配权限')
  
  let menus = checkList.value.map((item: any) => {
    return { id: item }
  })
  const res: any = await roleAdd({
    id: ruleForm.id,
    name: ruleForm.name,
    menus
  })
  props.getRole()
  props.sonDialog(false)
  if (ruleForm.id) {
    ElMessage.success('修改成功')
  } else {
    ElMessage.success('添加成功')

  }
}
// 按钮组
const checkList: any = ref([])
// 处理角色权限
const jurisdiction = JSON.parse(sessionStorage.getItem('menus')!)
const roleData = reactive({
  roleJurisdiction: getData(0, jurisdiction)
})
// 全选按钮
const checkboxAll = (bool: any, data: { sub: any[]; checked: any }) => {
  const arr = data.sub.map((item: { id: number }) => item.id)
  data.checked = bool

  if (bool) {
    checkList.value = checkList.value.concat(arr as [])
  } else {
    checkList.value = checkList.value.filter((item: number) => !arr.includes(item))
  }
}
// 多个复选框
const checkboxOne = (arr: string | any[], data: { children: any[]; checked: boolean | number }) => {
  roleData.roleJurisdiction.forEach(item => {
    const arr1 = item.sub.filter((item: { id: string }) => arr.includes(item.id))
    if (arr1.length === item.sub.length) {
      item.checked = true
    } else {
      item.checked = false
    }
  })

}
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  id: 0,
  name: ''
})
// 表单校验
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '角色名称不能为空', trigger: 'blur' }
  ]
})


</script>

<style scoped>
.checkbox {
  margin-left: 50px;
  overflow: auto;
  height: 400px;
}

.el-checkbox-group {
  margin-left: 50px;
}

.el-checkbox:nth-child(1) {
  margin-left: 30px;
}
</style>