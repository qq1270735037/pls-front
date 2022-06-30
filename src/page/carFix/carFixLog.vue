<template>
	<div>
		<el-input style="width: 190px;margin-right: 40px;margin-top: 20px;margin-bottom: 20px;" v-model="inputData"
			size="small" placeholder="请输入修理工姓名" clearable class="filter-item" />
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

		<el-table v-loading="listLoading" :data="fixList.slice((cur_page-1)*pageSize,cur_page*pageSize)"
			element-loading-text="正在疯狂加载" border fit height="500px" class="table-container" highlight-current-row>
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
			<el-table-column label="开始时间" width="180	" align="center">
				<template slot-scope="scope">
					{{ scope.row.fixStarttime }}
				</template>
			</el-table-column>
			<el-table-column label="结束时间" width="170" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.fixEndtime }}</span>
				</template>
			</el-table-column>
			<el-table-column label="维修工姓名" width="150" align="center">
				<template slot-scope="scope">
					{{ scope.row.fixName }}
				</template>
			</el-table-column>
			<el-table-column label="维修开销" width="160" align="center">
				<template slot-scope="scope">
					{{ scope.row.fixMoney }}
				</template>
				<!-- </el-table-column> -->
			</el-table-column>
			<el-table-column label="维修记录单号" width="100" align="center">
				<template slot-scope="scope">
					{{ scope.row.fixId }}
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
				
				<el-form-item label="车辆编号">
					<el-input v-model="temp.carId" placeholder="请输入车辆编号" />
				</el-form-item>
				<el-form-item label="开始时间">
					<!-- <el-input v-model="temp.fixStarttime" placeholder="请输入时间(yyyy-MM-dd hh-mm-ss)" /> -->
					 <el-date-picker
					      v-model="temp.fixStarttime"
					      type="datetime"
					      placeholder="选择日期时间">
					    </el-date-picker>
				</el-form-item>
				<el-form-item label="结束时间">
					<!-- <el-input v-model="temp.fixEndtime" placeholder="请输入时间(yyyy-MM-dd hh-mm-ss)" /> -->
					 <el-date-picker
					      v-model="temp.fixEndtime"
					      type="datetime"
					      placeholder="选择日期时间">
					    </el-date-picker>
				</el-form-item>
				<el-form-item label="维修工姓名">
					<el-input v-model="temp.fixName" placeholder="请输入维修工姓名" />
				</el-form-item>
				<el-form-item label="维修开销">
					<el-input v-model="temp.fixMoney" placeholder="请输入本次维修开销" />
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
		deleteFixLog //用delete不行，应该是名称被占用了
	} from '@/api/getCarFixLog.js';
	import {
		setStorage,
		getStorage
	} from "@/utils/localStorage.js";
	import {
		deepClone
	} from "@/utils/index.js";
	const _temp = {
		fixId: '',
		fixName: '',
		fixStarttime: '',
		fixEndtime: '',
		fixMoney: '',
		carId: '',
	}
	export default {
		data() {
			return {
				listLoading: true, //查询时加载遮罩
				inputData: "",
				fixList: [],
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

						res.datas.forEach((item, index) => {
							item.index = index + 1;

						})
						this.fixList = res.datas;
						this.total = this.fixList.length;
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
					deldata.fixStarttime=Date.parse(new Date(this.temp.fixStarttime));
					deldata.fixEndtime=Date.parse(new Date(this.temp.fixEndtime));
					deleteFixLog(deldata).then((res) => {
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
				data.fixStarttime=Date.parse(new Date(this.temp.fixStarttime));
				data.fixEndtime=Date.parse(new Date(this.temp.fixEndtime));
				if (this.dialogType == 'modify') {
					update(data).then((res) => {
						if (res != -1) {
							this.$message({
								message: '提交成功',
								type: 'success'
							})
							
							this.init()
						}
						this.dialogVisible = false
					})
				} else {
					insert(data).then((res) => {
						if (res != -1) {
							this.$message({
								message: '提交成功',
								type: 'success'
							})
							
							this.init()
						}
						this.dialogVisible = false
					})
				}
			},
			search() {
				let fixLog = {
					fixName: this.inputData
				}
				this.listLoading = true;
				queryByName(fixLog).then((res) => {
					if (res != -1) {

						res.datas.forEach((item, index) => {
							item.index = index + 1;
							//console.log(item)
						})
						this.fixList = res.datas;
						this.total=this.fixList.length;
						this.cur_page=1;
						this.listLoading = false;
					}
				})
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
