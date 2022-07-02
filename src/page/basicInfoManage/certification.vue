<!-- 证件信息 -->

<template>
	<div>
	      <el-input 
		  style="width: 190px;margin-right: 40px;margin-top: 20px;margin-bottom: 20px;"
	        v-model="searchName"
	        size="small"
	        placeholder="请输入证件编号"
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
			label="序号"
			width="120"
			align="center"
		>
			<template slot-scope="scope">
			  {{ scope.row.index }}
			</template>
		</el-table-column>
		  <el-table-column
			label="证件编号"
			width="120"
			align="center"
		  >
			<template slot-scope="scope">
			  {{ scope.row.certificateCode }}
			</template>
		  </el-table-column>
		  <el-table-column
			label="人员姓名"
			width="150	"
			align="center"
		  >
			<template slot-scope="scope">
			  {{ scope.row.employeeName }}
			</template>
		  </el-table-column>
		  <el-table-column
			label="证件名"
			width="150"
			align="center"
		  >
			<template slot-scope="scope">
			  <span>{{ scope.row.certificateName }}</span>
			</template>
		  </el-table-column>
		  <el-table-column
			label="签发日期"
			width="150"
			align="center"
		  >
			<template slot-scope="scope">
			  {{ scope.row.certificateStartTime }}
			</template>
		  </el-table-column>
		  <el-table-column
			label="失效日期"
			width="200"
			align="center"
		  >
		  
			<template slot-scope="scope">
			  {{ scope.row.certificateEndTime }}
			</template>
		  </el-table-column>
		  <el-table-column
		  			label="签发单位"
		  			width="150"
		  			align="center"
		  >
		  			<template slot-scope="scope">
		  			  {{ scope.row.certificateAgent }}
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
		
		<!-- 分页组件 -->
	
		<el-pagination background @current-change="handleCurrentChange" @size-change="handleSizeChange"
			:current-page="cur_page" :page-sizes="[10,15,20,50]" :page-size="pageSize"
			layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>

		<el-dialog
		  :visible.sync="dialogVisible"
		  :title="dialogType === 'modify' ? '修改' : '新增'"
		>
		<el-form
			:rules="rules"
			ref="dataForm"
			:model="temp"
			label-width="150px"
			label-position="right"
			class="demo-ruleForm"
		  >
			
			
			
			<el-form-item label="人员编号" v-show="dialogType=='create'" prop="employeeId">
			  <el-input v-model="temp.employeeId" placeholder="请输入人员编号" />
			</el-form-item>
			<el-form-item label="人员编号" v-show="dialogType=='modify'" >
			  <div> {{temp.employeeId}}</div>
			</el-form-item>
			
			<el-form-item label="人员姓名" v-show="dialogType=='modify'" >
			  <div> {{temp.employeeName}}</div>
			</el-form-item>
			<el-form-item label="证件编号" prop ="certificateCode" >
			  <el-input v-model="temp.certificateCode" placeholder="请输入证件编号" />
			</el-form-item>
			
			
			
			<el-form-item label="证件名" prop = "certificateName">
			  <el-input v-model="temp.certificateName" placeholder="请输入证件名" />
			</el-form-item>
			<el-form-item label="签发日期">
			  <div class="block">
			     
			      <el-date-picker
			        v-model="temp.certificateStartTime"
			        type="date"
			        placeholder="选择日期">
			      </el-date-picker>
			    </div>
			</el-form-item>
			<!-- <el-form-item label="签发日期">
			  <el-input v-model="temp.certificateStartTime" placeholder="请输入签发日期" />
			</el-form-item> -->
			<el-form-item label="失效日期">
			  <div class="block">
			     
			      <el-date-picker
			        v-model="temp.certificateEndTime"
			        type="date"
			        placeholder="选择日期">
			      </el-date-picker>
			    </div>
			</el-form-item>
			<!-- <el-form-item label="失效日期">
			  <el-input v-model="temp.certificateEndTime" placeholder="请输入失效日期" />
			</el-form-item> -->
			<el-form-item label="签发单位">
			  <template>
			    <el-select v-model="temp.certificateAgent" placeholder="请选择签发单位">
			      <el-option
			        v-for="item in options"
			        :key="item"
			        :label="item"
			        :value="item">
			      </el-option>
			    </el-select>
			  </template>
			</el-form-item>
		<!-- 	<el-form-item label="签发单位">
			  <el-input v-model="temp.certificateAgent" placeholder="请输入签发单位" />
			</el-form-item> -->
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
	// import { queryByCondition } from '@/api/getCarinfo.js';
	import { selectAll,selectByName,edit,addByName,deleteById} from '@/api/getCertificateinfo.js';
	import { setStorage, getStorage} from "@/utils/localStorage.js";
	import {deepClone} from "@/utils/index.js";
	//需更改
	const _temp = {
	  // id: '',
	  certificateAgent: '',
	  certificateEndTime: '',
	  certificateStartTime: '',
	  certificateName: '',
	  certificateCode: '',
	  employeeId: '',
	  employeeName:''
	  
	  
	}
	export default {
		data() {
			return {
				rules: {
				 
						certificateCode: [
						{ required: true, message: '请输入证件编号(仅数字)', trigger: 'blur' }
						
								],
						employeeId: [
						{ required: true,  message: '请输入人员编号(仅数字)', trigger: 'blur' },
						
										],
						certificateName: [
						{ required: true, message: '请输入证件名', trigger: 'blur' }
										]
					
	
					},
				
				
				
				total:1,
				options:["交通部","民政局","法院","重庆大学","财务部","技术部"],
			
				listLoading:true,//查询时加载遮罩
				cur_page:1,
				pageSize:10,
				
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
							this.total=res.datas.length;
							this.listLoading = false;
						}
				})
			},
			//查询
			//需更改
			search(){
				this.listLoading = true;
				let data={
					certificateCode:this.searchName
				}
				selectByName(data).then((res)=>{
					this.materiallist = res.datas;
					this.total=res.datas.length;
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
			  this.temp = deepClone(scope.row) //这里将scope的row复制到temp中是有选择的复制, 如果temp中属性少也没事
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
						  certificateId:scope.row.certificateId
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
						  	  type: 'error'
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
				  if(!Number.isInteger(data.certificateCode-'0')||!Number.isInteger(data.employeeId-'0')){
					  this.$message({
						  message:'请正确输入数字',
						  type:'error'
					  })
					  return
				  }
				  if(data.certificateCode<1||data.employeeId<1){
					  this.$message({
									  message:'编号不能小于1',
									  type:'error',
									 
					  })
					  return
				  }

				  if(this.dialogType=='modify'){
					  edit(data).then((res)=>{
					  	console.log(res);
					  	if(res.code==200){
					  		this.$message({
					  		  message: '提交成功',
					  		  type: 'success'
					  		})
							this.dialogVisible = false;
					  	}
					  	else{
					  		this.$message({
					  		  message: '提交失败',
					  		  type: 'error'
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
							this.dialogVisible = false;
					  	}
					  	else{
					  		this.$message({
					  		  message: '新增失败',
					  		  type: 'error'
					  		})
					  	}
					  });
				  }

				
				// this.loading = false
				this.listLoading = false;
				
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