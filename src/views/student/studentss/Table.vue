<template>
  <div>
    <el-dialog v-model="dialog" title="批量上传学生信息" width="80%">
      <div class="myTable">
        <el-table :data="tableData" style="width: 100%,background-color: #7fffd4;">
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="mobile" label="手机号" />
          <el-table-column prop="classname" label="班级" />
          <el-table-column prop="username" label="账号" />
          <el-table-column prop="remarks" label="备注" />
          <el-table-column label="状态">
            <template #default="scope">
              <el-icon v-if="scope.row.state === null" style="color: rgb(103, 194, 58)">
                <SuccessFilled />
              </el-icon>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="but">
        <span>全部:{{ tableData.length }}</span>
        <span>成功:{{ tableData.length }}</span>
        <span>失败:0</span>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="complete">完成</el-button>
          <el-button type="primary" @click="dialog = false">
            导出数据
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, defineExpose, watch, inject } from 'vue';
import { SuccessFilled } from '@element-plus/icons-vue';
import { studentupdata } from '../../../api/student';
let dialog = ref(false);

const tableData: any = ref([]);


// 完成按钮
const flag = ref<boolean>(false)
const complete = async () => {
  flag.value ? flag.value = false : flag.value
  Promise.all([
    tableData.value.forEach(async (item: any) => {
      let res: any = await studentupdata(item);
    }),
  ]).then(() => {
    dialog.value = false;
    flag.value = true
  });
};

defineExpose({
  dialog,
  tableData,
  flag
});
</script>
<style scoped lang="less">
.myTable {
  overflow-y: scroll;
  max-height: 40vh;
}

.but {
  margin-top: 40px;

  span {
    margin-right: 10px;
  }
}
</style>
