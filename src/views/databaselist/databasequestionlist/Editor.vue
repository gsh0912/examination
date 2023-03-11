<template>
  <div style="border: 1px solid #ccc">
    <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" />
    <Editor style="height: 150px; overflow-y: hidden;" v-model="valueHtml" :defaultConfig="editorConfig"
      @onCreated="handleCreated" />
  </div>
</template>

<script lang="ts" setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { onBeforeUnmount, ref, shallowRef, onMounted, defineExpose } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()
// 内容 HTML
const valueHtml = ref('')
const toolbarConfig = {}
const editorConfig = {
  placeholder: "请输入内容...",
  MENU_CONF: {
    /* 菜单配置，下文解释 */
    uploadImage: {
      //上传图片配置
      server: 'http://www.eshareedu.cn/exam/api/upload/editeradd', //上传接口地址
      fieldName: 'file', //上传文件名
      methods: 'post',
      baseUrl: 'http://www.eshareedu.cn/exam/upload/',
      headers: {
        Authorization: sessionStorage.getItem('token')
      },
      metaWithUrl: true, // 参数拼接到 url 上
      // 单个文件上传成功之后
      onSuccess(file: any, res: any) {
        console.log(`${file.name} 上传成功`, res);
      },
      // 自定义插入图片
      customInsert(res: any, insertFn: any) {
        console.log(res);
        console.log(insertFn);
        console.log(res.data[0].url);
        insertFn('http://www.eshareedu.cn/exam/upload/' + res.data[0].url.substring(4, res.data[0].url.length));
      },
    },
  },
};
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