<template>
  <div class="box">
    <div class="head">
      <div class="left">师资管理</div>
      <div class="right">
        <el-button>批量添加</el-button>
        <el-button type="primary">添加教学资源</el-button>
      </div>
    </div>
    <!-- 关键词 -->
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="关键词">
        <el-input v-model="formInline.user" placeholder="请输入关键字" />
      </el-form-item>
      <!-- 部门 -->
      <el-form-item label="部门">
        <el-cascader v-model="value" :options="options" @change="handleChange" />
      </el-form-item>
      <!-- 角色 -->
      <el-form-item label="角色">
        <el-select v-model="formInline.region" placeholder="请选择">
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">搜索</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%;background-color: aliceblue;">
      <el-table-column prop="date" label="姓名" />
      <el-table-column prop="name" label="部门" />
      <el-table-column prop="name" label="电话" />
      <el-table-column prop="name" label="角色" />
      <el-table-column prop="address" label="账号" />
      <el-table-column prop="address" label="设置" />
    </el-table>
    <!-- 分页 -->
    <el-pagination v-model:current-page="currentPage4" v-model:page-size="pageSize4" :page-sizes="[100, 200, 300, 400]"
      :small="small" :disabled="disabled" :background="background" layout="total, sizes, prev, pager, next, jumper"
      :total="400" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </div>
</template>

<script setup lang='ts'>
import { reactive, ref } from 'vue'
const value = ref([])

const handleChange = (value: any) => {
  console.log(value)
}

const formInline = reactive({
  user: '',
  region: '',
})

const onSubmit = () => {
  console.log('submit!')
}
// 级联
const options = [
  {
    value: 'guide',
    label: 'Guide',
    children: [
      {
        value: 'disciplines',
        label: 'Disciplines',
        children: [
          {
            value: 'consistency',
            label: 'Consistency',
          },
          {
            value: 'feedback',
            label: 'Feedback',
          },
          {
            value: 'efficiency',
            label: 'Efficiency',
          },
          {
            value: 'controllability',
            label: 'Controllability',
          },
        ],
      },
      {
        value: 'navigation',
        label: 'Navigation',
        children: [
          {
            value: 'side nav',
            label: 'Side Navigation',
          },
          {
            value: 'top nav',
            label: 'Top Navigation',
          },
        ],
      },
    ],
  },
  {
    value: 'component',
    label: 'Component',
    children: [
      {
        value: 'basic',
        label: 'Basic',
        children: [
          {
            value: 'layout',
            label: 'Layout',
          },
          {
            value: 'color',
            label: 'Color',
          },
          {
            value: 'typography',
            label: 'Typography',
          },
          {
            value: 'icon',
            label: 'Icon',
          },
          {
            value: 'button',
            label: 'Button',
          },
        ],
      },
      {
        value: 'navigation',
        label: 'Navigation',
        children: [
          {
            value: 'menu',
            label: 'Menu',
          },
          {
            value: 'tabs',
            label: 'Tabs',
          },
          {
            value: 'breadcrumb',
            label: 'Breadcrumb',
          },
          {
            value: 'dropdown',
            label: 'Dropdown',
          },
          {
            value: 'steps',
            label: 'Steps',
          },
        ],
      }
    ],
  },
  {
    value: 'resource',
    label: 'Resource',
    children: [
      {
        value: 'axure',
        label: 'Axure Components',
      },
      {
        value: 'sketch',
        label: 'Sketch Templates',
      },
      {
        value: 'docs',
        label: 'Design Documentation',
      },
    ],
  },
]
// 表格数据
const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
// 分页
const currentPage4 = ref(4)
const pageSize4 = ref(100)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}
</script>
<style scoped>
.box .head {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
}

.box .head .left {
  font-size: 20px;
}
.el-table{
    margin-bottom: 40px;
  }
  .el-pagination{

  }
</style>