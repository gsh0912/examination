<template>
  <div class="title">部门管理</div>
  <div class="department">
    <div class="left">
      <el-button type="primary" @click="childFlag = 2">添加一级节点</el-button>
      <el-tree
        :data="treeData"
        :props="defaultProps"
        default-expand-all
        @node-click="handleNodeClick"
      />
    </div>
    <div class="right" v-if="childFlag">
      <!-- 添加一级节点 -->
      <div class="fatherChild" v-if="childFlag === 2">
        <el-form
          ref="fatherRuleFormRef"
          :model="fatherRuleForm"
          :rules="fatherRules"
          class="demo-ruleForm"
          status-icon
        >
          <el-form-item label="节点名称" prop="name">
            <el-input v-model="fatherRuleForm.name" style="width: 300px" />
          </el-form-item>
        </el-form>
        <div class="button">
          <el-button type="primary" @click="addChild">添加一级节点</el-button>
        </div>
      </div>
      <div class="sonChild" v-else="childFlag === 1">
        <div class="my">
          当前节点: <span>{{ nowChild.name }}</span>
        </div>
        <el-form
          ref="sonRuleFormRef"
          :model="sonRuleForm"
          :rules="sonRules"
          class="demo-ruleForm"
          status-icon
        >
          <el-form-item label="节点名称" prop="name">
            <el-input v-model="sonRuleForm.name" style="width: 300px" />
          </el-form-item>
        </el-form>
        <div class="button">
          <el-button type="info" @click="delChild">删除当前节点</el-button>
          <el-button type="success" @click="sonUpdate(1)"
            >修改当前节点</el-button
          >
          <el-button type="primary" @click="sonUpdate(0)">添加子节点</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reqList, addDepartment, delDepartment } from '../../api/department';
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, FormInstance, FormRules, ElMessageBox } from 'element-plus';
// 添加一级节点 / 操作当前节点
const childFlag = ref<number>(0);
const sonRuleFormRef = ref();
const fatherRuleFormRef = ref();
const sonRuleForm = reactive({
  name: '',
});
const sonRules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入节点名称', trigger: 'blur' },
    { min: 3, max: 10, message: '节点名称为3到10个字符', trigger: 'blur' },
  ],
});
const fatherRuleForm = reactive({
  name: '',
});
const fatherRules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入节点名称', trigger: 'blur' },
    { min: 3, max: 10, message: '节点名称为3到10个字符', trigger: 'blur' },
  ],
});

onMounted(() => {
  getList();
});

// 获取部门列表
const getList = async () => {
  let res = await reqList();
  treeData.value = res.data.list;
};
interface Tree {
  name: string;
  children?: Tree[];
}
// 树形菜单展示数据
const treeData = ref<Tree[]>([]);
interface IdefaultProps {
  label: string;
  children?: string;
}
const defaultProps: IdefaultProps = {
  children: 'children',
  label: 'name',
};
// 拿到当前点击部门信息
interface InowChild {
  children?: [];
  id: number;
  leaf: number;
  name: string;
  pid: number;
}
const nowChild = ref<InowChild>({
  children: [],
  id: 0,
  leaf: 0,
  name: '',
  pid: 0,
});
// 点击拿到当前节点信息
const handleNodeClick = (data: InowChild) => {
  nowChild.value = data;
  childFlag.value = 1;
};

// 修改 / 添加 节点
const sonUpdate = (flag: number) => {
  console.log(sonRuleFormRef.value.validate);

  sonRuleFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      let obj: { id: number; pid: number; name: string } = {
        id: 0,
        pid: 0,
        name: '',
      };
      if (flag) {
        obj = {
          id: nowChild.value.id,
          pid: nowChild.value.pid,
          name: sonRuleForm.name,
        };
      } else {
        obj = {
          id: 0,
          pid: nowChild.value.id,
          name: sonRuleForm.name,
        };
      }
      let res: any = await addDepartment(obj);
      if (res.errCode === 10000) {
        if (obj.id) {
          ElMessage.success('修改成功');
        } else {
          ElMessage.success('添加成功');
        }
        sonRuleForm.name = '';
        getList();
      }
    } else {
      ElMessage.error('节点名称有误');
    }
  });
};
// 删除当前节点
const delChild = async () => {
  ElMessageBox.confirm('确定要删除该部门吗', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      let res: any = await delDepartment({
        id: nowChild.value.id,
      });
      if (res.errCode === 10000) {
        ElMessage.success('删除成功');
      }
      getList();
      childFlag.value = 0;
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消',
      });
    });
};
// 添加一级节点
const addChild = () => {
  fatherRuleFormRef.value.validate(async (valid: boolean) => {
    console.log(valid);
    if (valid) {
      console.log('submit!');
      let res: any = await addDepartment({
        id: 0,
        pid: 0,
        name: fatherRuleForm.name,
      });
      console.log(res);
      if (res.errCode === 10000) {
        fatherRuleForm.name = '';
      }
      getList();
    } else {
      ElMessage.error('节点名称有误');
    }
  });
};
</script>
<style scoped lang="less">
.department {
  display: flex;

  .left {
    width: 300px;
    margin-left: 30px;

    .el-tree {
      overflow: auto;
      height: 700px;
    }

    .el-button {
      margin: 20px 10px;
    }
  }

  .right {
    flex: 1;
    padding-left: 30px;

    .sonChild {
      .my {
        margin: 20px 0;
      }

      .button {
        padding-left: 120px;
      }
    }

    .fatherChild {
      .button {
        padding-left: 80px;
      }
    }
  }
}

.title {
  font-size: 20px;
}
</style>
