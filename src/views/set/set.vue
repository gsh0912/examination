<template>
  <div class="pass">
    <el-form
      ref="ruleFormRef"
      :model="pass"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
    >
      <el-form-item label="旧密码" prop="oldpass">
        <el-input type="password" v-model="pass.oldpass" show-password />
      </el-form-item>
      <el-form-item label="新密码" prop="pass">
        <el-input type="password" v-model="pass.pass" show-password />
      </el-form-item>
      <el-form-item label="确认密码" prop="pwd">
        <el-input type="password" v-model="pass.pwd" show-password />
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="submitForm">修改密码</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { studentUpd } from '../../api/set';
interface Ipass {
  oldpass: string;
  pass: string;
  pwd: string;
}
const pass: Ipass = reactive({
  oldpass: '',
  pass: '',
  pwd: '',
});
const rules = reactive<FormRules>({
  oldpass: [{ required: true, message: '原密码必填', trigger: 'blur' }],
  pass: [{ required: true, message: '新密码必填', trigger: 'blur' }],
  pwd: [{ required: true, message: '确认新密码必填', trigger: 'blur' }],
});
const ruleFormRef = ref();
const formSize = ref('default');
// 修改密码
const submitForm = async () => {
  ruleFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      if (pass.pass === pass.pwd) {
        let res: any = await studentUpd(pass);
        console.log(res);
        if (res.errCode === 10000) {
          ElMessage({
            message: '修改成功',
            type: 'success',
          });
          pass.oldpass = '';
          pass.pass = '';
          pass.pwd = '';
        } else {
          ElMessage.error(res.errMsg);
        }
      } else {
        ElMessage.error('两次密码不一致');
      }
    } else {
      console.log('error submit!');
    }
  });
};
// 重置
const reset = () => {
  pass.oldpass = '';
  pass.pass = '';
  pass.pwd = '';
};
</script>
<style scoped>
.pass {
  margin-top: 100px;
  margin-left: 280px;
}
.el-input {
  width: 265px;
}
</style>
