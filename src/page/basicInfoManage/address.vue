<template>
	
	<div>
		<el-input
			  style="width: 190px;margin-right: 40px;margin-top: 20px;margin-bottom: 20px;"
		        v-model="listQuery.keyword"
		        size="small"
		        placeholder="请输入车牌号"
		        clearable
		        class="filter-item"
		      />
		      <el-button-group style="margin-right: 20px;margin-top: 20px;margin-bottom: 20px;"
				class="filter-item">
<!--		        <el-button-->
<!--		          size="small"-->
<!--		          type="primary"-->
<!--		          icon="el-icon-search"-->
<!--		          @click="search"-->
<!--		        >-->
<!--		          搜索-->
<!--		        </el-button>-->
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
			  :data="addressList"
			  element-loading-text="正在疯狂加载"
			  border
			  fit
			  height="500px"
			  class="table-container"
			  highlight-current-row
			  style="width: 100%;"
			>
			<el-table-column
				fixed
				label="序号"
				width="350"
				align="center"
			>
				<template slot-scope="scope">
				  {{ scope.row.index }}
				</template>
			</el-table-column>
			  <el-table-column
				fixed
				label="省份"
				width="350"
				align="center"
			  >
				<template slot-scope="scope">
				  {{ scope.row.addressProvince }}
				</template>
			  </el-table-column>
			  <el-table-column
				label="城市"
				width="350"
				align="center"
			  >
				<template slot-scope="scope">
				  {{ scope.row.addressCity }}
				</template>
				
			  </el-table-column>
			  <el-table-column
				label="地区"
				width="350"
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
	const _temp = {
	  addressProvince: '',
	  addressCity: '',
	  addressName: '',
	}
	export default {
		data() {
			return {
				selectData: "",//被选择的下拉
				queryData: "",//用于条件查询
				categoryList: [],//用于接收类型数据
				listLoading:true,//查询时加载遮罩
				addressList:[],
				listQuery:{
					page: 1,
					limit: 20,
					created_at: undefined,
					status: undefined,
					keyword: undefined
				  },
				temp: Object.assign({}, _temp),
				dialogVisible: false,   //弹出框显示
				dialogType: 'create',
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
        // data.companyTime = Date.parse(new Date(this.temp.companyTime));
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