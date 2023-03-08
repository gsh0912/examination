<template>
  <div>
    <el-dialog v-model="dialogVisible" :title="ruleForm.id?'题库修改':'题库添加'" width="50%">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        :size="formSize"
        status-icon
      >
        <el-form-item label="题库名称" prop="title">
          <el-input v-model="ruleForm.title" />
        </el-form-item>
        <el-form-item label="被他人使用">
          <el-radio-group v-model="ruleForm.isshow">
            <el-radio style="width: 100%" :label="1" size="large"
              >允许所有老师使用</el-radio
            >
            <el-radio style="width: 100%" :label="2" size="large"
              >不允许任何老师使用</el-radio
            >
            <el-radio
              style="width: 100%"
              :label="3"
              size="large"
              @click="teachersDialogFn"
              >允许部分老师使用</el-radio
            >
          </el-radio-group>
          <span class="teachersNum" v-if="ruleForm.isshow === 3">{{
            teachersNum
          }}</span>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
  <teachersDialog ref="teachersDialogRef" :valueFn="valueFn" />
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus';
import { reactive, ref, defineExpose, defineProps } from 'vue';
import type { FormRules } from 'element-plus';
import teachersDialog from '../test/visibleDialog/visibleDialog.vue';
import { databaseAdd } from '../../api/databaselist';

const props = defineProps({
  getList: {
    type: Function,
    required: true,
  },
});
const formSize = ref('default');
const ruleFormRef = ref();
const teachersDialogRef = ref();

// 点击部分老师使用 弹出dialog对话框
const teachersDialogFn = () => {
  teachersDialogRef.value.dialogVisible = true;
  teachersDialogRef.value.getDepartmentList();
  teachersDialogRef.value.formFlag = '可见';
};
// 老师数量
const teachersNum = ref<number>(0);
const valueFn = (val: any) => {
  ruleForm.limits = val.value.map((item: number) => {
    return { id: item };
  });
  teachersNum.value = val.value.length;
};
interface IruleForm {
  id: number;
  title: string;
  isshow: number;
  limits?: [];
}
const ruleForm = reactive<IruleForm>({
  id: 0,
  title: '',
  isshow: 1,
  limits: [],
});

const rules = reactive<FormRules>({
  title: [{ required: true, message: '请输入题库名称', trigger: 'blur' }],
});
const submitForm = async () => {
  ruleFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      let res: any = await databaseAdd(ruleForm);
      if (ruleForm.id) {
        ElMessage.success('修改成功');
      } else {
        ElMessage.success('添加成功');
      }
      if (res.errCode === 10000) {
        props.getList();
        dialogVisible.value = false;
      }
    } else {
    }
  });
};

const dialogVisible = ref(false);

defineExpose({
  dialogVisible,
  ruleForm,
});
</script>

<style scoped lang="less">
.el-form-item__content {
  position: relative;

  .teachersNum {
    position: absolute;
    right: 260px;
    bottom: 25px;
    width: 15px;
    height: 15px;
    font-size: 12px;
    background-color: #409eff;
    text-align: center;
    line-height: 15px;
    color: white;
    border-radius: 50%;
  }
}
.el-input {
  width: 380px;
}
</style>
