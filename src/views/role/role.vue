<template>
  <header>
    <div class="left">角色管理</div>
    <div class="right">
      <el-button type="primary" @click="addRole">添加角色</el-button>
    </div>
  </header>
  <el-table
    :data="tableData"
    style="width: 100%"
    :header-cell-style="{ 'text-align': 'center' }"
    :cell-style="{ 'text-align': 'center' }"
  >
    <el-table-column prop="name" label="名称" />
    <el-table-column prop="date" label="操作">
      <template #default="scope">
        <div class="operate">
          <span @click="update(scope.row)">编辑</span>
          <span @click="del(scope.row.id)">删除</span>
        </div>
      </template>
    </el-table-column>
  </el-table>
  <div class="paging">
    <el-pagination
      v-model:current-page="currentPage4"
      v-model:page-size="pageSize4"
      :page-sizes="[10, 15, 20, 30]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="counts"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
  <roleDialog
    :dialogFlag="dialogFlag"
    :sonDialog="sonDialog"
    :getRole="getRole"
    :updateRoleName="updateRoleName"
    :updateRole="updateRole"
    :updateAndAdd="updateAndAdd"
  />
</template>

<script setup lang="ts">
import { roleList, menuList, roledel } from '../../api/role';
import { ref, onMounted, reactive } from 'vue';
import roleDialog from './roleDialog.vue';
import { ElMessage, ElMessageBox } from 'element-plus';

// 表格数据
const tableData = ref([]);
onMounted(() => {
  getRole();
});
// 0添加 其他修改
let updateAndAdd = ref(0);

const addRole = () => {
  dialogFlag.value = true;
  updateAndAdd.value = 0;
};
interface Irole {
  page: number;
  psize: number;
}
const myRole: Irole = reactive({
  page: 1,
  psize: 10,
});
let counts = ref(0);
// 获取角色列表
const getRole = async () => {
  let res = await roleList(myRole);
  console.log(res);
  counts.value = res.data.counts;
  tableData.value = res.data.list;
};
const dialogFlag = ref(false);
const updateRole = ref([]);
const updateRoleName = ref('');
// 编辑
const update = async (val: { id: number; name: string }) => {
  let res = await menuList({
    roleid: val.id,
  });
  updateRoleName.value = val.name;
  updateRole.value = res.data.list;
  dialogFlag.value = true;
  updateAndAdd.value = val.id;
};
// 删除
const del = async (id: number) => {
  ElMessageBox.confirm('确认要删除该角色吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      let res: any = await roledel({ id });
      if (res.errCode === 10000) {
        ElMessage({
          type: 'success',
          message: '删除成功',
        });
        getRole();
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消',
      });
    });
};
// 接受dialog组件传来的值
const sonDialog = (val: boolean) => {
  dialogFlag.value = val;
};
//分页
const currentPage4 = ref(1);
const pageSize4 = ref(10);
const small = ref(false);
const background = ref(true);
const disabled = ref(false);
const handleSizeChange = (val: number) => {
  myRole.psize = val;
  getRole();
};
const handleCurrentChange = (val: number) => {
  myRole.page = val;
  getRole();
};
</script>
<style scoped lang="less">
header {
  height: 50px;
  font-size: 20px;
  display: flex;
  justify-content: space-between;
}

.operate {
  span {
    color: #409eff;
    margin: 0 5px;
    cursor: pointer;
  }
}
.paging {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 30px;
}
</style>
