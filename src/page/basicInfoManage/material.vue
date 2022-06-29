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
			
			label="序号"
			width="120"
			align="center"
		>
			<template slot-scope="scope">
			  {{ scope.row.index }}
			</template>
		</el-table-column>
		  <!-- <el-table-column
			fixed
			label="物资编号"
			width="120"
			align="center"
		  >
			<template slot-scope="scope">
			  {{ scope.row.materialId }}
			</template> -->
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
		  			label="物资类型"
		  			width="150	"
		  			align="center"
		  >
		  			<template slot-scope="scope">
		  			  {{ scope.row.materialtypeType }}
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
			ref="temp"
			:model="temp"
			:rules="rules"
			label-width="150px"
			label-position="right"
			class="demo-ruleForm"
		  >
			
			<el-form-item label="物资类型" prop="materialtypeId">
			    <el-select v-model="temp.materialtypeId" placeholder="请选择" size="small">
			       <el-option
			         v-for="item in options"
			         :key="item.value"
			         :label="item.materialtypeType"
			         :value="item.materialtypeId">
			       </el-option>
			     </el-select>
				  <!-- <h1>{{temp.materialtypeId}}</h1> -->
			</el-form-item>
			<el-form-item label="名称" prop="materialName" >
			  <el-input v-model="temp.materialName" placeholder="请输入名称" />
			</el-form-item>
			<el-form-item label="价格(单位:元)" prop="materialPrice" >
			  <el-input v-model="temp.materialPrice" placeholder="请输入价格(单位:元)" />
			</el-form-item>
			<el-form-item label="用途" prop="materialUsage" >
			  <el-input v-model="temp.materialUsage" placeholder="请输入用途" />
			</el-form-item>
			<el-form-item label="数量" prop="materialCount">
			  <el-input v-model="temp.materialCount" placeholder="请输入数量" />
			</el-form-item>
		</el-form>
		<el-button type="danger" @click="dialogVisible = false">
		  取消
		</el-button>
		<el-button type="primary" @click="submit('temp')">
		  确定
		</el-button>
	 </el-dialog>
	</div>
</template>

<script>
	// import { queryByCondition } from '@/api/getCarinfo.js';
	import { selectAll,selectByName,edit,addByName,deleteById,getMaterialAndTypeList ,selectType} from '@/api/getMaterialinfo.js';
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
	  materialtypeType:'',
	  
	}
	export default {
		data() {
			return {
			
				listLoading:true,//查询时加载遮罩
				options:[],
				materiallist:[],//接受的表
				
				listQuery:{
					page: 1,
					limit: 10,
					total: 0,//总条数
				  },
				temp: Object.assign({}, _temp),
				dialogVisible: false,   //弹出框显示
				dialogType: 'create',
				searchName:'',
				
				rules: {
				          materialtypeId: [
				                      { required: true, message: '请选择类型', trigger: 'change' }
				                    ],
				          materialName: [
				            { required: true, message: '请输入名称', trigger: 'blur' },
				            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
				          ],
				          materialPrice: [
				            { required: true, message: '请输入价格', trigger: 'blur' },
				          ],
				          materialUsage: [
				            { required: true, message: '请输入用途', trigger: 'blur' },
				          ],
				          materialCount: [
				            { required: true, message: '请输入数量', trigger: 'blur' },
				          ]
				       }
			}
		},

		methods: {
			//修改每页条数的时候触发
			handleSizeChange(value){
			  this.listQuery.limit = value;
			  console.log(value);
			  //发送请求,获取数据
			  this.initMateriallist();
			},
			//当页码发生改变触发
			handleCurrentChange(value){
			  this.listQuery.page = value;
			  console.log(value);
			  //发送请求,获取数据
			  this.initMateriallist();
			},
			initMateriallist(){
				this.listLoading = true;
				let data = {
				  page: this.listQuery.page,
				  limit: this.listQuery.limit,
				  materialName:this.searchName,
				  }
				selectByName(data).then((res)=>{
					
					if(res != -1){
							console.log("这是res\n");
							console.log(res);
							res.datas.forEach((item, index) => {
								// item.index = index+1;
								item.index= (this.listQuery.page-1) * this.listQuery.limit+index+1;
								//console.log(item)
							})
							this.materiallist = res.datas;
							this.listQuery.total = res.total;
							this.listLoading = false;
						}
				})
			},
			//查询
			search(){
				this.listLoading = true;
				let data={
					materialName:this.searchName,
					page: this.listQuery.page,
					limit: this.listQuery.limit
				}
				selectByName(data).then((res)=>{
					this.listLoading = false;
					this.listLoading = false;
					res.datas.forEach((item, index) => {
						// item.index = index+1;
						item.index= (this.listQuery.page-1) * this.listQuery.limit+index+1;
						//console.log(item)
					})
					this.materiallist = res.datas;
					this.listQuery.total = res.total;
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
				this.$refs['temp'].clearValidate()
			  })
			  selectType().then((res)=>{
			  	
			  	if(res != -1){
			  			
			  			console.log(res);
			  			this.options = res.datas;
			  			this.listLoading = false;
			  		}
			  })
			  
			},
			edit(scope) {
			  this.resetTemp()
			  this.dialogVisible = true
			  this.dialogType = 'modify'
			  this.temp = deepClone(scope.row)
			  this.$nextTick(() => {
				this.$refs['temp'].clearValidate()
			  })
			  selectType().then((res)=>{
			  	
			  	if(res != -1){
			  			
			  			console.log(res);
			  			this.options = res.datas;
			  			this.listLoading = false;
			  		}
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
						  materialId:scope.row.materialId
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
					  },300);
			        },)
			      })
				  
			    },
			submit(temp){
				this.$refs[temp].validate((valid) => {
				          if (valid) {
				            this.submit1()
				          } else {
				            console.log('error submit!!');
				            return false;
				          }
				        });
			},
			submit1() {
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