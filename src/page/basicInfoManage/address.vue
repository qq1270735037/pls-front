<template>
	
	<div>
		<el-input
			  style="width: 190px;margin-right: 40px;margin-top: 20px;margin-bottom: 20px;"
		        v-model="inputData"
		        size="small"
		        placeholder="请输入地区"
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
			  :data="addressList.slice((cur_page-1)*pageSize,cur_page*pageSize)"
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
				width="250"
				align="center"
			>
				<template slot-scope="scope">
				  {{ scope.row.index }}
				</template>
			</el-table-column>
			  <el-table-column
				
				label="省份"
				width="250"
				align="center"
			  >
				<template slot-scope="scope">
				  {{ scope.row.addressProvince }}
				</template>
			  </el-table-column>
			  <el-table-column
				label="城市"
				width="250"
				align="center"
			  >
				<template slot-scope="scope">
				  {{ scope.row.addressCity }}
				</template>
				
			  </el-table-column>
			  <el-table-column
				label="地区"
				width="250"
				align="center"
			  >
				<template slot-scope="scope">
				  <span>{{ scope.row.addressName }}</span>
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
          <el-form-item label="省份">
            <el-input v-model="temp.addressProvince" placeholder="请输入省份" />
          </el-form-item>
          <el-form-item label="城市">
            <el-input v-model="temp.addressCity" placeholder="请输入城市" />
          </el-form-item>
          <el-form-item label="地区">
            <el-input v-model="temp.addressName" placeholder="请输入地区" />
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
	import { queryByCondition,addAddress,update,deleteAddress } from '@/api/getAddressInfo.js';
	import { setStorage, getStorage} from "@/utils/localStorage.js";
  import {deepClone} from "@/utils/index.js";
  import {Message} from "element-ui";
	const _temp = {
	  addressProvince: '',
	  addressCity: '',
	  addressName: '',
	}
	export default {
		data() {
			return {
				listLoading:true,//查询时加载遮罩
        inputData:"",//输入的条件
				addressList:[],
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
			initAddressList(){
				this.listLoading = true;
				queryByCondition({}).then((res)=>{
					if(res != -1){
						res.datas.forEach((item, index) => {
							item.index = index+1;
						})
						this.addressList = res.datas;
						this.total = this.addressList.length;
						this.listLoading = false;
					}
	
				})
			},
			//搜索
      search() {
        let address = {
          addressName: this.inputData
        }
        console.log(address)
        this.listLoading = true;
        queryByCondition(address).then((res) => {
          if (res != -1) {
            res.datas.forEach((item, index) => {
              item.index = index + 1;
            })
            this.addressList = res.datas;
			      this.total=this.addressList.length;
            this.cur_page=1;
            this.listLoading = false;
          }
        })
      },
			refresh() {
			  this.initAddressList()
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
				deleteAddress({id:scope.row.addressId}).then(()=>{
					this.initAddressList()
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
          update(data).then((res) => {
            if (res != -1) {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.dialogVisible = false
              this.initAddressList()
            }
          })
        }
        else{
          addAddress(data).then((res)=>{
            if (res != -1) {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.dialogVisible = false
              this.initAddressList()
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
				this.initAddressList();
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