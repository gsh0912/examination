<template>
  <el-dialog
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    v-model="dialogVisible1"
    :align-center="true"
    :title="title"
    :width="width"
    :style="{ height: dialogHeight }"
    @close="onClose"
  >
    <slot name="content"></slot>
    <template #footer>
      <span class="dialog-footer">
        <slot name="button"></slot>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
const emit = defineEmits(["onCloseDialog"]);
const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false,
  },
  width: {
    type: String,
    default: "40%",
  },
  title: {
    type: String,
    default: "标题",
  },
  dialogHeight: {
    type: String,
    default: "",
  },
});
// 开关
watch(
  () => props.dialogVisible,
  (newVal) => {
    dialogVisible1.value = newVal;
  },
  { deep: true }
);
const dialogVisible1 = ref(false);
// 弹出关闭触发
const onClose = () => {
  emit("onCloseDialog", false);
};
</script>
<style lang="less" scoped></style>
