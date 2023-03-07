<template>
  <div>
    <el-dialog v-model="dialogVisible" title="批量上传学生信息" width="40%">
      <div class="pass_student">
        <el-steps direction="vertical">
          <el-step />
          <el-step />
        </el-steps>
        <div class="el_box">
          <p class="p_first">下载 <span @click="downloads">学生信息模板</span> 批量导入试题</p>
          <p class="p_text">
            注:从其他Excel或Word复制试题时请使用选择性粘贴 Word:右键一选择性粘贴-文本，
            Excel:右键一选择性粘贴一只勾选 “值”
          </p>
          <p class="p_first">上传填写好的学生信息</p>
          <p>
            <el-upload
              v-model:file-list="fileList"
              class="upload-demo"
              action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
              :on-change="handleChange"
            >
              <el-button type="primary">点击上传文件</el-button>
            </el-upload>
          </p>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogVisible = false"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref, defineExpose } from "vue";
import {
  UploadProps,
  UploadUserFile,
} from "element-plus";
import {downLoad} from "../../../utils/downLoad"


// 子传父
let dialogformshow: any = (dialogVisible: Ref<boolean>) => {
  dialogVisible;
};
let dialogVisible = ref(false);
defineExpose({
  dialogformshow,
  dialogVisible,
});

// 文件上传
const fileList:any = ref<UploadUserFile[]>([
  {
    name: "",
    url: "",
  },
]);

   
const handleChange: UploadProps["onChange"] = (uploadFile, uploadFiles) => {
  fileList.value.name=uploadFile.name
  fileList.value.url=uploadFile.url
};
// 文件导出
const downloads=()=>{
  downLoad("http://estate.eshareedu.cn/exam/upload/question.xlsx")
}
</script>

<style scoped lang="less">
.pass_student {
  display: flex;
  .el-steps {
    width: 5%;
    height: 140px;
  }
  .el_box {
    width: 95%;
    span {
      color: rgb(19, 79, 253);
    }
    p {
      margin-bottom: 26px;
      font-size: 18px;
    }
    .p_first {
      color: #c0c4cc;
    }
    .p_text {
      font-size: 15px;
      color: #f9492d;
    }
    .el-upload {
      margin-bottom: 30px;
    }
  }
}
</style>
