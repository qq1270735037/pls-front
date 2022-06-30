<template>
  <div>
    <el-input
        style="width: 190px;margin-right: 40px;margin-top: 20px;margin-bottom: 20px;"
        v-model="inputData"
        size="small"
        placeholder="请输入标题"
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
        :data="communicationInfo.slice((cur_page-1)*pageSize,cur_page*pageSize)"
        element-loading-text="正在疯狂加载"
        border
        fit
        height="500px"
        class="table-container"
        highlight-current-row
    >
      <el-table-column
          fixed
          label="序号"
          width="100"
          align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.communicationId }}
        </template>
      </el-table-column>

      <el-table-column
          label="信息标题"
          width="170"
          align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.communicationTitle }}
        </template>
      </el-table-column>

      <el-table-column
          label="信息内容"
          width="300	"
          align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.communicationContext }}
        </template>
      </el-table-column>

      <el-table-column
          label="信息发布时间"
          width="200"
          align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.communicationTime }}</span>
        </template>
      </el-table-column>

      <el-table-column
          label="信息发布者"
          width="170	"
          align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.employeeName }}
        </template>
      </el-table-column>

      <el-table-column
          fixed="right"
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
    <div style="margin-top:20px" class="pagination">
      <el-pagination background @current-change="handleCurrentChange" @size-change="handleSizeChange"
                     :current-page="cur_page" :page-sizes="[10,15,20,50]" :page-size="pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
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

<!--        <el-form-item label="信息编号">-->
<!--          <el-input v-model="temp.communicationId" placeholder="请输入信息编号" />-->
<!--        </el-form-item>-->
        <el-form-item label="信息标题">
          <el-input v-model="temp.communicationTitle" placeholder="请输入信息标题" />
        </el-form-item>
        <el-form-item label="信息内容">
          <el-input v-model="temp.communicationContext" placeholder="请输入信息内容" />
        </el-form-item>
        <el-form-item label="发布者编号">
          <el-input v-model="temp.employeeId" placeholder="请输入发布者编号" />
        </el-form-item>
        <el-form-item label="发布时间">
          <!-- <el-input v-model="temp.companyTime" placeholder="请输入时间(yyyy-MM-dd)" /> -->
          <el-date-picker
              v-model="temp.communicationTime"
              type="datetime"
              placeholder="选择日期时间">
          </el-date-picker>
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

import {queryByCondition,add,update,deleteById} from "@/api/getCommunication";
import { deepClone } from '@/utils/index.js';
import {Message} from "element-ui";

const _temp = {
  // id: '',
  communicationId: '',
  communicationContext: '',
  communicationTime: '',
  communicationTitle: '',
  employeeId: '',
}
export default {
  name: 'question',
  data() {
    return {
      searchloading:false, //搜索按钮显示加载
      communicationInfo: [],
      listLoading:true,//查询时加载遮罩
      inputData:"",//输入的条件
      temp: Object.assign({}, _temp),
      dialogVisible: false,   //弹出框显示
      dialogType: 'create',
      cur_page: 1,
      pageSize: 10,
      //数据条数
      total: 0,

    }
  },
  methods: {



    initcommunicationList() {
      this.listLoading = true;
      let data = {
        communicationTitle: this.inputData,

      }
      queryByCondition(data).then((res) => {
        if (res != -1) {
          //判断查询返回的结果是否有数据
          if (res.datas.length === 0) {  //查询结果为空

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
          this.communicationInfo = res.datas;
          this.total = this.communicationInfo.length;
          this.listLoading = false;
          //console.log(this.communicationInfo)
          setTimeout(() => {
            this.listLoading = false;
          }, 100)
        }

      })
    },



    //搜索
    search(){
      this.searchloading = true
      this.initcommunicationList()
      setTimeout(() => {
        this.searchloading = false;
      }, 1500)
    },
    //刷新
    refresh() {

      this.initcommunicationList()
    },
    resetTemp() {
      this.temp = Object.assign({}, _temp)
    },
    insert() {
      this.resetTemp()
      this.dialogVisible = true
      this.dialogType = 'create'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    edit(scope) {
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
        let data = scope;
        data.communicationTime = Date.parse(new Date(this.temp.communicationTime));
        console.log(data.row.communicationId)
        deleteById({id:data.row.communicationId}).then(()=>{
          this.initcommunicationList()
          setTimeout(() => {
            //this.list.splice(scope.$index, 1)  //从这个位置删除一个元素
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          }, 300)
        })

      })
    },
    submit() {
      if (this.listLoading) {
        return
      }
      this.listLoading = true
      //判断新增还是修改
      let data = this.temp
      data.communicationTime = Date.parse(new Date(this.temp.communicationTime))
      if(this.dialogType==="create"){
        // console.log("新增")
        // console.log( this.temp)
        add(data)
        this.initcommunicationList()
      }else  if(this.dialogType==="modify"){
        // console.log("修改")
        // console.log( this.temp)
        update(data)

        this.initcommunicationList()
      }
      setTimeout(() => {
        this.$message({
          message: '成功',
          type: 'success'
        })
        this.dialogVisible = false
        this.listLoading = false
      }, 100)
    },
    // 分页导航改变页码大小在method里定义
    handleSizeChange(val) {
      this.pageSize = val;
      this.cur_page = 1;
    },
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initcommunicationList();
    })
  },
}
</script>

<style >

.w-200{
  width: 200px;
}
.filter-item{
  display: inline-flex;
  vertical-align: middle;
  margin-bottom: 10px;
}



</style>
