<template>
  <el-dialog
    @close="onClose"
    v-model="dialogVisible"
    title="题库添加"
    width="44%"
  >
    <el-form
      ref="questionFromRef"
      :model="questionFrom"
      :rules="questionRules"
      label-width="120px"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item label="题库名称：" prop="title">
        <el-input
          style="width: 200px"
          v-model="questionFrom.title"
          placeholder="题库名称"
        />
      </el-form-item>
      <el-form-item label="被他人使用：">
        <el-radio-group v-model="questionFrom.isshow" class="ml-4">
          <el-radio :label="1" size="large">允许所有老师使用</el-radio>
          <el-radio :label="2" size="large">不允许任何老师使用</el-radio>
          <el-radio :label="3" size="large">允许部分老师使用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onAdd"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { useMainStore } from "../../../stores/dialog";
import { ref, watch, reactive } from "vue";
import Test from "../../../api/test/test";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
const emit = defineEmits(["onRefresh", "openDialog"]);
const questionFromRef: any = ref<FormInstance>();
const store:any = useMainStore();
const dialogVisible = ref(false);
const questionFrom = ref({
  id: 0,
  title: "",
  isshow: 1,
  limits: [] as Array<{ id: number }>,
});

const questionRules = reactive<FormRules>({
  title: [{ required: true, message: "请填写题库名称", trigger: "blur" }],
});
watch(
  () => store.questionDialog,
  (newVal) => {
    dialogVisible.value = newVal;
  }
);
watch(
  () => store.visibleTeacher,
  (newVal) => {
    console.log(newVal);
    questionFrom.value.limits = newVal.map((item: any) => {
      return { id: item.id };
    });
  }
);
// 如果过 isshow为三打开可见老师弹框
watch(
  () => questionFrom.value.isshow,
  (newVal) => {
    if (newVal === 3) {
      emit("openDialog", "题库");
    }
  }
);
// 关闭
const onClose = () => {
  questionFrom.value = {
    id: 0,
    title: "",
    isshow: 1,
    limits: [],
  };
  store.$patch((state:any) => {
    state.visibleTeacher = [];
    state.questionDialog = false;
  });
};
// 添加题库
const onAdd = () => {
  questionFromRef.value.validate(async (flag: boolean) => {
    if (flag) {
      const res:any = await Test.reqDatabaseAdd(questionFrom.value);
      if (res.errCode === 10000) {
        ElMessage.success("添加题库成功");
        // 刷新列表
        emit("onRefresh");
        dialogVisible.value = false;
      }
    }
  });
};
</script>
<style lang="less" scoped>
:deep(.el-form-item) {
  display: flex;
  align-items: center;
}
</style>
