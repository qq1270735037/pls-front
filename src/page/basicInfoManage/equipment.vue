<template>
  <div>
    <el-input
        style="width: 190px;margin-right: 40px;margin-top: 20px;margin-bottom: 20px;"
        v-model="listQuery.machineName"
        size="small"
        placeholder="请输入机电设备名"
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
        :data="machineList"
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
          {{ scope.row.machineId }}
        </template>
      </el-table-column>
      <el-table-column

          label="机电名"
          width="200"
          align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.machineName }}
        </template>
      </el-table-column>
      <el-table-column
          label="机电类型"
          width="180	"
          align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.machineType }}
        </template>
      </el-table-column>
      <el-table-column
          label="机电使用年限(单位:年)"
          width="170"
          align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.machineYear }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="机电功率(单位:瓦特)"
          width="200"
          align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.machinePower }}
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
    <el-pagination
        style="margin-top: 10px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="200"
        layout="total, sizes, prev, pager, next, jumper"
        :total="listQuery.total">
    </el-pagination>
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
        <el-form-item label="机电名">
          <el-input v-model="temp.machineName" placeholder="请输入机电名" />
        </el-form-item>
        <el-form-item label="机电类型">
          <el-input v-model="temp.machineType" placeholder="请输入机电类型" />
        </el-form-item>
        <el-form-item label="机电使用年限(单位:年)">
          <el-input v-model="temp.machineYear" placeholder="请输入机电使用年限(单位:年)" />
        </el-form-item>
        <el-form-item label="机电功率(单位:瓦特)">
          <el-input v-model="temp.machinePower" placeholder="请输入机电功率(单位:瓦特)" />
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
import { queryByPage ,add ,update , deleteById} from '@/api/getMachineInfo.js';
import { deepClone } from '@/utils/index.js';
import { setStorage, getStorage} from "@/utils/localStorage.js";
import {Message} from "element-ui";
const _temp = {
  machineId: '',
  machineName: '',
  machineType: '',
  machineYear: '',
  machinePower: '',
}
export default {
  data() {
    return {
      searchloading:false, //搜索按钮显示加载
      listLoading:true,//查询时加载遮罩
      machineList:[],       //存储表单内容
      listQuery:{       // 查询的数据
        limit: 10,//每页条数
        page: 1,//当前页码
        total: 0,//总条数
        machineName: "" //查询的机电信息名
      },
      temp: Object.assign({}, _temp),
      dialogVisible: false,   //弹出框显示
      dialogType: 'create',
    }
  },

  methods: {

    //修改每页条数的时候触发
    handleSizeChange(value){
      this.listQuery.limit = value;
      //发送请求,获取数据
      this.initCarList();
    },
    //当页码发生改变触发
    handleCurrentChange(value){
      this.listQuery.page = value;
      //发送请求,获取数据
      this.initCarList();
    },
    //初始化表格
    initCarList(){
      this.listLoading = true;
      let data = {
        machineName: this.listQuery.machineName,
        page: this.listQuery.page,
        limit: this.listQuery.limit
      }
      // console.log("输入的data为：\n")
      // console.log(data)
      queryByPage(data).then((res)=>{
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
            item.index= (this.listQuery.page-1) * this.listQuery.limit+index+1;
            //查询结果为空
            //console.log(res.total);

            this.machineList = res.datas;
            this.listQuery.total = res.datas.length;
            setTimeout(() => {
              this.listLoading = false;
            }, 200)
          })

        }

      })
    },
    //搜索
    search(){
      this.searchloading = true
      this.initCarList()
      setTimeout(() => {
        this.searchloading = false;
      }, 1500)
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
      // console.log("this item is !!:\n")
      // console.log(scope.row)
      this.temp = deepClone(scope.row)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        //TODO
      })
    },
    del(scope) {
      this.$confirm('确认删除该条数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteById({id:scope.row.machineId}).then(()=>{
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
      this.listLoading = true
      //判断新增还是修改
      if(this.dialogType==="create"){
        // console.log("新增")
        // console.log( this.temp)
        add(this.temp)
        this.initCarList()
      }else  if(this.dialogType==="modify"){
        // console.log("修改")
        // console.log( this.temp)
        update(this.temp);
        this.initCarList()
      }
      setTimeout(() => {
        this.$message({
          message: '成功',
          type: 'success'
        })
        this.dialogVisible = false
        this.listLoading = false
      }, 100)
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