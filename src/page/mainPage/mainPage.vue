<template>
    <div>
        <div style="background-color: rgb(255, 255, 255);padding: 10px;height: 500px;">

            <!-- 数量统计 -->
            <div class="main-top-card" >

                <el-card class="box-card"  style="background-image: repeating-linear-gradient(122.5deg,rgb(255,253,20) -11.3%, rgba(214,49,102,1) 99.5%, rgba(43,60,194,1) 0, rgba(80,141,133, 0) 137.2%);">
                    <div  class="text item">
                        <div><i class="el-icon-user-solid icon-size icon-color-user"></i></div>
                        <div>
                            <div class="card-text card-num">用户总数</div>
                            <div class="card-num">{{userCount}}</div>
                        </div>
                    </div>
                </el-card>
                <el-card class="box-card" style="background-image: repeating-linear-gradient(304.9deg,rgb(255,253,20) -13.7%, rgba(4,202,223,1) 99.5%, rgba(131,194,43,1) 0, rgba(80,141,133, 0) 112.4%);">
                    <div  class="text item">
                        <div><i class="el-icon-document icon-size icon-color-doc"></i></div>
                        <div>
                            <div class="card-text card-num">订单总数</div>
                            <div class="card-num">{{totalOrder}}</div>
                        </div>
                    </div>
                </el-card>
                <el-card class="box-card" style="background-image: repeating-linear-gradient(303.8deg,rgba(253,253,192,1) -13.4%, rgba(189,68,204,1) 96.1%, rgba(80,141,133,0) 115.9%);">
                    <div  class="text item">
                        <div><i class="el-icon-s-flag icon-size icon-color-user-type"></i></div>
                        <div>
                            <div class="card-text card-num">销售额</div>
                            <div class="card-num">666666</div>
                        </div>
                    </div>
                </el-card>

            </div>
            <!-- 数量统计结束 -->

            <el-row style="margin-top: 15px;">
                <el-col :span="7">
                    <div >
                        <el-card class="box-card-echarts" >
                            <div class="text item echarts-render" v-loading="waitcharts" element-loading-text="正在疯狂加载" id="typeEcharts">

                            </div>
                        </el-card>
                    </div>
                </el-col>
                <el-col :span="7" >
                    <div class="grid-content">
                        <el-card class="box-card-echarts">
                            <div  class="text item echarts-render" id="moneyEcharts">

                            </div>
                        </el-card>
                    </div>
                </el-col>
                <el-col :span="8"><div class="grid-content " >
                    <div class="grid-content">
                        <el-card class="box-card-echarts-last" id="transporEcharts">
                            <div  >
                                11111
                            </div>
                        </el-card>
                    </div>
                </div>
                </el-col>
            </el-row>
			<div class="box-card-echarts-last1" id="global"></div>
        </div>
        
    </div>
</template>

<script>
    import { queryTotal } from '@/api/getUser.js';
	import {
		queryByCondition,
		selectByName,
		getByOperation,
		queryByCondition1
	} from "@/api/mainPage.js";
    import { setStorage, getStorage} from "@/utils/localStorage.js";
    //引入面包屑组件

    export default {
		
        data() {
            return {
				
				//遮罩
				waitcharts:true,
				//订单总数
				totalOrder:'0',
                //用户总数
                userCount:'',
				//订单类型数据
                typeoption :{
                    title: {
                        text: '订单类型 ',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        show:false,

                    },
                    series: [
                        {
                            avoidLabelOverlap: true,
                            name: 'Access From',
                            type: 'pie',
                            radius: '50%',
                            data: [],
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                },
				//
                moneyoption : {
                    title: {
                        text: 'Funnel',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c}'
                    },
                    toolbox: {
                        feature: {
                            // dataView: { readOnly: false },
                            // restore: {},
                            // saveAsImage: {}
                        }
                    },
                    legend: {
                        data: ['物资', '货物', '汽车', '运输'],
                        show:false,
                    },
                    series: [
                        {
                            avoidLabelOverlap: true,
                            name: 'Funnel',
                            type: 'funnel',
                            left: '10%',
                            top: 40,
                            bottom: 60,
                            width: '80%',
                            min: 0,
                            max: 100,
                            minSize: '0%',
                            maxSize: '100%',
                            sort: 'descending',
                            gap: 2,
                            label: {
                                show: true,
                                position: 'inside'
                            },
                            labelLine: {
                                length: 10,
                                lineStyle: {
                                    width: 1,
                                    type: 'solid'
                                }
                            },
                            itemStyle: {
                                borderColor: '#fff',
                                borderWidth: 1
                            },
                            emphasis: {
                                label: {
                                    fontSize: 20
                                }
                            },
                            data: [
                                { value: 60, name: 'Visit' },
                                { value: 40, name: 'Inquiry' },
                                { value: 20, name: 'Order' },
                                { value: 80, name: 'Click' },
                                { value: 100, name: 'Show' }
                            ]
                        }
                    ]
                },
				//运输利润数据
                transporoption : {
					title: {
					    text: '运输利润',
					    left: 'center'
					},
                  tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                      type: 'line',
                      lineStyle: {
                        color: 'rgba(0,0,0,0.2)',
                        width: 1,
                        type: 'solid'
                      }
                    }
                  },
                  legend: {
						show:false
                  },
                  singleAxis: {
                    top: 50,
                    bottom: 50,
                    axisTick: {},
                    axisLabel: {},
                    type: 'time',
                    axisPointer: {
                      animation: true,
                      label: {
                        show: true
                      }
                    },
                    splitLine: {
                      show: true,
                      lineStyle: {
                        type: 'dashed',
                        opacity: 0.2
                      }
                    }
                  },
                  series: [
                    {
                      type: 'themeRiver',
                      emphasis: {
                        itemStyle: {
                          shadowBlur: 20,
                          shadowColor: 'rgba(0, 255, 127, 0.8)'
                        }
                      },
                      data: [
                        ['2015/11/08', 10, 'DQ'],
                        ['2015/11/09', 15, 'DQ'],
                        ['2015/11/10', 35, 'DQ'],
                        ['2015/11/11', 38, 'DQ'],
                        ['2015/11/12', 22, 'DQ'],
                        ['2015/11/13', 16, 'DQ']
                      ]
                    }
                  ]
                }


            }


        },
        methods: {
            getTyprEcharts(){
				this.typeoption.series[0].data=[];
				this.transporoption.series[0].data=[];
				//用户总数
                queryTotal().then((res)=>{
                    if(res != -1){
                        this.userCount = res.datas;
                    }
                })
				//运输订单数量
				queryByCondition1({}).then((res)=>{
				  console.log(res)
				  if(res != -1){
					  this.typeoption.series[0].data.push({ value: parseInt(res.datas.length), name: '运输订单' });
						this.totalOrder =parseInt(this.totalOrder)+ parseInt(res.datas.length);
						res.datas.forEach((item, index) => {
							this.transporoption.series[0].data.push([item.transportationStartTime,parseInt(item.transportationMoney),"利润"])
							
							
						})
						console.log("************")
				  }
					
				})
				//货物订单数量
				queryByCondition({}).then((res)=>{
				  if(res != -1){
				    
				    this.totalOrder =parseInt(this.totalOrder)+ parseInt(res.datas.length);
				    
					// console.log("这是data");
					// console.log(this.typeoption.series[0].data);
					this.typeoption.series[0].data.push({ value: parseInt(res.datas.length), name: '货物订单' });
					
					
				  }
				
				})
				//物资订单数量
				let data = {
				  page: 1,
				  limit:1000,
				  materialName:"",
				  }
				selectByName(data).then((res)=>{
					
					if(res != -1){
							this.totalOrder =parseInt(this.totalOrder)+ parseInt(res.datas.length);
							this.typeoption.series[0].data.push({ value: parseInt(res.datas.length), name: '物资订单' });
						}
				})
				//汽车购销数量
				getByOperation({}).then((res) => {
					if (res != -1) {
						this.totalOrder =parseInt(this.totalOrder)+ parseInt(res.datas.length);
						this.typeoption.series[0].data.push({ value: parseInt(res.datas.length), name: '汽车购销' });
					}
				
				
				})
				
                
            },
			drawEcharts(){
				//饼状图数据
					let typeEcharts = this.$echarts.init(document.getElementById("typeEcharts"));
					let moneyEcharts= this.$echarts.init(document.getElementById("moneyEcharts"));
					let transporEcharts= this.$echarts.init(document.getElementById("transporEcharts"));
				//渲染图表
				setTimeout(() =>{
				 //    console.log("这是option"+this.typeoption);
					// console.log(this.typeoption);
				    typeEcharts.setOption(this.typeoption);
				    moneyEcharts.setOption(this.moneyoption);
				    transporEcharts.setOption(this.transporoption);
					console.log("+++++++++++++++++++++++++++++++");
					this.waitcharts=false
				},500);
			}



        },
        mounted() {
            this.getTyprEcharts();
			this.drawEcharts();
        }
    }
</script>

<style>
    .text {
        font-size: 14px;
    }

    .item {

        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .box-card {
        width: 400px;
        margin-right: 150px;

    }
    .card-text{
        margin-bottom: 10px;
    }
    .box-card-last {
        width: 370px;
        /* background-color: rgb(16,12,42) !important; */
    }
    .main-top-card{
        display: flex;

    }
    .card-num{
        font-size: 15px;
        font-weight: bolder;
        color: white;
    }
    .icon-size{
        font-size: 45px;
    }
    .icon-color-doc{
        color:rgb(170, 85, 0)
    }
    .icon-color-user{
        color:rgb(18, 116, 201)
    }
    .icon-color-user-type{
        color:rgb(244, 31, 45)
    }


    /* 图表css*/

    .box-card-echarts{

        width: 350px;
        margin-right: 0px;
        height: 250px;
    }
    .box-card-echarts-last{
        width: 540px;
        height: 250px;
        background-color: rgb(255, 255, 255) !important;
    }
	.box-card-echarts-last1{
	    width: 1140px;
	    height: 250px;
	    background-color: rgb(246, 255, 212) !important;
	}
    .echarts-render{
        background-color: rgb(255, 255, 255);
        width: 300px;
        height: 250px;
    }
    .grid-content {
        border-radius: 20px;
        min-height: 36px;
    }
</style>