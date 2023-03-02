<template>
  <el-dialog v-model="dialogVisible" title="添加" width="33%">
    <el-form :model="form" ref="ruleFormRef" label-width="50px">
      <el-form-item label="姓名">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="form.mobile" />
      </el-form-item>
      <el-form-item label="部门">
        <el-select v-model="form.depid" placeholder="请选择部门">
          <el-option v-for="item in deparlist.list" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="班级">
        <el-select v-model="form.classid" placeholder="please select your zone">
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remarks" type="textarea" />
      </el-form-item>
      <el-form-item label="账号">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.pass" />
      </el-form-item>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addstudent(ruleFormRef)"> 确定 </el-button>
      </span>
    </el-form>
    <!-- <template #footer>
    
    </template> -->
  </el-dialog>
</template>

<script lang="ts" setup>
import { Ref, ref, defineExpose, reactive, defineProps, onMounted } from "vue";
import { FormInstance, ElMessage } from "element-plus";
import { studentupdata } from "../../../api/student";
import { reqList } from "../../../api/department";
interface users {
  id: number;
  name: string;
  classid: number;
  username: string;
  pass: string;
  mobile: string;
  remarks: string;
  depid: number;
  // delist:Array<AN>
}

const form = reactive<users>({
  id: 0,
  name: "", //姓名
  classid: 1, //班级
  mobile: "", //手机号
  username: "", //账号
  pass: "", //密码
  remarks: "", //备注
  depid: 1,
  // delist:[]
});

const deparlist = reactive<any>({
  list: [],
});

// 接收父组件传来的值
let props: any = defineProps({
  getlist: {
    type: Function,
    required: true,
  },
});

// 子传父
let dialogshow: any = (dialogVisible: Ref<boolean>) => {
  dialogVisible;
};
let dialogVisible: any = ref(false);
defineExpose({
  dialogshow,
  dialogVisible,
});
// 子传父

// 添加学生
const ruleFormRef = ref<FormInstance>();
const addstudent = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      let res: any = await studentupdata({
        id: form.id,
        name: form.name, //姓名
        classid: form.classid, //班级
        mobile: form.mobile, //手机号
        username: form.username, //账号
        pass: form.pass, //密码
        remarks: form.remarks, //备注
        depid: form.depid,
      });
      if (res.errCode !== 10000) {
        ElMessage({
          message: "操作失败！",
          type: "error",
        });
        return false;
      } else {
        ElMessage({
          message: "添加成功！",
          type: "success",
        });
      }
      dialogVisible.value = false;
    }
    props.getlist(); //调用父级的列表  刷新
    formEl.resetFields(); //重置表单
  });
};

// 部门列表
const department = async () => {
  let res: any = await reqList();
  deparlist.list = res.data.list;
  form.depid = res.data.list.depid;
};

// 班级
const getdata = async (val: any) => {
  console.log(val);
  form.depid = val;
};
onMounted(() => {
  department();
  // getdata();
});
</script>

<style scoped lang="less">
.dialog-footer {
  margin-left: 390px;
}
</style>
