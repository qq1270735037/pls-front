<template>
  <div>
    <el-input
        style="width: 190px;margin-right: 40px;margin-top: 20px;margin-bottom: 20px;"
        v-model="listQuery.employeeName"
        size="small"
        placeholder="请输入姓名"
        clearable
        class="filter-item"
    />
    <el-button-group style="margin-right: 20px;margin-top: 20px;margin-bottom: 20px;"
                     class="filter-item">
      <el-button
          :loading="searchloading"
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="search"
      >
        搜索
      </el-button>
      <el-button
          size="small"
          type="primary"
          icon="el-icon-refresh"
          @click="refresh"
      >
        刷新
      </el-button>
      <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="insert"
      >
        新增
      </el-button>
    </el-button-group>

    <el-table
        v-loading="listLoading"
        :data="employeeList"
        element-loading-text="正在疯狂加载"
        border
        fit
        height="500px"
        class="table-container"
        highlight-current-row
    >
      <el-table-column
          label="序号"
          width="100"
          align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.index }}
        </template>
      </el-table-column>
      <el-table-column
          label="公司名称"
          width="155"
          align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.companyName }}
        </template>
      </el-table-column>
      <el-table-column
          label="姓名"
          width="100"
          align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.employeeName }}
        </template>
      </el-table-column>
      <el-table-column
          label="性别"
          width="80"
          align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.employeeGender }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="地址"
          width="165"
          align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.employeeAddress }}
        </template>
      </el-table-column>
      <el-table-column
          label="手机号"
          width="160"
          align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.employeeMobile }}
        </template>
      </el-table-column>
      <el-table-column
          label="是否在职"
          width="100"
          align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.employeeStatus }}
        </template>
      </el-table-column>
      <el-table-column
          label="身份证号"
          width="200"
          align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.employeeNumber }}
        </template>
      </el-table-column>
      <el-table-column
          label="操作"
          width="200"
          align="left"
      >
        <template slot-scope="scope">
          <el-button-group>
            <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="edit(scope)"
            >
              修改
            </el-button>
            <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="del(scope)"
            >
              删除
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <pagination
        v-show="listQuery.total > 0"
        :total="listQuery.total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="initEmployeeList"
    />
    <el-dialog
        :visible.sync="dialogVisible"
        :title="dialogType === 'modify' ? '修改' : '新增'"
    >
      <el-form
          ref="dataForm"
          :model="temp"
          label-width="150px"
          label-position="right"
      >
        <el-form-item label="公司编号">
<!--          <el-input v-model="temp.companyId" placeholder="请输入公司编号" />-->
          <el-select v-model="temp.companyId" placeholder="请选择" size="small">
            <el-option
                v-for="item in companyList"
                :key="item.value"
                :label="item.companyId"
                :value="item.companyId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="temp.employeeName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="性别">
<!--          <el-input v-model="temp.employeeGender" placeholder="请输入性别" />-->
          <el-select v-model="temp.employeeGender" placeholder="请选择" size="small">
            <el-option
                v-for="item in gender"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="temp.employeeAddress" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="temp.employeeMobile" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="是否在职">
<!--          <el-input v-model="temp.employeeStatus" placeholder="请输入职务状态" />-->
          <el-radio-group v-model="temp.employeeStatus">
            <el-radio label="在职" value="在职"></el-radio>
            <el-radio label="离职" value ="离职"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="身份证">
          <el-input v-model="temp.employeeNumber" placeholder="请输入身份证号" />
        </el-form-item>
      </el-form>
      <el-button type="danger" @click="dialogVisible = false">
        取消
      </el-button>
      <el-button type="primary" @click="submit">
        确定
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
import { queryByPage,add,update,deleteById} from '@/api/getEmployeeinfo.js';
import { deepClone } from '@/utils/index.js';
import Pagination from '@/components/Pagination'
import { setStorage, getStorage} from "@/utils/localStorage.js";
import {Message} from "element-ui";
import {queryByName} from "@/api/getCompanyinfo";
const _temp = {
  companyId: "",
  employeeAddress: "",
  employeeDate: "",
  employeeGender: "",
  employeeId: "",
  employeeMobile: "",
  employeeName: "",
  employeeNumber: "",
  employeeStatus: "",
}

export default {
  components: {
    Pagination
  },
  data() {
    return {
      gender:[{
        value: '男',
        label: '男'
      }, {
        value: '女',
        label: '女'
      }],
      searchloading:false, //搜索按钮显示加载
      listLoading:true,//查询时加载遮罩
      employeeList:[],       //存储表单内容
      companyList:[],
      listQuery:{       // 查询的数据
        limit: 10,//每页条数
        page: 1,//当前页码
        total: 0,//总条数
        employeeName: "" //查询的人员名称
      },
      temp: Object.assign({}, _temp),
      dialogVisible: false,   //弹出框显示
      dialogType: 'create',
    }
  },

  methods: {
    getCompanyId() {
      queryByName({}).then((res) => {
        if (res != -1) {
          // console.log("这是res\n");
          // console.log(res);
          res.datas.forEach((item, index) => {
            item.index = index + 1;
            //console.log(item)
          })
          this.companyList = res.datas;
        }

      })
    },
    //初始化表格
    initEmployeeList(){
      this.listLoading = true;
      let data = {
        employeeName: this.listQuery.employeeName,
      }
      // console.log("输入的data为：\n")
      // console.log(data)
      queryByPage(data).then((res)=>{
        // console.log("这是res!!")
        // console.log(res)
        if(res != -1){
          //判断查询返回的结果是否有数据
          if(res.datas.length===0){  //查询结果为空
            this.listLoading = false;
            Message({
              message: "查询结果为空",
              type: "error"
            })
          }
          res.datas.forEach((item, index) => {
            //通过页数计算index
            // item.index= (this.listQuery.page-1) * this.listQuery.limit+index+1;
            item.index = index + 1;
          })
          // console.log("hhhhhhhhh")
          // console.log(this.listQuery)
          // console.log(res.datas)
          // console.log("*********")
          this.employeeList = res.datas.slice((this.listQuery.page-1) * this.listQuery.limit,this.listQuery.page * this.listQuery.limit);
          this.listQuery.total = res.total;
          setTimeout(() => {
            this.listLoading = false;
          }, 100)
        }

      })
    },
    //搜索
    search(){
      this.searchloading = true
      this.initEmployeeList()
      setTimeout(() => {
        this.searchloading = false;
      }, 200)
    },
    //刷新
    refresh() {
      this.listQuery.page=1;
      this.initEmployeeList()
    },
    resetTemp() {
      this.temp = Object.assign({}, _temp)
    },
    insert() {
      this.getCompanyId();
      this.resetTemp()
      this.dialogVisible = true
      this.dialogType = 'create'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    edit(scope) {
      this.getCompanyId();
      this.resetTemp()
      this.dialogVisible = true
      this.dialogType = 'modify'
      // console.log("this item is !!:\n")
      // console.log(scope.row)
      this.temp = deepClone(scope.row)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    del(scope) {
      this.$confirm('确认删除该条数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteById({id:scope.row.employeeId}).then(()=>{
          this.initEmployeeList()
          setTimeout(() => {
            this.list.splice(scope.$index, 1)  //从这个位置删除一个元素
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          }, 100)
        })

      })
    },
    submit() {
      if (this.listLoading) {
        return
      }
      this.listLoading = true
      //判断新增还是修改
      if(this.dialogType==="create"){
        // console.log("新增")
        // console.log( this.temp)
        add(this.temp)
      }else  if(this.dialogType==="modify"){
        // console.log("修改")
        // console.log( this.temp)

        update(this.temp);

      }
      setTimeout(() => {
        this.$message({
          message: '成功',
          type: 'success'
        })
        this.dialogVisible = false
        this.listLoading = false
        this.initEmployeeList()
      }, 100)
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.initEmployeeList();
    })
  },

}
</script>

<style>
.w-200{
  width: 200px;
}
.filter-item{
  display: inline-flex;
  vertical-align: middle;
  margin-bottom: 10px;
}
</style>