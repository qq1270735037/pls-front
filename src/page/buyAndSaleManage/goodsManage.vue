<template>
	<div>
		<!-- 需更改 -->
	      <el-input 
		  style="width: 190px;margin-right: 40px;margin-top: 20px;margin-bottom: 20px;"
	        v-model="searchName"
	        size="small"
	        placeholder="请输入货物类型名称"
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
		  :data="materiallist.slice((cur_page-1)*pageSize,cur_page*pageSize)" 
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
			width="120"
			align="center"
		>
			<template slot-scope="scope">
			  {{ scope.row.index }}
			</template>
		</el-table-column>
		
		<!-- 需更改 -->
		<el-table-column
					fixed
					label="货物名"
					width="120"
					align="center"
		>
					<template slot-scope="scope">
					  {{ scope.row.merchandiseName }}
					</template>
		</el-table-column>
		  <el-table-column
			fixed
			label="购销类型"
			width="120"
			align="center"
		  >
			<template slot-scope="scope">
			  {{ scope.row.purchasesaleType }}
			</template>
		  </el-table-column>
		  <el-table-column
			label="购销价格"
			width="150	"
			align="center"
		  >
			<template slot-scope="scope">
			  {{ scope.row.purchasesalePrice }}
			</template>
		  </el-table-column>
		  <el-table-column
			label="购销数量"
			width="150"
			align="center"
		  >
			<template slot-scope="scope">
			  <span>{{ scope.row.purchasesaleCount }}</span>
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
		<el-pagination background @current-change="handleCurrentChange" @size-change="handleSizeChange"
			:current-page="cur_page" :page-sizes="[10,15,20,50]" :page-size="pageSize"
			layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
		
		<el-dialog
		
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
			<!-- 需更改 -->
			<el-form-item label="购销类型">
				<template>
				  <el-radio v-model="temp.purchasesaleType" label="购入">购入</el-radio>
				  <el-radio v-model="temp.purchasesaleType" label="售出">售出</el-radio>
				</template>
			</el-form-item>
			
			
			<el-form-item label="购销货物">
			  <el-input v-model="temp.merchandiseName" placeholder="请输入货物名称" />
			</el-form-item>
			<el-form-item label="货物编号">
			  <el-input v-model="temp.merchandiseId" placeholder="请输入货物编号" />
			</el-form-item>
			<el-form-item label="购销价格(单位:元)">
			  <el-input v-model="temp.purchasesalePrice" placeholder="请输入购销价格" />
			</el-form-item>
			<el-form-item label="购销数量">
			  <el-input v-model="temp.purchasesaleCount" placeholder="请输入购销数量" />
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
	//需更改
	// import { queryByCondition } from '@/api/getPurchasesale.js';
	import { selectAll,selectByName,edit,addByName,deleteById} from '@/api/getPurchasesale.js';
	import { setStorage, getStorage} from "@/utils/localStorage.js";
	import {deepClone} from "@/utils/index.js";
	//需更改
	const _temp = {
		merchandiseName:'',
		merchandiseId:'',
	 
	
	  purchasesaleCount: '',
	  purchasesalePrice: '',
	  purchasesaleType: ''
	  
	  
	  
	}
	export default {
		data() {
			return {
				cur_page:1,
				pageSize:10,
			
				listLoading:true,//查询时加载遮罩
				
				materiallist:[],//接受的表
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
				searchName:''
			}
		},

		methods: {
			//返回当前页码
			handleCurrentChange(val) {
				//console.log(val);
				this.cur_page = val;
				//console.log(this.cur_page);
				//console.log(this.companyList.slice((this.cur_page - 1) * this.pageSize, this.cur_page * this.pageSize));
			},
			// 分页导航改变页码大小在method里定义
			handleSizeChange(val) {
				this.pageSize = val;
				this.cur_page = 1;
				//console.log(this.companyList.slice((this.cur_page - 1) * this.pageSize, this.cur_page * this.pageSize));
			},
			initMateriallist(){
				this.listLoading = true;
				selectAll().then((res)=>{
					
					if(res != -1){
							console.log("这是res\n");
							console.log(res);
							res.datas.forEach((item, index) => {
								item.index = index+1;
								//console.log(item)
							})
							this.materiallist = res.datas;
							this.listLoading = false;
						}
				})
			},
			//查询
			//需更改
			search(){
				this.listLoading = true;
				let data={
					merchandiseName:this.searchName
				}
				selectByName(data).then((res)=>{
					this.materiallist = res.datas;
					this.listLoading = false;
					res.datas.forEach((item, index) => {
						item.index = index+1;
						//console.log(item)
					})
					console.log(res);
					console.log(this.searchName);
				});
			},
			refresh() {
			 //  this.listQuery = {
				// page: 1,
				// limit: 20,
				// created_at: undefined,
				// status: undefined,
				// keyword: undefined
			 //  }
			  this.initMateriallist()
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
			  // addByName(temp).then((res)=>{
			  // 	console.log(res);
			  // 	if(res.code==200){
			  // 		this.$message({
			  // 		  message: '提交成功',
			  // 		  type: 'success'
			  // 		})
			  // 	}
			  // 	else{
			  // 		this.$message({
			  // 		  message: '提交失败',
			  // 		  type: 'success'
			  // 		})
			  // 	}
			  // });
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
			
			//需更改
			del(scope) {
			      this.$confirm('确认删除该条数据吗？', '提示', {
			        confirmButtonText: '确定',
			        cancelButtonText: '取消',
			        type: 'warning'
			      }).then(() => {
			        setTimeout(() => {
						
			          let data={
						  purchasesaleId:scope.row.purchasesaleId
					  }
					  deleteById(data).then((res)=>{
						  console.log(res);
						  console.log(data.materialId);
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
					      this.initMateriallist()
					  },500);
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
					  addByName(data).then((res)=>{
					  	console.log(res);
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
			      this.initMateriallist()
			  },300);
			  console.log("shengxiao ")
			}
			
		},
		// created() {
		//   this.initCarList();
		// },
		mounted() {			
			this.$nextTick(() => {
				this.initMateriallist();
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