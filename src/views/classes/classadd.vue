<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="Tips"
      width="30%"
      :before-close="handleClose"
    >
      <!-- <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        status-icon
      >
        <el-form-item label="班级名称" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="部门" prop="depid">
          <cascader
            v-model="ruleForm.depid"
            :options="options"
            :cascaderProps="cascaderProps"
            :cascaderChange="cascaderChangeClass"
          />
        </el-form-item>
      </el-form> -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="dialogVisible = false"> Confirm </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import {ref} from 'vue'

const dialogVisible = ref(false);
const handleClose = (done: () => void) => {

};
</script>
<style>
</style>