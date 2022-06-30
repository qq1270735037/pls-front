<template>
	<div>
		<el-select v-model="selectValue" placeholder="请选择类型" size="small"
			style="margin-right: 40px;margin-top: 20px;margin-bottom: 20px;" @change="search()">
			<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
			</el-option>
		</el-select>
		<!-- <el-input style="width: 190px;margin-right: 40px;margin-top: 20px;margin-bottom: 20px;" v-model="selectValue"
			size="small" placeholder="请输入买卖类型" clearable class="filter-item" /> -->
		<el-button-group style="margin-right: 20px;margin-top: 20px;margin-bottom: 20px;" class="filter-item">
			<!-- <el-button size="small" type="primary" icon="el-icon-search" @click="search()">
				搜索
			</el-button> -->
			<el-button size="small" type="primary" icon="el-icon-refresh" @click="refresh()">
				刷新
			</el-button>
			<el-button size="small" type="primary" icon="el-icon-plus" @click="add()">
				买入
			</el-button>
			<el-button size="small" type="primary" icon="el-icon-plus" @click="sale()">
				卖出
			</el-button>
		</el-button-group>
		<el-tag type="success">tips:买卖类型（1：买入；0：卖出）</el-tag>
		<el-table v-loading="listLoading" :data="carChangeList.slice((cur_page-1)*pageSize,cur_page*pageSize)"
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
			<el-table-column label="车辆类型" width="180	" align="center">
				<template slot-scope="scope">
					{{ scope.row.carChangeType }}
				</template>
			</el-table-column>
			<el-table-column label="买卖类型" width="170" align="center">
				<template slot-scope="scope">
					<span>{{  parseInt(scope.row.operation) === 1 ? '买入' : '卖出' }}</span>
				</template>
			</el-table-column>
			<el-table-column label="交易单号" width="170" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.carChangeId }}</span>
				</template>
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="200" align="left">
				<template slot-scope="scope">
					<el-button-group>
						<!-- <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope)">
							修改
						</el-button> -->
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
		<el-dialog :visible.sync="dialogVisible" title="买入">
			<el-form ref="dataForm" :model="temp" label-width="150px" label-position="right">
				<!-- <el-form-item label="交易单号">
					<el-input v-model="temp.carChangeId" placeholder="请输入单号" :disabled="true" />
				</el-form-item>
				<el-form-item label="交易车辆">
					<el-input v-model="temp.carId" placeholder="请输入车辆编号" />
				</el-form-item> -->
				<el-form-item label="车牌号">
				  <el-input v-model="temp.carNumber" placeholder="请输入车牌号" />
				</el-form-item>
				<el-form-item label="车型">
				  <el-input v-model="temp.carStyle" placeholder="请输入车型" />
				</el-form-item>
				<el-form-item label="车辆载重(单位:吨)">
				  <el-input v-model="temp.carLoad" placeholder="请输入车辆载重(单位:吨)" />
				</el-form-item>
				<el-form-item label="车辆里程数(单位:千米)">
				  <el-input v-model="temp.carMileage" placeholder="请输入车辆里程数(单位:千米)" />
				</el-form-item>
				<el-form-item label="车辆品牌">
				  <el-input v-model="temp.carBrand" placeholder="请输入车辆品牌" />
				</el-form-item>
				<!-- <el-form-item label="车辆类型">
					<el-input v-model="temp.carChangeType" placeholder="请输入车辆类型" />
				</el-form-item>
				<el-form-item label="买卖类型">
					<el-input v-model="temp.operation" placeholder="请输入买卖类型" />
				</el-form-item> -->
			</el-form>
			<el-button type="danger" @click="dialogVisible = false">
				取消
			</el-button>
			<el-button type="primary" @click="submit()">
				确定
			</el-button>
		</el-dialog>
		<el-dialog :visible.sync="saleDialogVisible" title="卖出">
			<el-form ref="dataForm" :model="temp" label-width="150px" label-position="right">
				<el-form-item label="交易单号">
					<el-input v-model="temp.carChangeId" placeholder="自动生成单号" :disabled="true" />
				</el-form-item>
				<el-form-item label="交易车辆">
					<el-input v-model="temp.carId" placeholder="请输入车辆编号" />
				</el-form-item>
				<el-form-item label="车辆类型">
					<el-input v-model="temp.carChangeType" placeholder="请输入车辆类型" />
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
		setStorage,
		getStorage
	} from "@/utils/localStorage.js";
	import {
		deepClone
	} from "@/utils/index.js";
	import {
		getByOperation,
		insert,
		update,
		deleteCarChange,
		saleCar
	} from '@/api/getCarChange.js';
	const _temp = {
		carChangeId: '', //交易单号
		carId: '', //交易车辆编号
		carChangeType: '', //车辆类型
		operation: '' ,//操作类型：买or卖
		carNumber: '',
		carStyle: '',
		carLoad: '',
		carMileage: '',
		carBrand: '',
	}
	export default {
		data() {
			return {
				//卖出框提示
				saleDialogVisible:false,
				//选择框
				selectValue: "",
				options: [{
					value: '1',
					label: '买'
				}, {
					value: '0',
					label: '卖'
				}],
				listLoading: true, //查询时加载遮罩
				inputData: "",
				carChangeList: [],
				temp: Object.assign({}, _temp),
				dialogVisible: false, //弹出框显示
				dialogType: '',
				cur_page: 1,
				pageSize: 10,
				//数据条数
				total: 0,
			}
		},

		methods: {
			init() {
				this.listLoading = true;
				getByOperation({}).then((res) => {
					if (res != -1) {
						res.datas.forEach((item, index) => {
							item.index = index + 1;
						})
						this.carChangeList = res.datas;
						this.total = this.carChangeList.length;
						this.listLoading = false;
					}

				})
			},
			refresh() {
				this.selectValue = "";
				this.init()
			},
			resetTemp() {
				this.temp = Object.assign({}, _temp)
			},
			add() {
				this.resetTemp()
				this.dialogVisible = true
				this.dialogType = 'buy'
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
			sale(){
				this.resetTemp()
				this.saleDialogVisible=true//让对话框可见
				this.dialogType='sale'
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
					this.temp = deepClone(scope.row);
					let deldata = this.temp;
					deleteCarChange(deldata).then((res) => {
						if (res != -1) {
							this.$message({
								message: '删除成功',
								type: 'success'
							})
							this.init()
						}
						
					})
				})
			},
			submit() {
				if (this.listLoading) {
					return
				}
				let data=this.temp;
				if (this.dialogType == 'sale') {
					data.operation=0;
					saleCar(data).then((res) => {
						if (res != -1) {
							this.$message({
								message: '提交成功',
								type: 'success'
							})
							
							this.init()
						}
						this.saleDialogVisible = false
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
				let carChange = {
					operation: this.selectValue
				}
				this.listLoading = true;
				getByOperation(carChange).then((res) => {
					if (res != -1) {
						// console.log(carChange);
						res.datas.forEach((item, index) => {
							item.index = index + 1;
							//console.log(item)
						})
						this.carChangeList = res.datas;
						this.total=this.carChangeList.length;
						this.cur_page=1;
						this.listLoading = false;
					}
				})
			},
			// 分页导航改变页码大小在method里定义
			handleSizeChange(val) {
				this.pageSize = val;
				this.cur_page = 1;
				// console.log(this.carChangeList.slice((this.cur_page-1)*this.pageSize,this.cur_page*this.pageSize));
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
