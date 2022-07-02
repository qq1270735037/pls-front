<template>

  <div>
    <el-input
        style="width: 190px;margin-right: 40px;margin-top: 20px;margin-bottom: 20px;"
        v-model="inputData"
        size="small"
        placeholder="请输入车牌号"
        clearable
        class="filter-item"
    />
    <el-button-group style="margin-right: 20px;margin-top: 20px;margin-bottom: 20px;"
                     class="filter-item">
      <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="search()"
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
          @click="add"
      >
        新增
      </el-button>
    </el-button-group>

    <el-table
        v-loading="listLoading"
        :data="transportationList.slice((cur_page-1)*pageSize,cur_page*pageSize)"
        element-loading-text="正在疯狂加载"
        border
        fit
        height="500px"
        class="table-container"
        highlight-current-row
        style="width: 100%;"
    >
      <el-table-column
          
          label="序号"
          width="200"
          align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.index }}
        </template>
      </el-table-column>
      <el-table-column
          
          label="车牌号"
          width="200"
          align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.carNumber }}
        </template>
      </el-table-column>
      <el-table-column
          label="运输开始时间"
          width="200"
          align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.transportationStartTime }}
        </template>

      </el-table-column>
      <el-table-column
          label="运输结束时间"
          width="200"
          align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.transportationEndTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="运输起点"
          width="200"
          align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.transportationStartLocation }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="运输终点"
          width="200"
          align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.transportationEndLocation }}</span>
        </template>
      </el-table-column>
        <el-table-column
            label="运输利润"
            width="200"
            align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.transportationMoney }}</span>
          </template>

      </el-table-column>


      <el-table-column
          fixed="right"
          label="操作"
          width="250"
          align="center"
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
    <!-- 分页组件ui -->
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
        <el-form-item label="车辆序号">
          <el-input v-model="temp.carId" placeholder="请输入车辆序号" />
        </el-form-item>
        <el-form-item label="运输开始时间">
          <el-date-picker
              v-model="temp.transportationStartTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择运输开始时间">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="运输结束时间">
          <el-date-picker
              v-model="temp.transportationEndTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择运输结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="运输起点">
          <el-input v-model="temp.transportationStartLocation" placeholder="请输入运输起点" />
        </el-form-item>
        <el-form-item label="运输终点">
          <el-input v-model="temp.transportationEndLocation" placeholder="请输入运输终点" />
        </el-form-item>
        <el-form-item label="运输利润">
          <el-input v-model="temp.transportationMoney" placeholder="请输入运输利润" />
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
import { queryByCondition,addTransportation,updateTransportation,deleteTransportation } from '@/api/getTransportationInfo.js';
import { setStorage, getStorage} from "@/utils/localStorage.js";
import {deepClone} from "@/utils/index.js";
import {Message} from "element-ui";
  const _temp = {
    carId:'',
    carNumber:'',
    transportationStartTime:'',
    transportationEndTime:'',
    transportationStartLocation:'',
    transportationEndLocation:'',
    transportationMoney:'',
  }
  export default {
    data() {
      return {
        listLoading:true,//查询时加载遮罩
        inputData:"",//输入的条件
        transportationList:[],
        temp: Object.assign({}, _temp),
        dialogVisible: false,   //弹出框显示
        dialogType: 'create',
        cur_page: 1,
        pageSize: 10,
        //数据条数
        total: 0
      }
    },

  methods: {
    initTransportationList(){
      this.listLoading = true;
      queryByCondition({}).then((res)=>{
        console.log(res)
        if(res != -1){
          res.datas.forEach((item, index) => {
            item.index = index+1;
          })
          this.transportationList = res.datas;
          this.total = this.transportationList.length;
          this.listLoading = false;
        }

      })
    },
    //搜索
    search() {
      let transportation = {
        carNumber: this.inputData
      }
      this.listLoading = true;
      queryByCondition(transportation).then((res) => {
        if (res != -1) {
          res.datas.forEach((item, index) => {
            item.index = index + 1;
          })
          this.transportationList = res.datas;
          this.total=this.transportationList.length;
          this.cur_page=1;
          this.listLoading = false;
        }
      })
    },
    refresh() {
      this.initTransportationList()
    },
    resetTemp() {
      this.temp = Object.assign({}, _temp)
    },
    add() {
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
        deleteTransportation({id:scope.row.transportationId}).then(()=>{
          this.initTransportationList()
          setTimeout(() => {
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
      let data = this.temp;
      if (this.dialogType == 'modify') {
        updateTransportation(data).then((res) => {
          if (res != -1) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.dialogVisible = false
            this.initTransportationList()
          }
        })
      }
      else{
        addTransportation(data).then((res)=>{
          if (res != -1) {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.dialogVisible = false
            this.initTransportationList()
          }
        })
      }
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
      this.initTransportationList();
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