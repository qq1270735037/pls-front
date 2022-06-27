import Vue from "vue";
import Router from "vue-router";
import home from "@/page/home";
import login from "@/page/login/login";
import mainPage from "@/page/mainPage/mainPage";
import managerPage from "@/page/managerPage/managerPage";
import docManager from "@/page/managerPage/docManager";

import basic from "@/page/basicInfoManage/basic"
import address from "@/page/basicInfoManage/address";
import build from "@/page/basicInfoManage/build";
import car from "@/page/basicInfoManage/car";
import company from "@/page/basicInfoManage/company";
import employee from "@/page/basicInfoManage/employee";
import equipment from "@/page/basicInfoManage/equipment";
import goods from "@/page/basicInfoManage/goods";
import identity from "@/page/basicInfoManage/identity";
import material from "@/page/basicInfoManage/material";

import buildManage from "@/page/buyAndSaleManage/buildManage";
import materialManage from "@/page/buyAndSaleManage/materialManage";
import carManage from "@/page/buyAndSaleManage/carManage";
import goodsManage from "@/page/buyAndSaleManage/goodsManage";
import officeSupplies from "@/page/buyAndSaleManage/officeSupplies";


import test from "@/page/test"
Vue.use(Router);

export default new Router({
	mode: "history",
	routes: [
		{
			  path:'/test',
			  name:'test',
			  component:test
		},
		{
			  path:'/login',
			  name:'login',
			  component:login
		},
		{
			  path:'/',
			  name:'home',
			  component:home,
			  redirect: "/mainPage",
			  children:[
				{
					path:'/mainPage',
					name:'mainPage',
					component:mainPage,
					meta: {
						title:'首页'
					}
				},
				{
					  path:'/basicInfoManage',
					  name:'basicInfoManage',
					  component:basic,
					  redirect: "/employee",
					  meta: {
					  	title:'基本信息'
					  },
					  children: [
						  {
						  	  path:'/address',
						  	  name:'address',
						  	  component:address,
							  meta: {
							  	title:'地址信息'
							  },
						  },
						  {
						  	  path:'/build',
						  	  name:'build',
						  	  component:build,
							  meta: {
							  	title:'建筑信息'
							  },
						  },
						  {
						  	  path:'/car',
						  	  name:'car',
						  	  component:car,
							  meta: {
							  	title:'车辆信息'
							  },
						  },
						  {
						  	  path:'/company',
						  	  name:'company',
						  	  component:company,
							  meta: {
							  	title:'公司信息'
							  },
						  },
						  {
						  	  path:'/employee',
						  	  name:'employee',
						  	  component:employee,
							  meta: {
							  	title:'人员信息'
							  },
						  },
						  {
						  	  path:'/equipment',
						  	  name:'equipment',
						  	  component:equipment,
							  meta: {
							  	title:'机电设备'
							  },
						  },
						  {
						  	  path:'/goods',
						  	  name:'goods',
						  	  component:goods,
							  meta: {
							  	title:'货物信息'
							  },
						  },
						  {
						  	  path:'/identity',
						  	  name:'identity',
						  	  component:identity,
							  meta: {
							  	title:'证件信息'
							  },
						  },
						  {
						  	  path:'/material',
						  	  name:'material',
						  	  component:material,
							  meta: {
							  	title:'物资信息'
							  },
						  }
					  ]
				},
				{
					path:'/buyAndSaleManage',
					name:'buyAndSaleManage',
					component:basic,
					//redirect: "/officeSupplies",
					meta: {
						title:'购销管理'
					},
					children: [
						{
							path:'/buildManage',
							name:'buildManage',
							component:buildManage,
							meta: {
								title:'建筑租售'
							}
						},
						{
							path:'/materialManage',
							name:'materialManage',
							component:materialManage,
							meta: {
								title:'物资购销'
							}
						},
						{	
							path:'/carManage',
							name:'carManage',
							component:carManage,
							meta: {
								title:'汽车购销'
							}
						},
						{
							path:'/goodsManage',
							name:'goodsManage',
							component:goodsManage,
							meta: {
								title:'货物购销'
							}
						},
						{
							path:'/officeSupplies',
							name:'officeSupplies',
							component:officeSupplies,
							meta: {
								title:'办公耗材购买'
							}
						}		
					]
				}

			  ]
		}
	]
});