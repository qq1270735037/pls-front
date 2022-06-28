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

		<el-table v-loading="listLoading" :data="carChangeList" element-loading-text="正在疯狂加载" border fit height="500px"
			class="table-container" highlight-current-row>
			<el-table-column label="序号" width="100" align="center">
				<template slot-scope="scope">
					{{ scope.row.index }}
				</template>
			</el-table-column>
			<el-table-column label="车辆编号" width="200" align="center">
				<template slot-scope="scope">
					{{ scope.row.carId }}
				</template>
			</el-table-column>
			<el-table-column label="车辆类型" width="180	" align="center">
				<template slot-scope="scope">
					{{ scope.row.carChangeType }}
				</template>
			</el-table-column>
			<el-table-column label="买卖类型" width="170" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.operation }}</span>
				</template>
			</el-table-column>
			<el-table-column label="交易单号" width="170" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.carChangeId }}</span>
				</template>
			</el-table-column>
			<!-- <el-table-column fixed="right" label="操作" width="200" align="left">
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
			</el-table-column> -->

		</el-table>
		<!-- 分页组件ui -->
		<!-- <div style="margin-top:20px" class="pagination">
			<el-pagination
			background
			@current-change="handleCurrentChange"
			@size-change="handleSizeChange"
			:current-page="cur_page"
			:page-sizes="[10,15,20,50]"
			:page-size="pageSize"
			layout="total, sizes, prev, pager, next, jumper"
			:total="total"
			></el-pagination>
		</div> -->
		<!-- <el-dialog :visible.sync="dialogVisible" :title="dialogType === 'modify' ? '修改' : '新增'">
			<el-form ref="dataForm" :model="temp" label-width="150px" label-position="right">
				<el-form-item label="交易单号">
					<el-input v-model="temp.carChangeId" placeholder="请输入名称" />
				</el-form-item>
				<el-form-item label="交易车辆">
					<el-input v-model="temp.carId" placeholder="请输入时间(yyyy-MM-dd)" />
				</el-form-item>
				<el-form-item label="车辆类型">
					<el-input v-model="temp.carChangeType" placeholder="请输入公司所在地址" />
				</el-form-item>
				<el-form-item label="买卖类型">
					<el-input v-model="temp.operation" placeholder="请输入公司规模" />
				</el-form-item>
			</el-form>
			<el-button type="danger" @click="dialogVisible = false">
				取消
			</el-button>
			<el-button type="primary" @click="submit()">
				确定
			</el-button>
		</el-dialog> -->
		<el-table v-loading="listLoading" :data="carList" element-loading-text="正在疯狂加载" border fit height="500px"
			class="table-container" highlight-current-row>
			<el-table-column fixed label="序号" width="100" align="center">
				<template slot-scope="scope">
					{{ scope.row.index }}
				</template>
			</el-table-column>
			<el-table-column fixed label="车牌号" width="200" align="center">
				<template slot-scope="scope">
					{{ scope.row.carNumber }}
				</template>
			</el-table-column>
			<el-table-column label="车型" width="180	" align="center">
				<template slot-scope="scope">
					{{ scope.row.carStyle }}
				</template>
			</el-table-column>
			<el-table-column label="车辆载重(单位:吨)" width="170" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.carLoad }}</span>
				</template>
			</el-table-column>
			<el-table-column label="车辆里程数(单位:千米)" width="200" align="center">
				<template slot-scope="scope">
					{{ scope.row.carMileage }}
				</template>
			</el-table-column>
			<el-table-column label="车辆品牌" width="160" align="center">
				<template slot-scope="scope">
				 {{ scope.row.carBrand }}
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
		<el-pagination style="margin-top: 10px;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
			:current-page="listQuery.page" :page-sizes="[10, 20, 50, 100]" :page-size="200"
			layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total">
		</el-pagination>
	</div>

</template>

<script>
	import {
		setStorage,
		getStorage
	} from "@/utils/localStorage.js";
	import {
		deepClone
	} from "@/utils/index.js";
	import {
		queryByPage,
		add,
		update,
		deleteById
	} from '@/api/getCarinfo.js';
	const _temp = {
		carChangeId: '', //交易单号
		carId: '', //交易车辆编号
		carChangeType: '', //车辆类型
		operation: '' //操作类型：买or卖
	}
	export default {
		data() {
			return {
				listLoading: true, //查询时加载遮罩
				inputData: "",
				carChangeList: [],
				temp: Object.assign({}, _temp),
				dialogVisible: false, //弹出框显示
				dialogType: 'create',
				// cur_page: 1,
				// pageSize: 10,
				// //数据条数
				// total :0,
				listQuery: { // 查询的数据
					limit: 10, //每页条数
					page: 1, //当前页码
					total: 0, //总条数
					// carNumber: "" //查询的车牌号
				},
				carList:[],
			}
		},

		methods: {
			init() {
				// this.listLoading = true;
				// queryByName({}).then((res) => {
				// 	if (res != -1) {
				// 		// console.log("这是res\n");
				// 		// console.log(res);
				// 		res.datas.forEach((item, index) => {
				// 			item.index = index + 1;
				// 			//console.log(item)
				// 		})
				// 		this.companyList = res.datas;
				// 		this.total=this.companyList.length;
				// 		this.listLoading = false;
				// 	}

				// })
			},
			refresh() {
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
					// deldata.companyTime=Date.parse(new Date(this.temp.companyTime));
					deleteCompany(deldata).then((res) => {
						if (res != -1) {
							// this.$message({
							// 	message: '删除成功',
							// 	type: 'success'
							// })
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
							console.log(item)
						})
						this.companyList = res.datas;
						this.listLoading = false;
					}
				})
			},
			// 分页导航改变页码大小在method里定义
			handleSizeChange(val) {
				this.pageSize = val;
				this.cur_page = 1;
				// console.log(this.companyList.slice((this.cur_page-1)*this.pageSize,this.cur_page*this.pageSize));
			},
			// 分页导航
			handleCurrentChange(val) {
				this.cur_page = val;
			}
		},

		mounted() {
			this.$nextTick(() => {
				this.init();

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
