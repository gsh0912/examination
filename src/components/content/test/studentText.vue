<template>
  <publicDialog @onCloseDialog="onClose" :dialogVisible="store.showSkyDialog" :title="title" :width="'45%'">
    <template #content>
      <div class="content">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-row>
            <!-- 下拉框 -->
            <el-col :span="12">
              <el-form-item label="部门">
                <el-select v-model="formInline.depid" @change="getClass">
                  <el-option v-for="(item, index) in departmentList" :key="index" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="title === '学生考试列表'">
              <el-form-item label="班级">
                <el-select v-model="formInline.classid" @change="getStudent">
                  <el-option v-for="(item, index) in classList" :key="index" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-transfer @left-check-change="onLeft" @right-check-change="onRight" :titles="['未选', '全选']" v-model="idValue"
          :data="data" />
      </div>
    </template>
    <template #button>
      <el-button @click="onClose">取消</el-button>
      <el-button type="primary" @click="onStudentAdd"> 确定 </el-button>
    </template>
  </publicDialog>
</template>

<script lang="ts" setup>
import { ref, watch, reactive } from "vue";
import Test from "../../../api/test/test";
import publicDialog from "../../../components/common/publicDialog.vue";
import { ElMessage } from "element-plus";
import { useMainStore } from "../../../stores/dialog";
const store = useMainStore();
// 自定义事件
const emit = defineEmits(["onTransferId"]);
// 穿梭框配置
interface Option {
  key: number;
  label: string;
}
// 添加考试学生需要的参数
const testStudent: any = reactive({
  testid: 0,
  list: [],
});
// 试卷数据
const testData: any = ref({});
//
const data: any = ref<Option[]>([]);
// 穿梭框选中数据
const idValue = ref<Array<number>>([]);
// ------穿梭框
const title = ref("标题");
// 部门列表
const departmentList: any = ref([]);
// 班级
const classList: any = ref([]);
const formInline: any = reactive({
  depid: 0 || "",
  classid: 0 || "",
});
// 父组件传递的数据
const props = defineProps({
  personType: {
    type: String,
    default: "学生或可见或阅卷老师",
  },
  testId: {
    type: Object,
    default: () => { },
  },
  createTest: {
    type: Boolean,
    default: false,
  },
});
// 打开弹框

// 试卷信息
watch(
  () => props.testId,
  (newVal) => {
    console.log(newVal, "试卷信息");
    testData.value = newVal;
  },
  { deep: true }
);
// 打开弹框
watch(
  () => props.personType,
  (newVal) => {
    switch (newVal) {
      case "学生":
        title.value = "学生考试列表";
        break;
      case "可见":
        title.value = "可见老师";
        break;
      case "阅卷老师":
        title.value = "阅卷老师";
        break;
    }
    console.log(title.value);
  },
  { deep: true }
);
// 获取部门列表
const getDepartmentList = async () => {
  const res: any = await Test.reqDepartmentList();
  if (res.errCode === 10000) {
    departmentList.value = res.data.list;
  }
};
getDepartmentList();
// 选择部门获取班级
const getClass = async (depid: number) => {
  if (title.value === "学生考试列表") {
    classList.value = [];
    formInline.classid = "";
    const res: any = await Test.reqClassesList({ depid });
    if (res.errCode === 10000) {
      classList.value = res.data.list;
    }
  } else if (title.value === "可见老师" || title.value === "阅卷老师") {
    const res: any = await Test.reqTeacherList({ depid });
    if (res.errCode === 10000) {
      data.value = res.data.list.map((item: any) => {
        return {
          key: item.id,
          label: item.name,
        };
      });
    }
  }
};
// 获取学生考试列表
const getStudent = async () => {
  console.log(formInline);
  const res: any = await Test.reqStudentList(formInline);
  if (res.errCode === 10000) {
    data.value = res.data.list.map((item: any) => {
      return {
        key: item.id,
        label: item.name,
      };
    });
  }
};
// 穿梭框左侧数据变化
const onLeft = (ids: Array<number>) => {
  // 将选中的数据移到右边
  idValue.value = idValue.value.concat(ids);
};
// 穿梭框右侧数据变化
const onRight = (ids: Array<number>) => {
  // 将从右边选中的数据key从idValue中移除
  idValue.value = idValue.value.filter((item: number) => !ids.includes(item));
};
// 关闭弹框触发
const onClose = () => {
  // 清空数据
  data.value = [];
  idValue.value = [];
  formInline.classid = "";
  formInline.depid = "";
  // 关闭弹框
  store.$patch((state: any) => {
    state.showSkyDialog = false;
  });
};
// 添加学生 可见 阅卷
const onStudentAdd = async () => {
  if (!idValue.value.length) {
    return ElMessage.error("没有选择需要的添加人物");
  }
  // 需要将选中数据通过自定义事件返回
  if (props.createTest) {
    emit("onTransferId", idValue.value, title.value);
    onClose();
  } else {
    // 不需要返回 直接添加
    testStudent.testid = testData.value.id;
    let res: any;
    if (title.value === "学生考试列表") {
      testStudent.list = idValue.value.map((item: number) => {
        return {
          studentid: item,
          testid: testData.value.id,
        };
      });
      res = await Test.reqStudentAdd(testStudent);
    } else {
      testStudent.list = idValue.value.map((item: number) => {
        return {
          id: item,
        };
      });
      if (title.value === "阅卷老师") {
        res = await Test.reqCriticizeTeacher(testStudent);
      } else if (title.value === "可见老师") {
        res = await Test.reqVisibleTeache(testStudent);
      }
    }
    if (res.errCode === 10000) {
      ElMessage.success("添加成功");
      onClose();
    }
  }
};
</script>
<style lang="less" scoped>
.content {
  margin-top: -20px;
}

:deep(.el-transfer-panel__body) {
  height: 50vh;
  overflow: hidden;
}

:deep(.el-transfer-panel) {
  width: 280px;
}

.el-transfer {
  display: flex;
  justify-content: space-around;
}

:deep(.el-transfer__buttons) {
  display: none;
}

:deep(.el-transfer-panel__list) {
  overflow: hidden;
}
</style>
