<template>
  <el-dialog v-model="dialogVisible" title="添加" width="35%">
    <el-form
      ref="ruleFormRef"
      :model="form"
      :rules="rules"
      label-width="90px"

    >
      <el-form-item label="班级" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="部门" prop="depid">
        <el-cascader :options="tertiary.arr" v-model="form.depid" :props="props1" @change="selectCasc"
         clearable />
      </el-form-item>
    </el-form>
    <template #footer>
        <span class="dialog-footer">
          <el-button  @click="resetForm(ruleFormRef)" class="text">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)"> 确定 </el-button>
        </span>
      </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { Ref, ref, defineExpose, reactive, defineProps, onMounted ,toRefs} from "vue";
import { FormInstance, ElMessage, FormRules } from "element-plus";
import { classesdepartment, addClasses } from "../../api/classes";
// import cascader from "../../components/common/cascader.vue";
interface users {
  id: number;
  name: string;
  depid: number;
}

const form = reactive<users>({
  id: 0,
  name: "",
  depid: 1,
});

// 添加
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  name: [{ required: true, message: "请输入班级名称", trigger: "blur" }]
});
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      let res:any = await addClasses(form);
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

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  dialogVisible.value = false;
}
// 添加

// 部门
const tertiary = reactive({
  arr: [],
});
const props1 = {
  label: "name",
  children: "children",
  value: "id",
  checkStrictly: true,
};
const data = reactive<any>({
  options: [],
});

const selectCasc = (val: any) => {
  if (val.length > 0) form.depid = val[val.length - 1];
};
const { options } = toRefs(data);
const lists = async () => {
  let res = await classesdepartment({});
  tertiary.arr = res.data.list;
};

onMounted(() => {
  lists();
});
// // 接收父组件传来的值
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
</script>

<style scoped lang="less">
.text{
  margin-left: 340px;
}

</style>
