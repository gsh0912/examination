<template>
  <div class="students">
    <div class="student">
      <div class="heade">
        <div style="font-size: 20px; font-weight: 400">师资管理</div>
        <div class="header_box">
          <!-- 批量添加 -->
          <el-upload class="upload-demo" action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" multiple
            :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" :limit="3"
            :on-exceed="handleExceed">
            <el-button style="margin-right: 15px" plain>批量添加</el-button>
            <template #tip>
              <div class="el-upload__tip"></div>
            </template>
          </el-upload>
          <el-button type="primary" @click="onShow" style="float: right">添加教资</el-button>
        </div>
      </div>
      <!-- 添加教资 -->
      <el-form ref="ruleFormRefAdd" :model="addteacher" :rules="rules" class="demo-ruleForm" label-width="110px"
        status-icon>
        <el-form-item class="add">
          <el-dialog v-model="dialogFormVisible" width="33%" :title="title + '老师'" v-if="dialogFormVisible === true">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="addteacher.name" style="width: 400px" />
            </el-form-item>
            <el-form-item label="电话" prop="tel">
              <el-input max="11" v-model="addteacher.tel" style="width: 400px; margin-top: 20px" />
            </el-form-item>
            <el-form-item label="部门" style="margin-top: 15px">
              <el-cascader :options="tertiary.arr" v-model="addteacher.depid" :props="props1" @change="selectCasc"
                clearable />
            </el-form-item>
            <el-form-item label="角色" style="margin-top: 15px">
              <el-select v-model="addteacher.roleid" clearable placeholder="请选择">
                <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="账号" v-if="isshow" prop="username" style="margin-top: 15px">
              <el-input v-model="addteacher.username" style="width: 400px" />
            </el-form-item>
            <el-form-item label="密码" prop="pass" v-if="isshow" style="margin-top: 15px">
              <el-input v-model="addteacher.pass" type="password" placeholder="" style="width: 400px" />
            </el-form-item>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="close">取消</el-button>
                <el-button type="primary" @click="adds(ruleFormRefAdd)">确定</el-button>
              </span>
            </template>
          </el-dialog>
          <!-- 添加教资 -->
        </el-form-item>
      </el-form>
    </div>
    <!-- 搜索框 -->
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="60px" class="demo-ruleForm searchs"
      status-icon>
      <el-form-item label="关键字">
        <el-input
          placeholder="请输入关键字"
          v-model="ruleForm.key"
          @change="clearableKey"
          clearable
          @keyup.enter="keys"
        />
      </el-form-item>
      <el-form-item label="部门">
        <div class="example-block">
          <span class="example-demonstration"></span>
          <el-cascader :options="tertiary.arr" :props="props1"  clearable @change="selectCascs" />
        </div>
      </el-form-item>
      <el-form-item label="角色" prop="region">
        <el-select v-model="roless" placeholder="请选择">
          <el-option v-for="item in options" :key="item.id" clearable :label="item.name" :value="item.name" />
        </el-select>
      </el-form-item>
      <!-- <el-form-item> -->
      <el-button type="primary" @click="keys" class="btn_teacher">搜索</el-button>
      <!-- </el-form-item> -->
    </el-form>
    <!-- 表格 -->
    <el-table v-loading="loading" :data="tableData.arr" style="width: 100%" :header-cell-style="{ background: '#f8f8f8' }"
      :row-style="{ height: '50px' }">
      <el-table-column fixed prop="name" label="姓名" />
      <el-table-column prop="depname" label="部门"  />
      <el-table-column prop="tel" label="电话"  />
      <el-table-column prop="rolename" label="角色"  />
      <el-table-column prop="username" label="账号"  />
      <el-table-column fixed="right" label="操作"  align="center"  >
        <template #default="scope">
          <el-button link type="primary" size="small" @click="rest(scope.row)">重置密码</el-button>

          <el-button link type="primary" size="small" @click="revamp(scope.row)">修改</el-button>
          <el-button link type="primary" size="small" @click="delet(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="demo-pagination-block">
      <el-pagination v-model:currentPage="currentPage4" v-model:page-size="pageSize4" background
        :page-sizes="[10, 20, 30, 40]" :small="small" :disabled="disabled"
        layout="total, sizes, prev, pager, next, jumper" :total="ruleForm.counts" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" class="paging" />
    </div>
    <!-- 重置密码 -->
    <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="120px" class="demo-ruleForm"
      :hide-required-asterisk="false">
      <el-dialog v-model="addteacher.centerDialogVisible" title="重置密码" width="30%">
        <span style="margin-left: 80px">
          <el-form-item label="姓名" prop="name">
            {{ ruleForm.name }}
          </el-form-item>
          <el-form-item label="密码" style="margin-top: 20px" prop="pass">
            <el-input v-model="ruleForm.pass" type="password" autocomplete="off" />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPass">
            <el-input v-model="ruleForm.confirmPass" type="password" autocomplete="off" />
          </el-form-item>
        </span>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="cancel">取消</el-button>
            <el-button type="primary" @click="open2">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
// 调用接口 先引入
import { teacherList, deleteList, addList, classesdepartment } from "../../api/teacher";
import { roleList } from "../../api/role";
import { ref, reactive, toRefs } from "vue";
import type { FormInstance, FormRules, UploadProps, UploadUserFile } from "element-plus";
import { ElMessage, ElMessageBox } from "element-plus";
const input = ref("");
const isshow = ref(false);
const dialogFormVisible = ref(false);
const formLabelWidth = '140px';
const ruleFormRefAdd = ref();
const currentPage4 = ref(1);
const pageSize4 = ref(10);
const small = ref(false);
const disabled = ref(false);
const centerDialogVisible = ref(false);
const title = ref();
const loading = ref(true);
const tertiary = reactive({
  arr: [],
});
// 三级联动
const props1 = {
  label: 'name',
  children: 'children',
  value: 'id',
  checkStrictly: true,
};
const roless = ref('');

const addteacher = reactive({
  id: 0,
  username: '',
  pwd: '',
  name: '',
  tel: '',
  depid: 0,
  roleid: '请选择账号',
  depids: '',
  checkPass: '',
  pass: '',
  confirmPass: '',
  oldpass: '',
  centerDialogVisible: false,
});

const ruleForm = reactive<any>({
  psize: 10,
  page: 1,
  counts: 0,
  depid: 0,
  key: '',
  pass: '',
  checkPass: '',
  username: '',
  name: '',
  confirmPass: '',
});


const data = reactive<any>({
  options: [],
});
const { options } = toRefs(data);

const selectCasc = (val: any) => {
  if (val.length > 0) addteacher.depid = val[val.length - 1];
};
const selectCascs = (val: any) => {
  if (val.length > 0) addteacher.depids = val[val.length - 1];
};
const ruleFormRef = ref();

const tableData = reactive({
  arr: [],
});
// 调用列表接口
const list = async () => {
  let param = {
    page: ruleForm.page,
    psize: ruleForm.psize,
    depid: addteacher.depids,
    key: ruleForm.key,
  };
  let res = await teacherList(param);
  console.log(res);
  tableData.arr = res.data.list;
  ruleForm.counts = res.data.counts;
  loading.value = false;
};
list();

// 删除弹框
const delet = (id: any) => {
  ElMessageBox.confirm('确定要删除该账号吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      ElMessage({
        type: 'success',
        message: '删除成功',
      });
      let res = await deleteList({ id: id });
      console.log(res);
      list();
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消删除',
      });
    });
};
// 分页
const handleSizeChange = (val: number) => {
  ruleForm.psize = val;
  list();
};
const handleCurrentChange = (val: number) => {
  ruleForm.page = val;
  list();
};
// 查询
const keys = () => {
  list();
};
//添加     formEl.validate is not a function
const adds = async (formEl: FormInstance | undefined) => {
  console.log(formEl);
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      let res = await addList(addteacher);
      console.log(res);
      dialogFormVisible.value = false;
      addteacher.name = '';
      addteacher.tel = '';
      addteacher.roleid = '';
      addteacher.username = '';
      addteacher.pass = '';
      addteacher.depid = 0;

      list();
      if (addteacher.id == 0) {
        ElMessage({
          showClose: true,
          message: '添加成功',
          type: 'success',
        });
      } else {
        ElMessage({
          showClose: true,
          message: '修改成功',
          type: 'success',
        });
      }
    }
  });
};
// 修改
const revamp = async (val: any) => {
  title.value = '修改';
  addteacher.id = val.id;
  addteacher.username = val.username;
  addteacher.name = val.name;
  addteacher.tel = val.tel;
  addteacher.roleid = val.roleid;
  addteacher.pass = val.pass;
  addteacher.depid = val.depid;

  // console.log(val.pwd);
  dialogFormVisible.value = true;
  isshow.value = false;

  list();
};
// 三级联动
const lists = async () => {
  let res = await classesdepartment({});
  console.log(res);
  tertiary.arr = res.data.list;
};
lists();
// 角色列表
const roles = async () => {
  let res: any = await roleList({});
  console.log(res);
  if (res.errCode == 10000) {
    options.value = res.data.list;
  }
};
roles();
//添加按钮
const onShow = () => {
  dialogFormVisible.value = true;
  isshow.value = true;
  title.value = '添加';
};
//取消按钮
const close = () => {
  dialogFormVisible.value = false;
  // ruleFormRefAdd.value.resetFields()
  addteacher.name = '';
  addteacher.tel = '';
  addteacher.username = '';
  addteacher.pass = '';
  addteacher.depid = 0;
  addteacher.roleid = '';
};

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'));
  } else if (value.toString().length < 6 || value.toString().length > 18) {
    callback(new Error('密码长度为6-18位'));
  } else {
    callback();
  }
};
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'));
  } else if (value !== ruleForm.pass) {
    callback(new Error('输入密码两次不一致'));
  } else {
    callback();
  }
};
// 添加布局验证
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  tel: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  // pwd:[{required:true,message:'请输入密码',trigger:'blur'}],
  pass: [{ validator: validatePass, trigger: 'blur' }],
  confirmPass: [{ validator: validatePass2, trigger: 'blur' }],
});
//点击重置密码
const rest = (data: any) => {
  addteacher.centerDialogVisible = true;
  console.log(data)
  ruleForm.username = data.username;
  ruleForm.id = data.id;
  ruleForm.name = data.name;
  // // ruleForm.pass = data.pass
  ruleForm.checkPass = data.checkPass;
  ruleForm.confirmPass = data.confirmPass;
  ruleForm.oldpass = data.oldpass;

  ruleForm.depid = data.depid;
  ruleForm.tel = data.tel;
  ruleForm.roleid = data.roleid;
  ruleForm.pass='';
  ruleForm.qq='';
  ruleForm.searchDepa=[]
};
// 点击确定修改按钮
const open2 = async () => {
  ruleFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      console.log('submit!');
      let arr = {
        id: ruleForm.id,
        username: ruleForm.username,
        // pass: ruleForm.pass,
        checkPass: ruleForm.checkPass,
        name: ruleForm.name,
        confirmPass:ruleForm.confirmPass,
        oldpass: ruleForm.confirmPass,
        roleid: ruleForm.roleid,
        depid: ruleForm.depid,
        tel: ruleForm.tel,
        pass:ruleForm.pass,
        qq:'',
        searchDepa:[],
      };
      console.log(1111111, arr.id);
      // 调用列表
      let res: any = await addList(arr);
      console.log(res);
      if (res.errCode === 10000) {
        addteacher.centerDialogVisible = false;
        ElMessage({
          type: 'success',
          message: '重置成功',
        });
        list();
      }
    } else {
      console.log('error submit!');
    }
  });
};

const cancel = () => {
  addteacher.centerDialogVisible = false;
  (ruleForm.pass = ''), (ruleForm.confirmPass = '');
};

const amend = () => { };
// 批量上传
const fileList = ref<UploadUserFile[]>([
  {
    name: 'element-plus-logo.svg',
    url: 'https://element-plus.org/images/element-plus-logo.svg',
  },
  {
    name: 'element-plus-logo2.svg',
    url: 'https://element-plus.org/images/element-plus-logo.svg',
  },
]);

const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
  console.log(file, uploadFiles);
};

const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
  console.log(uploadFile);
};

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(
    `The limit is 3, you selected ${files.length} files this time, add up to ${files.length + uploadFiles.length
    } totally`
  );
};

const beforeRemove: UploadProps['beforeRemove'] = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(
    `Cancel the transfert of ${uploadFile.name} ?`
  ).then(
    () => true,
    () => false
  );
};
const clearableKey = () => {
  if (!ruleForm.key) {
    list();
  }
};
</script>
<style scoped lang="less">
@import url('./teacher.less');
</style>
