<template>
  <div style="border: 1px solid #ccc">
    <!-- 工具栏 -->
    <Toolbar
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      style="border-bottom: 1px solid #ccc"
    />
    <!-- 编辑器 -->
    <Editor
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      style="height: 200px; overflow-y: hidden"
      @onCreated="handleCreated"
    />
  </div>
</template>
<script setup lang="ts">
import { onBeforeUnmount, ref, shallowRef, watch } from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import debounce from "../../utils/debounces";
// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef();
const props = defineProps({
  refreshValue: {
    type: Object,
    default: () => {},
  },
});
// 内容 HTML
const valueHtml = ref("<p></p>");
const emit = defineEmits(["BoxValue"]);
// 监听输入值变化，发送给父组件
watch(valueHtml, () => {
  sendData();
});
// 根据单选按钮变化清空页面富文本数据
watch(
  () => props.refreshValue,
  (newVal) => {
    if (!Object.keys(newVal).length) return false;
    console.log(newVal);
    valueHtml.value = newVal.value;
  },
  { deep: true, immediate: true }
);
const onSend = () => {
  emit("BoxValue", valueHtml.value);
};
const sendData = debounce(onSend, 400);
// 工具栏配置
const toolbarConfig = {
  toolbarKeys: [
    // 菜单 key
    "bold",
    "italic",
    "underline",
    "through",
    "color",
    "bgColor",
    "bulletedList",
    "numberedList",
    "justifyLeft",
    "justifyCenter",
    "justifyRight",
    "insertTable",
    // 继续配置其他菜单...
    {
      key: "group-image", // 必填，要以 group 开头
      title: "图片", // 必填
      menuKeys: ["uploadImage", "insertImage"],
    },
  ],
};
// 模拟 ajax 异步获取内容
// onMounted(() => {
//   setTimeout(() => {
//     valueHtml.value = "<p>模拟 Ajax 异步设置内容</p>";
//   }, 1500);
// });

// 编辑器配置
const editorConfig = {
  placeholder: "请输入内容...",
  MENU_CONF: {
    /* 菜单配置，下文解释 */
  },
};

const handleCreated = (editor: any) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};

// 组件销毁时，及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});
</script>

<!-- 别忘了引入样式 -->
<style src="@wangeditor/editor/dist/css/style.css"></style>
