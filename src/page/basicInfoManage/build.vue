
<template>
	<div>
	      <el-input 
		  style="width: 190px;margin-right: 40px;margin-top: 20px;margin-bottom: 20px;"
	        v-model="searchName"
	        size="small"
	        placeholder="请输入建筑名称"
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
	          @click="add"
	        >
	          新增
	        </el-button>
	      </el-button-group>
		  
	<el-table
		  v-loading="listLoading"
		  :data="buildlist"
		  element-loading-text="正在疯狂加载"
		  border
		  fit
		  height="500px"
		  class="table-container"
		  highlight-current-row
		>
		<el-table-column
			
			label="序号"
			width="120"
			align="center"
		>
			<template slot-scope="scope">
			  {{ scope.row.index }}
			</template>
		</el-table-column>
		  <el-table-column
			
			label="建筑名称"
			width="120"
			align="center"
		  >
			<template slot-scope="scope">
			  {{ scope.row.bulidName }}
			</template>
		  </el-table-column>
		  <el-table-column
			label="建筑类型"
			width="120	"
			align="center"
		  >
			<template slot-scope="scope">
			  {{ scope.row.buildStyle }}
			</template>
		  </el-table-column>
		  <el-table-column
			label="是否租售"
			width="120"
			align="center"
		  >
			<template slot-scope="scope">
			  <span> {{ parseInt(scope.row.buildRent) === 1 ? '是' : '否'  }}</span>
			</template>
		  </el-table-column>
		  <el-table-column
			label="面积(单位:平方)"
			width="150"
			align="center"
		  >
			<template slot-scope="scope">
			  {{ scope.row.buildArea }}
			</template>
		  </el-table-column>
		  <el-table-column
			label="负责人"
			width="200"
			align="center"
		  >
		  
			<template slot-scope="scope">
			  {{ scope.row.buildPerson }}
			</template>
		  </el-table-column>
		  <el-table-column
		  			label="地址"
		  			width="200"
		  			align="center"
		  >
		  			<template slot-scope="scope">
		  			  {{ scope.row.addressProvince}}{{scope.row.addressCity}}{{scope.row.addressName}}
		  			</template>
		  </el-table-column>
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
			
			<el-form-item label="建筑名称">
			  <el-input v-model="temp.bulidName" placeholder="请输入建筑名称" />
			</el-form-item>
			<el-form-item label="建筑类型">
			  <el-input v-model="temp.buildStyle" placeholder="请输入建筑类型" />
			</el-form-item>
			<el-form-item label="是否出租">
			    <el-radio v-model="temp.buildRent" label="1">是</el-radio>
			    <el-radio v-model="temp.buildRent" label="0">否</el-radio>
			</el-form-item>
			<el-form-item label="面积(单位:平方)">
			  <el-input v-model="temp.buildArea" placeholder="请输入面积(单位:平方)" />
			</el-form-item>
			<el-form-item label="负责人">
			  <el-input v-model="temp.buildPerson" placeholder="负责人" />
			</el-form-item>
			<el-form-item label="地址">
				 <el-select v-model="temp.addressId" placeholder="请选择" size="small">
				    <el-option
				      v-for="item in options"
				      :key="item.value"
				      :label="item.addressProvince+item.addressCity+item.addressName"
				      :value="item.addressId">
				    </el-option>
				  </el-select>
				  <h1>{{temp.addressId}}</h1>
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
	// import { queryByCondition } from '@/api/getCarinfo.js';
	// import { selectAll,selectByName,edit,addByName,deleteById} from '@/api/getMaterialinfo.js';
	import{queryByCondition}from '@/api/getAddressInfo.js';
	import { selectAll,getBuildAndAddress,getBuildByName,edit,addByName,deleteById } from '@/api/getBuildinfo.js';
	import { setStorage, getStorage} from "@/utils/localStorage.js";
	import {deepClone} from "@/utils/index.js";
	const _temp = {
	  // id: '',
	  buildId: '',
	  addressId: '',
	  bulidName: '',
	  buildStyle: '',
	  buildRent: "",
	  buildArea: '',
	  buildPerson: '',
	  
	  
	}
	export default {
		data() {
			return {
				rent:1,
				listLoading:true,//查询时加载遮罩
				
				buildlist:[],//接受的表
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
				searchName:'',
				
				options: [],
				        value: ''
			}
		},

		methods: {
			
		
			
			//初始化表格
			initBuildlist(){
				this.listLoading = true;
				getBuildAndAddress().then((res)=>{
					
					if(res != -1){
							
							res.datas.forEach((item, index) => {
								item.index = index+1;
							
							})
							//给列表赋值
							this.buildlist = res.datas;
							this.listLoading = false;
						}
				})
				
			},
			//查询
			search(){
				this.listLoading = true;
				let data={
					bulidName:this.searchName
				}
				console.log(this.searchName);
				getBuildByName(data).then((res)=>{
					this.buildlist = res.datas;
					console.log(res);
					this.listLoading = false;
					res.datas.forEach((item, index) => {
						item.index = index+1;
						//console.log(item)
					})
					console.log(res);
					
				});
			},
			refresh() {
			  this.initBuildlist()
			},
			resetTemp() {
			  this.temp = Object.assign({}, _temp)
			},
			add() {
				//显示地址选择框
				queryByCondition({}).then((res)=>{
					
					if(res != -1){
							
							res.datas.forEach((item, index) => {
								item.index = index+1;
							
							})
							//给列表赋值
							console.log(res);
							this.options = res.datas;
							this.listLoading = false;
						}
				})
			    this.resetTemp()
			    this.dialogVisible = true
			    this.dialogType = 'create'
			    this.$nextTick(() => {
				this.$refs['dataForm'].clearValidate()
			  })
			},
			edit(scope) {
				//显示地址选择框
				queryByCondition({}).then((res)=>{
					
					if(res != -1){
							
							res.datas.forEach((item, index) => {
								item.index = index+1;
							
							})
							//给列表赋值
							console.log(res);
							this.options = res.datas;
							this.listLoading = false;
						}
				})
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
			        setTimeout(() => {
						
			          let data={
						  buildId:scope.row.buildId
					  }
					  console.log(data.buildId);
					  deleteById(data).then((res)=>{
						  console.log(res);
						  
						  if(res.code==200){
						  	this.$message({
						  	  message: '删除成功',
						  	  type: 'success'
						  	})
						  }
						  else{
						  	this.$message({
						  	  message: '删除失败',
						  	  type: 'success'
						  	})
						  }
						  
					  })
					  setTimeout(() =>{
					      this.initBuildlist()
					  },300);
			        },)
			      })
				  
			    },
			submit() {
			  if (this.listLoading) {
				return
			  }
			  this.listLoading = true
			  setTimeout(() => {
				  let data=this.temp;
				  
				  if(this.dialogType=='modify'){
					  
					  edit(data).then((res)=>{
					  	console.log(res);
					  	if(res.code==200){
					  		this.$message({
					  		  message: '提交成功',
					  		  type: 'success'
					  		})
					  	}
					  	else{
					  		this.$message({
					  		  message: '提交失败',
					  		  type: 'success'
					  		})
					  	}
					  });
				  }
				  else if(this.dialogType=='create'){
					  console.log(data);
					  addByName(data).then((res)=>{
					  	
					  	if(res.code==200){
					  		this.$message({
					  		  message: '新增成功',
					  		  type: 'success'
					  		})
					  	}
					  	else{
					  		this.$message({
					  		  message: '新增失败',
					  		  type: 'success'
					  		})
					  	}
					  });
				  }

				this.dialogVisible = false
				// this.loading = false
				this.listLoading = false
				
			  })
			  
			  setTimeout(() =>{
			      this.initBuildlist()
			  },300);
			  console.log("shengxiao ")
			}
			
		},
		mounted() {			
			this.$nextTick(() => {
				this.initBuildlist();
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