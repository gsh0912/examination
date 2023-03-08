<template>
  <publicDialog
    @onCloseDialog="onClose"
    :dialogVisible="store.showExportDialog"
    :title="'批量导入试题'"
    :width="'40%'"
  >
    <template #content>
      <div>
        <el-steps direction="vertical">
          <el-step>
            <template #description>
              <div class="download">
                下载 <span>试题模板</span>，批量导入试题
              </div>
              <p class="notice">
                注:从其他Excel或Word复制试题时请使用选择性粘贴
                Word:右键一选择性粘贴-文本， Excel:右键一选择性粘贴一只勾选 “值”
              </p>
            </template>
          </el-step>
          <el-step title="上传写好的试题表" />
        </el-steps>
        <el-upload
          v-if="store.showExportDialog == true"
          name="file"
          ref="Aupload"
          class="upload-demo upload"
          :headers="{Authorization:token }"
          action="http://estate.eshareedu.cn/exam/api/test/upload"
          :limit="1"
          :auto-upload="true"
          :on-success="handleSuccess"
        >
        <el-button type="primary">点击上传文件</el-button>
        </el-upload>
      </div>
    </template>
    <template #button>
      <el-button @click="onClose">取消</el-button>
      <el-button type="primary" @click="onExport"> 确定 </el-button>
    </template>
  </publicDialog>
</template>

<script lang="ts" setup>
import publicDialog from '../../common/publicDialog.vue';
import { useMainStore } from '../../../stores/dialog';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
const emit = defineEmits(['onBatch']);
const store: any = useMainStore();
const dataFile = ref([]);
const token = sessionStorage.getItem('token')
console.log(token);

// 关闭弹框触发
const onClose = () => {
  // 关闭弹框
  store.$patch((state: any) => {
    state.showExportDialog = false;
  });
};
// const token = JSON.parse(sessionStorage.getItem("token")!).token;
const handleSuccess = (res: any) => {
  console.log(res);
  if (res.errCode === 10000) dataFile.value = res.data;
};
const onExport = () => {
  if (!dataFile.value.length) return ElMessage.error('请上传有效的文件');
  emit('onBatch', dataFile.value);
  onClose();
};
</script>
<style lang="less" scoped>
.download {
  font-size: 16px;
  span {
    color: rgb(19, 79, 253);
  }
}
.notice {
  font-size: 13px;
  margin: 10px 0;
  color: red;
}
.upload {
  margin: 20px 30px;
}
</style>
