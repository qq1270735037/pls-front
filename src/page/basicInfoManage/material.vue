<template>
	<div>
	      <el-input 
		  style="width: 190px;margin-right: 40px;margin-top: 20px;margin-bottom: 20px;"
	        v-model="searchName"
	        size="small"
	        placeholder="请输入物资名称"
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
		  :data="materiallist"
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
		  <el-table-column
			fixed
			label="物资编号"
			width="120"
			align="center"
		  >
			<template slot-scope="scope">
			  {{ scope.row.materialId }}
			</template>
		  </el-table-column>
		  <el-table-column
			label="物资类型"
			width="150	"
			align="center"
		  >
			<template slot-scope="scope">
			  {{ scope.row.materialtypeId }}
			</template>
		  </el-table-column>
		  <el-table-column
			label="名称"
			width="150"
			align="center"
		  >
			<template slot-scope="scope">
			  <span>{{ scope.row.materialName }}</span>
			</template>
		  </el-table-column>
		  <el-table-column
			label="价格(单位:元)"
			width="150"
			align="center"
		  >
			<template slot-scope="scope">
			  {{ scope.row.materialPrice }}
			</template>
		  </el-table-column>
		  <el-table-column
			label="用途"
			width="200"
			align="center"
		  >
		  
			<template slot-scope="scope">
			  {{ scope.row.materialUsage }}
			</template>
		  </el-table-column>
		  <el-table-column
		  			label="数量"
		  			width="150"
		  			align="center"
		  >
		  			<template slot-scope="scope">
		  			  {{ scope.row.materialCount }}
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
			
			<el-form-item label="物资类型">
			  <el-input v-model="temp.materialtypeId" placeholder="请输入物资类型" />
			</el-form-item>
			<el-form-item label="名称">
			  <el-input v-model="temp.materialName" placeholder="请输入名称" />
			</el-form-item>
			<el-form-item label="价格(单位:元)">
			  <el-input v-model="temp.materialPrice" placeholder="请输入价格(单位:元)" />
			</el-form-item>
			<el-form-item label="用途">
			  <el-input v-model="temp.materialUsage" placeholder="请输入用途" />
			</el-form-item>
			<el-form-item label="数量">
			  <el-input v-model="temp.materialCount" placeholder="请输入数量" />
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
	import { selectAll,selectByName,edit} from '@/api/getMaterialinfo.js';
	import { setStorage, getStorage} from "@/utils/localStorage.js";
	import {deepClone} from "@/utils/index.js";
	const _temp = {
	  // id: '',
	  materialId: '',
	  materialtypeId: '',
	  materialName: '',
	  materialPrice: '',
	  materialUsage: '',
	  materialCount: '',
	  
	  
	}
	export default {
		data() {
			return {
			
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
			search(){
				this.listLoading = true;
				let data={
					materialName:this.searchName
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
			        setTimeout(() => {
			          this.list.splice(scope.$index, 1)
			          this.$message({
			            message: '删除成功',
			            type: 'success'
			          })
			        }, 300)
			      })
			    },
			submit() {
			  if (this.listLoading) {
				return
			  }
			  this.listLoading = true
			  setTimeout(() => {
				  let data=this.temp;
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
				this.dialogVisible = false
				// this.loading = false
				this.listLoading = false
				
			  })
			  this.initMateriallist()
			  console.log("shengxiao ")
			}
			// //获取类型数据
			// initCategoryList(){
			// 	getCategoryByCondition({}).then(res => {
			// 		//新增一个全部,放到数组最前面
			// 		if(res != -1){
			// 			res.datas.unshift({categoryId : "", categoryName: "全部"});
			// 			this.categoryList = res.datas;
			// 		}
			// 	});
			// },
			// //获取文档数据
			// initDocList(){
			// 	this.loading = true;
			// 	//获取用户输入/选择的查询条件
			// 	let data = {
			// 		categoryId : this.selectData,
			// 		docTitle: this.queryData
			// 	}
			// 	getDocByCondition(data).then((res) => {
			// 		if(res != -1){
			// 			this.docList = res.datas;
			// 			this.loading = false;
			// 		}
			// 		//条件筛选遍历
			// 		/* let filterArr = this.docList.filter((item, index) => {
			// 			return item.docId % 5 == 0;
			// 		}); */
			// 	})
			// },
			// selectDoc(){
			// 	docSelectOne({id: 105}).then()
			// },
		},
		// created() {
		//   this.initCarList();
		// },
		mounted() {			
			this.$nextTick(() => {
				this.initMateriallist();
				// //页面初始化的时候执行
				// this.initDocList();
				// //this.testMap();
				// //初始化获取类型数据
				// this.initCategoryList();
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