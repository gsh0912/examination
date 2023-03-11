<template>
  <el-dialog v-model="dialogVisible" title="添加" width="33%">
    <el-form :model="form" ref="ruleFormRef" :rules="rules" label-width="70px">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="电话" prop="mobile">
        <el-input v-model="form.mobile" />
      </el-form-item>
      <el-form-item label="部门" prop="depid">
        <el-select value-key="id" placeholder="请选择部门" v-model="form.depid">
          <el-option
            v-for="item in deparlist.list"
            :label="item.name"
            :value="item.id"
            :key="item.id"
            @click.native="changeGateway(item)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="班级" prop="classid">
        <el-select v-model="form.classid" placeholder="please select your zone">
          <el-option
            v-for="item in deparlist.classlist"
            :label="item.name"
            :key="item.id"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input v-model="form.remarks" type="textarea" />
      </el-form-item>
      <el-form-item label="账号" prop="username">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input v-model="form.pass" type="password" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button  @click="resetForm(ruleFormRef)">取消</el-button>
        <!-- <el-button @click="resetForm(ruleFormRef)">Reset</el-button> -->
        <el-button type="primary" @click="addstudent(ruleFormRef)"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { Ref, ref, defineExpose, reactive, onMounted } from "vue";
import { FormInstance, ElMessage, FormRules } from "element-plus";
import { studentupdata } from "../../../api/student";
import { reqList } from "../../../api/department";
import { classeslist } from "../../../api/classes";
interface users {
  id: number;
  name: string;
  classid: string;
  username: string;
  pass: string;
  mobile: string;
  remarks: string;
  depid: string;
  // delist:Array<AN>
}

const form = reactive<users>({
  id: 0,
  name: "", //姓名
  classid: "请选择部门", //班级
  mobile: "", //手机号
  username: "", //账号
  pass: "", //密码
  remarks: "", //备注
  depid: "请选择部门",
  // delist:[]
});

const deparlist = reactive<any>({
  list: [],
  classlist: [],
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

//
const rules = reactive<FormRules>({
  name: [
    { required: true, message: "请输入姓名", trigger: "blur" },
    { min: 1, max: 8, message: "班级名称为1-8个字符", trigger: "blur" },
  ],
  username: [
    { required: true, message: "请输入账号", trigger: "blur" },
    { min: 1, max: 8, message: "班级名称为1-8个字符", trigger: "blur" },
  ],
  pass: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 1, max: 12, message: "班级名称为1-12个字符", trigger: "blur" },
  ],
});
//

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
          message: "添加失败！",
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
      props.getlist(); //调用父级的列表  刷新
      formEl.resetFields(); //重置表单
    }
  });
};

// 部门列表
const department = async () => {
  let res: any = await reqList();
  deparlist.list = res.data.list;
};
// 部门列表

// 班级
const changeGateway = async (val: any) => {
  // console.log(val.id);
  let res: any = await classeslist({ depid: val.id });
  console.log(res);
  if (res.errCode === 10000) {
    deparlist.classlist = res.data.list;
  }
};

// 重置表单
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  dialogVisible.value = false;
}

// 班级
onMounted(() => {
  department();
});
</script>

<style scoped lang="less">
.dialog-footer {
  margin-left: 390px;
}
</style>
