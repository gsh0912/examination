<template>
  <div style="border: 1px solid #ccc">
    <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" />
    <Editor style="height: 150px; overflow-y: hidden;" v-model="valueHtml" :defaultConfig="editorConfig"
      @onCreated="handleCreated" />
  </div>
</template>

<script lang="ts" setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { onBeforeUnmount, ref, shallowRef, onMounted,defineExpose } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()
// 内容 HTML
const valueHtml = ref('123')
const toolbarConfig = {}
const editorConfig = { placeholder: '' }
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
const handleCreated = (editor: any) => {
  console.log(editor.children);
  editorRef.value = editor // 记录 editor 实例，重要！
}
defineExpose({
  valueHtml
})
</script>   

<style src="@wangeditor/editor/dist/css/style.css"></style>