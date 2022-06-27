<template>
	<div>
		<h1>首页</h1>
	</div>
</template>

<script>
	import { getUserCount,getUserEChartsData,getCategoryEChartsData } from '@/api/getData.js';
	import { setStorage, getStorage} from "@/utils/localStorage.js";
	//引入面包屑组件
	
	export default {
		
		data() {
			return {
				userCount: "*******",
				//用户图表配置
				userOption: {
					title: {
						text: '用户类型统计分析图表',
						subtext: '用户类型分析'
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						}
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: [
						{
							type: 'category',
							data: [],
							axisTick: {
								alignWithLabel: true
							}
						}
					],
					yAxis: [
						{
							type: 'value'
						}
					],
					series: [
						{
							name: '用户数量',
							type: 'bar',
							barWidth: '60%',
							data: []
						}
					]
				},
				//文档图表配置
				docOption: {
				    legend: {
				        top: 'bottom'
				    },
				    title: {
				        text: '文档类型统计分析图表',
				        subtext: '文档类型分析',
				        left: 'left'
				    },
				    tooltip: {
				        trigger: 'item',
				        formatter: '{a} <br/>{b} : {c} ({d}%)'
				    },
				    toolbox: {
				        show: true,
				        feature: {
				            mark: { show: true },
				            dataView: { show: true, readOnly: false },
				            restore: { show: true },
				            saveAsImage: { show: true }
				        }
				    },
				    series: [
				        {
				            name: '文档数量',
				            type: 'pie',
				            radius: [50, 250],
				            center: ['50%', '50%'],
				            roseType: 'area',
				            itemStyle: {
				                borderRadius: 8
				            },
				            data: []
				        }
				    ]
				}
			}
		},
		methods: {
			//获取用户总数量
			getUserCount(){
				getUserCount().then(res => {
					if(res != -1){
						this.userCount = res.total;
					}
				})
			},
			//获取用户图表数据
			getUserEChartsData(){
				getUserEChartsData().then(res => {
					if(res != -1){
						//遍历返回的数据封装渲染图表需要的数据
						res.datas.forEach(item => {
							//数据名称
							this.userOption.xAxis[0].data.push(item.authorityName);
							//数量
							this.userOption.series[0].data.push(item.authorityCount);
						});
						//渲染图表
						let userEcharts = this.$echarts.init(document.getElementById("userEcharts"), 'dark');
						userEcharts.setOption(this.userOption);
					}
				})
			},
			//获取文档类型图表数据
			getCategoryEChartsData(){
				getCategoryEChartsData().then(res => {
					if(res != -1){
						//遍历返回的数据,封装图表需要的数据
						res.datas.forEach(item => {
							let data = {
								value: item.categoryCount,//数量
								name: item.categoryName//数据名称
							}
							//放入渲染图表需要的数据
							this.docOption.series[0].data.push(data);
						});
						//渲染图表
						let docEcharts = this.$echarts.init(document.getElementById("docEcharts"), 'dark');
						docEcharts.setOption(this.docOption);
					}
				});
			}
			
		},
		mounted() {
			//获取用户总数量
			this.getUserCount();
			//初始化用户图表
			this.getUserEChartsData();
			//初始化文档图表
			this.getCategoryEChartsData();
		}
	}
</script>

<style>
  .text {
    font-size: 14px;
  }

  .item {
    padding: 0px 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
  }

  .box-card {
    width: 370px;
	margin-right: 100px;
	background-color: rgb(16,12,42) !important;
  }
  .card-text{
	  margin-bottom: 10px;
  }
  .box-card-last {
    width: 370px;
	background-color: rgb(16,12,42) !important;
  }
  .main-top-card{
	  display: flex;
	  justify-content: center;
	  
  }
  .card-num{
	  font-size: 18px;
	  font-weight: bolder;
	  color: white;
  }
  .icon-size{
	  font-size: 45px;
  }
  .icon-color-doc{
	color:rgb(54,163,247)
  }
  .icon-color-user{
	color:rgb(64,201,198)
  }
  .icon-color-user-type{
  	color:rgb(244,81,108)
  }
  .icon-color-doc-type{
  	color:rgb(52,191,163)
  }
  
  /* 图表css*/
  .echarts-div{
	  margin-top: 50px;
	  display: flex;
	  justify-content: center;
	  background-color: rgb(16,12,42);
  }
  .box-card-echarts{
	  width: 840px;
	  margin-right: 100px;
	  height: 600px;
	  background-color: rgb(16,12,42) !important;
  }
  .box-card-echarts-last{
  	  width: 840px;
	   height: 600px;
	   background-color: rgb(16,12,42) !important;
  }
  .echarts-render{
	  background-color: rgb(16,12,42);
	  width: 740px;
	   height: 550px;
  }
</style>