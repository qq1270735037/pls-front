<template>
  <div>
    <el-input
        style="width: 190px;margin-right: 40px;margin-top: 20px;margin-bottom: 20px;"
        v-model="inputData"
        size="small"
        placeholder="请输入货物名"
        clearable
        class="filter-item"
    />
    <el-button-group style="margin-right: 20px;margin-top: 20px;margin-bottom: 20px;"
                     class="filter-item">
      <el-button
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
        :data="carList.slice((cur_page-1)*pageSize,cur_page*pageSize)"
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
          label="货物名"
          width="200"
          align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.merchandiseName }}
        </template>
      </el-table-column>
      <el-table-column
          label="货物类型"
          width="180	"
          align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.merchandiseType }}
        </template>
      </el-table-column>
      <el-table-column
          label="货物数量（单位:个）"
          width="170"
          align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.repositoryCount }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="货物重量(单位:千克)"
          width="200"
          align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.merchandiseHeight }}
        </template>
      </el-table-column>
      <el-table-column
          label="货物尺寸"
          width="160"
          align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.merchandiseSize }}
        </template>
      </el-table-column>
      <el-table-column
          label="供货商"
          width="160"
          align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.merchandiseSupplier }}
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
        <el-form-item label="货物名">
          <el-input v-model="temp.merchandiseName" placeholder="请输入货物名" />
        </el-form-item>
        <el-form-item label="货物类型">
          <el-input v-model="temp.merchandiseType" placeholder="请输入货物类型" />
        </el-form-item>
        <el-form-item label="货物数量（单位:个）">
          <el-input v-model="temp.repositoryCount" placeholder="请输入货物数量（单位:个）" />
        </el-form-item>
        <el-form-item label="货物重量(单位:千克)">
          <el-input v-model="temp.merchandiseHeight" placeholder="请输入货物重量(单位:千克)" />
        </el-form-item>
        <el-form-item label="货物尺寸（单位:米）">
          <el-input v-model="temp.merchandiseSize" placeholder="请输入货物尺寸（单位:米）" />
        </el-form-item>
        <el-form-item label="供货商">
          <el-input v-model="temp.merchandiseSupplier" placeholder="请输入供货商" />
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
import { queryByCondition,add,update,deleteById} from '@/api/getMerchandiseinfo.js';
import { deepClone } from '@/utils/index.js';
import { setStorage, getStorage} from "@/utils/localStorage.js";
import {Message} from "element-ui";
const _temp = {
  // id: '',
  merchandiseId: '',
  buildId: '',
  purchasesaleId: '',
  merchandiseName: '',
  merchandiseType: '',
  repositoryCount : '',
  merchandiseHeight : '',
  merchandiseSize:'',
  merchandiseSupplier:'',
  merchandiseCount:'',
}
export default {
  data() {
    return {
      listLoading:true,//查询时加载遮罩
      inputData:"",//输入的条件
      carList:[],
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
    //初始化表格
    initCarList(){
      this.listLoading = true;
      queryByCondition({}).then((res)=>{
        if(res != -1){
          res.datas.forEach((item, index) => {
            item.index = index+1;
          })
          this.carList = res.datas;
          this.inputData = "";
          this.total = this.carList.length;
          this.listLoading = false;
        }

      })
    },
    //搜索
    search(){
      let merchandise = {
        merchandiseName: this.inputData
      }
      this.listLoading = true;
      queryByCondition(merchandise).then((res) => {
        if (res != -1) {
          res.datas.forEach((item, index) => {
            item.index = index + 1;
          })
		  this.total=res.datas.length;
          this.cur_page = 1;
          this.carList = res.datas;
          this.listLoading = false;
        }
      })

    },
    //刷新
    refresh() {
      this.listQuery.page=1;
      this.initCarList()
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
        deleteById({id:scope.row.merchandiseId}).then(()=>{
          this.initCarList()
          setTimeout(() => {
            this.list.splice(scope.$index, 1)  //从这个位置删除一个元素
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
        update(data).then((res) => {
          if (res != -1) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.dialogVisible = false
            this.initCarList()
          }
        })
      }
      else{
        add(data).then((res)=>{
          if (res != -1) {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.dialogVisible = false
            this.initCarList()
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
      this.initCarList();
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