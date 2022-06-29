<template>
	<div>
		<el-input style="width: 190px;margin-right: 40px;margin-top: 20px;margin-bottom: 20px;" v-model="inputData"
			size="small" placeholder="请输入公司名称" clearable class="filter-item" />
		<el-button-group style="margin-right: 20px;margin-top: 20px;margin-bottom: 20px;" class="filter-item">
			<el-button size="small" type="primary" icon="el-icon-search" @click="search()">
				搜索
			</el-button>
			<el-button size="small" type="primary" icon="el-icon-refresh" @click="refresh()">
				刷新
			</el-button>
			<el-button size="small" type="primary" icon="el-icon-plus" @click="add()">
				新增
			</el-button>
		</el-button-group>

		<el-table v-loading="listLoading" :data="companyList.slice((cur_page-1)*pageSize,cur_page*pageSize)"
			element-loading-text="正在疯狂加载" border fit height="500px" class="table-container" highlight-current-row>
			<el-table-column label="序号" width="100" align="center">
				<template slot-scope="scope">
					{{ scope.row.index }}
				</template>
			</el-table-column>
			<el-table-column label="公司名称" width="200" align="center">
				<template slot-scope="scope">
					{{ scope.row.companyName }}
				</template>
			</el-table-column>
			<el-table-column label="建立时间" width="180	" align="center">
				<template slot-scope="scope">
					{{ scope.row.companyTime }}
				</template>
			</el-table-column>
			<el-table-column label="地址" width="170" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.companyCity }}</span>
				</template>
			</el-table-column>
			<el-table-column label="公司规模" width="150" align="center">
				<template slot-scope="scope">
					{{ scope.row.companyNumber }}
				</template>
			</el-table-column>
			<el-table-column label="公司网址" width="160" align="center">
				<template slot-scope="scope">
					{{ scope.row.companyWebside }}
				</template>
				<!-- </el-table-column> -->
			</el-table-column>
			<el-table-column label="公司代码" width="100" align="center">
				<template slot-scope="scope">
					{{ scope.row.companyCode }}
				</template>
			</el-table-column>
			<el-table-column label="联系人" width="200" align="center">
				<template slot-scope="scope">
					{{ scope.row.companyPerson }}
				</template>
			</el-table-column>
			<el-table-column label="联系电话" width="200" align="center">
				<template slot-scope="scope">
					{{ scope.row.companyMobile }}
				</template>
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="200" align="left">
				<template slot-scope="scope">
					<el-button-group>
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope)">
							修改
						</el-button>
						<el-button type="danger" icon="el-icon-delete" size="mini" @click="del(scope)">
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
		<el-dialog :visible.sync="dialogVisible" :title="dialogType === 'modify' ? '修改' : '新增'">
			<el-form ref="dataForm" :model="temp" label-width="150px" label-position="right">
				<el-form-item label="公司名称">
					<el-input v-model="temp.companyName" placeholder="请输入名称" />
				</el-form-item>
				<el-form-item label="创建时间">
					<!-- <el-input v-model="temp.companyTime" placeholder="请输入时间(yyyy-MM-dd)" /> -->
					 <el-date-picker
					      v-model="temp.companyTime"
					      type="datetime"
					      placeholder="选择日期时间">
					    </el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input v-model="temp.companyCity" placeholder="请输入公司所在地址" />
				</el-form-item>
				<el-form-item label="公司规模">
					<el-input v-model="temp.companyNumber" placeholder="请输入公司规模" />
				</el-form-item>
				<el-form-item label="公司官网">
					<el-input v-model="temp.companyWebside" placeholder="请输入网址" />
				</el-form-item>
				<el-form-item label="公司代码">
					<el-input v-model="temp.companyCode" placeholder="请输入代码" />
				</el-form-item>
				<el-form-item label="联系人">
					<el-input v-model="temp.companyPerson" placeholder="请输入姓名" />
				</el-form-item>
				<el-form-item label="公司联系方式">
					<el-input v-model="temp.companyMobile" placeholder="请输入电话号码" />
				</el-form-item>
			</el-form>
			<el-button type="danger" @click="dialogVisible = false">
				取消
			</el-button>
			<el-button type="primary" @click="submit()">
				确定
			</el-button>
		</el-dialog>
	</div>
</template>

<script>
	import {
		queryByName,
		update,
		insert,
		deleteCompany //用delete不行，应该是名称被占用了
	} from '@/api/getCompanyinfo.js';
	import {
		setStorage,
		getStorage
	} from "@/utils/localStorage.js";
	import {
		deepClone
	} from "@/utils/index.js";
	const _temp = {
		companyId: '',
		companyName: '',
		companyTime: '',
		companyCity: '',
		companyNumber: '',
		companyWebside: '',
		companyCode: '',
		companyPerson: '',
		companyMobile: '',
	}
	export default {
		data() {
			return {
				listLoading: true, //查询时加载遮罩
				inputData: "",
				companyList: [],
				temp: Object.assign({}, _temp),
				dialogVisible: false, //弹出框显示
				dialogType: 'create',
				cur_page: 1,
				pageSize: 10,
				//数据条数
				total: 0

			}
		},

		methods: {
			init() {
				this.listLoading = true;
				queryByName({}).then((res) => {
					if (res != -1) {
						// console.log("这是res\n");
						// console.log(res);
						res.datas.forEach((item, index) => {
							item.index = index + 1;
							//console.log(item)
						})
						this.companyList = res.datas;
						this.total = this.companyList.length;
						this.listLoading = false;
					}

				})
			},
			refresh() {
				this.inputData="";
				this.init()
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
				//console.log(this.temp)
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
						//this.list.splice(scope.$index, 1)
						this.$message({
							message: '删除成功',
							type: 'success'
						})
					}, 300)
					this.temp = deepClone(scope.row);
					let deldata = this.temp;
					deldata.companyTime=Date.parse(new Date(this.temp.companyTime));
					deleteCompany(deldata).then((res) => {
						if (res != -1) {						
							this.init()
						}
					})
				})
			},
			submit() {
				if (this.listLoading) {
					return
				}
				let data = this.temp;
				data.companyTime = Date.parse(new Date(this.temp.companyTime));
				if (this.dialogType == 'modify') {
					update(data).then((res) => {
						if (res != -1) {
							this.$message({
								message: '提交成功',
								type: 'success'
							})
							this.dialogVisible = false
							this.init()
						}
					})
				} else {
					insert(data).then((res) => {
						if (res != -1) {
							this.$message({
								message: '提交成功',
								type: 'success'
							})
							this.dialogVisible = false
							this.init()
						}
					})
				}
			},
			search() {
				let company = {
					companyName: this.inputData
				}
				this.listLoading = true;
				queryByName(company).then((res) => {
					if (res != -1) {
						// console.log(company);
						res.datas.forEach((item, index) => {
							item.index = index + 1;
							//console.log(item)
						})
						this.companyList = res.datas;
						this.total=this.companyList.length;
						this.cur_page=1;
						this.listLoading = false;
					}
				})
			},
			// 分页导航改变页码大小在method里定义
			handleSizeChange(val) {
				this.pageSize = val;
				this.cur_page = 1;
				//console.log(this.companyList.slice((this.cur_page - 1) * this.pageSize, this.cur_page * this.pageSize));
			},
			// 分页导航
			handleCurrentChange(val) {
				//console.log(val);
				this.cur_page = val;
				//console.log(this.cur_page);
				//console.log(this.companyList.slice((this.cur_page - 1) * this.pageSize, this.cur_page * this.pageSize));
			}
		},

		mounted() {
			this.$nextTick(() => {
				this.init();
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
	.w-200 {
		width: 200px;
	}

	.filter-item {
		display: inline-flex;
		vertical-align: middle;
		margin-bottom: 10px;
	}
</style>
