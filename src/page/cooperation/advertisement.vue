<template>
  <div>
    <el-input
        style="width: 190px;margin-right: 40px;margin-top: 20px;margin-bottom: 20px;"
        v-model="listQuery.adContent"
        size="small"
        placeholder="请输入广告内容"
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
        :data="adList"
        element-loading-text="正在疯狂加载"
        border
        fit
        height="500px"
        class="table-container"
        highlight-current-row
    >
      <el-table-column
          label="序号"
          width="80"
          align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.index }}
        </template>
      </el-table-column>
      <el-table-column
          show-overflow-tooltip
          label="广告内容"
          width="300"
          align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.adContent }}
        </template>
      </el-table-column>
      <el-table-column
          label="广告金额(元)"
          width="100"
          align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.adMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="广告商"
          width="80"
          align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.adAdviser }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="开始时间"
          width="80"
          align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.adStart }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="结束时间"
          width="80"
          align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.adEnd }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="广告图片"
          width="300"
          align="center"
      >
        <template slot-scope="scope">
<!--          <span>{{ scope.row.adImages }}</span>-->
          <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.adImages"
              :preview-src-list="[scope.row.adImages]">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
          fixed="right"
          label="操作"
          width="200"
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
    <pagination
        v-show="listQuery.total > 0"
        :total="listQuery.total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="initAdList"
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
        <el-form-item label="广告内容">
          <el-input v-model="temp.adContent" placeholder="请输入广告内容" />
        </el-form-item>
        <el-form-item label="广告金额">
          <el-input v-model="temp.adMoney" placeholder="请输入广告金额" />
        </el-form-item>
        <el-form-item label="赞助商">
          <el-input v-model="temp.adAdviser" placeholder="请输入赞助商" />
        </el-form-item>
        <el-form-item label="开始时间">
          <el-input v-model="temp.adStart" placeholder="请输入开始时间" />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-input v-model="temp.adEnd" placeholder="请输入结束时间" />
        </el-form-item>
        <el-form-item label="广告图片">
          <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              accept=".jpg, .jpeg,.png"
          >
            <img v-if="temp.adImages" :src="temp.adImages" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
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
import { queryByPage,add,update,deleteById} from '@/api/getAd.js';
import { deepClone } from '@/utils/index.js';
import Pagination from '@/components/Pagination'
import { setStorage, getStorage} from "@/utils/localStorage.js";
import {Message} from "element-ui";
const _temp = {
  adContent: "",
  adMoney: "",
  adAdviser: "",
  adStart: "",
  adEnd: "",
  adImages: ""
}

export default {
  components: {
    Pagination
  },
  data() {
    return {
      searchloading:false, //搜索按钮显示加载
      listLoading:true,//查询时加载遮罩
      adList:[],       //存储表单内容
      uploadUrl: 'http://localhost:8080/fileupload/add',
      listQuery:{       // 查询的数据
        limit: 10,//每页条数
        page: 1,//当前页码
        total: 0,//总条数
        adContent: "" //查询的广告内容
      },
      fileList:[],
      temp: Object.assign({}, _temp),
      dialogVisible: false,   //弹出框显示
      dialogType: 'create',
    }
  },

  methods: {
    handleAvatarSuccess(res, file) {
      this.fileList.push(res);
      console.log("fiLIST:SSS  "+ this.fileList)
      console.log(res)
      this.temp.adImages = res
      console.log("文件上传成功")
      console.log("res:=>>>"+res)
      console.log(file.raw)
      this.temp.site_logo = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      if (!this.uploadUrl) {
        this.$message.error('请设置正确的图片上传地址!')
        return false
      }
      const isJPG = (file.type === 'image/jpeg') ||(file.type ==='image/png')
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('只能上传JPG或者PNG图片格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    //初始化表格
    initAdList(){
      this.listLoading = true;
      let data = {
        adContent: this.listQuery.adContent,
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
          this.adList = res.datas.slice((this.listQuery.page-1) * this.listQuery.limit,this.listQuery.page * this.listQuery.limit);
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
      this.initAdList()
      setTimeout(() => {
        this.searchloading = false;
      }, 200)
    },
    //刷新
    refresh() {
      this.listQuery.page=1;
      this.initAdList()
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
        deleteById({id:scope.row.adId}).then(()=>{
          this.initAdList()
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
        let data ={
          adContent: this.temp.adContent,
          adMoney: this.temp.adMoney,
          adAdviser: this.temp.adAdviser,
          adStart: this.temp.adStart,
          adEnd: this.temp.adEnd,
          adImages: this.temp.adImages
        }
        console.log("新增")
        // console.log( this.temp)
        console.log(data)
        console.log("data: " + data)
        add(data)
      }else  if(this.dialogType==="modify"){
        console.log("修改")
        console.log( this.temp)
        let data ={
          adContent: this.temp.adContent,
          adMoney: this.temp.adMoney,
          adAdviser: this.temp.adAdviser,
          adStart: this.temp.adStart,
          adEnd: this.temp.adEnd,
          adImages: this.temp.adImages
        }
        update(this.temp);

      }
      setTimeout(() => {
        this.$message({
          message: '成功',
          type: 'success'
        })
        this.dialogVisible = false
        this.listLoading = false
        this.initAdList()
      }, 100)
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.initAdList();
    })
  },

}
</script>

<style lang="scss" scoped>
.el-upload {
  border: 1px dashed #d9d9d9 !important;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  .el-icon-plus.avatar-uploader-icon {
    border: 1px dashed #d9d9d9 !important;
    border-radius: 6px;
    font-size: 28px;
    color: #8c939d;
    width: 128px;
    height: 128px;
    line-height: 128px;
    text-align: center;
  }
}
.avatar-uploader {
  height: 128px;

  img {
    width: 128px;
    height: 128px;
  }
}
</style>