<template>
  <div>
    <div class="title">
      <span>考试列表</span>
      <div class="search">
        <el-form :model="myData">
          <el-form-item label="关键字">
            <el-input v-model="myData.key" placeholder="考试名称" />
          </el-form-item>
          <el-form-item label="状态" style="width: 150px; margin-left: 10px">
            <el-select
              @change="select"
              v-model="myData.result"
              placeholder="所有"
            >
              <el-option label="所有" value="" />
              <el-option label="未考试" value="未考试" />
              <el-option label="待阅卷" value="待阅卷" />
              <el-option label="已通过" value="已通过" />
              <el-option label="未通过" value="未通过" />
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="search" style="margin-left: 20px"
            >查询</el-button
          >
        </el-form>
      </div>
    </div>
    <div class="stutest">
      <div
        class="exam"
        @click="examine(item)"
        v-for="item in list"
        :key="item.id"
      >
        <div class="data_top">
          <img
            v-if="item.result === '未考试'"
            src="../../assets/images/stutest/notAttend.jpg"
          />
          <img
            v-if="item.result === '已通过'"
            src="../../assets/images/stutest/alreadyPassed.jpg"
          />
          <img
            v-if="item.result === '待阅卷'"
            src="../../assets/images/stutest/awaitExam.jpg"
          />
          <img
            v-if="item.result === '未通过'"
            src="../../assets/images/stutest/notPass.jpg"
          />
          <span>{{ item.title }}</span>
        </div>
        <div class="bottom_data">
          <span v-if="item.begintime && item.endtime"
            >{{
              item.begintime.substring(0, item.begintime.indexOf('.') - 3)
            }}至{{
              item.endtime.substring(0, item.begintime.indexOf('.') - 3)
            }}</span
          >
          <span v-else>不限</span>
          <span style="margin-right: 10px"> {{ item.aorder }}人通过 </span>
        </div>
      </div>
    </div>
    <!-- 分页 -->
    <div class="page">
      <el-pagination
        v-model:current-page="currentPage4"
        v-model:page-size="pageSize4"
        :page-sizes="[6, 9, 12, 15]"
        :small="small"
        :disabled="disabled"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="counts"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { stutesList } from '../../api/stutest';
import { useRouter } from 'vue-router';
// 路由
let router = useRouter();
// 分页数据
const currentPage4 = ref(1);
let counts = ref(0);
const pageSize4 = ref(12);
const small = ref(false);
const background = ref(true);
const disabled = ref(false);
// 列表
let list = ref<any>([]);
interface Idata {
  page: number;
  psize: number;
  key: string;
  admin: string;
  ismy: number;
  opentime: number;
  begindate: string;
  enddate: string;
  state: number;
  isread: number;
  result: string;
}
const myData: Idata = reactive({
  page: 1,
  psize: 12,
  key: '',
  admin: '',
  ismy: 0,
  opentime: 0,
  begindate: '',
  enddate: '',
  state: 0,
  isread: 0,
  result: '',
});
const myList = async () => {
  let res = await stutesList(myData);
  console.log(res);
  list.value = res.data.list;
  console.log(list.value);
  counts.value = res.data.counts;
};
myList();
// 分页
const handleSizeChange = (val: number) => {
  myData.psize = val;
  myList();

  console.log(val);
};
const handleCurrentChange = (val: number) => {
  myData.page = val;
  myList();
  console.log(`current page: ${val}`);
};
// 搜索
const search = () => {
  myList();
};
//下拉框搜索
const select = () => {
  myList();
};
//跳转考试页面
const examine = (data: any) => {
  console.log(data);
  if (data.result === '未考试') {
    router.push({ path: '/examprepare', query: { id: data.id } });
  } else {
    router.push({ path: '/examresults', query: { id: data.id } });
  }
};
</script>
<style scoped lang="less">
.title {
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 18px;
}
.search {
  .el-form {
    display: flex;
  }
}
.stutest {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  .exam {
    width: 520px;
    height: 120px;
    margin-top: 10px;
    margin-left: 8px;

    border: 1px solid rgb(235, 235, 2351);
    border-radius: 8px;
    .data_top {
      display: flex;
      img {
        width: 130px;
        height: 75px;
        margin-top: 10px;
        margin-left: 10px;
      }
      span {
        display: block;
        margin-top: 20px;
        margin-left: 10px;
      }
    }
    .bottom_data {
      margin-top: 10px;
      font-size: 12px;
      margin-left: 10px;
      color: rgb(170, 171, 181);
      display: flex;
      justify-content: space-between;
    }
  }
}
.page {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
