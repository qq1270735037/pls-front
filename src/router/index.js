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
import certification from "@/page/basicInfoManage/certification";
import material from "@/page/basicInfoManage/material";

import buildManage from "@/page/buyAndSaleManage/buildManage";
import materialManage from "@/page/buyAndSaleManage/materialManage";
import carManage from "@/page/buyAndSaleManage/carManage";
import goodsManage from "@/page/buyAndSaleManage/goodsManage";
import officeSupplies from "@/page/buyAndSaleManage/officeSupplies";

import carFixLog from "@/page/carFix/carFixLog";
import materialUseLog from "@/page/carFix/materialUseLog";

import carOperation from "@/page/transportationSchedule/carOperation";
import carrierBusiness from "@/page/transportationSchedule/carrierBusiness";

import advertisement from "@/page/cooperation/advertisement";
import communication from "@/page/cooperation/communication";

import common from "@/page/commonUser/common";
import ad from "@/page/commonUser/ad";
import companyInformation from "@/page/commonUser/ad";

import test from "@/page/test"
Vue.use(Router);

export default new Router({
	mode: "history",
	routes: [{
			path: '/test',
			name: 'test',
			component: ad
		},
		{
			path: '/login',
			name: 'login',
			component: login
		},
		{
			path: '/',
			name: 'home',
			component: home,
			redirect: "/mainPage",
			children: [{
					path: '/mainPage',
					name: 'mainPage',
					component: mainPage,
					meta: {
						title: '首页'
					}
				},
				{
					path: '/basicInfoManage',
					name: 'basicInfoManage',
					component: basic,
					redirect: "/employee",
					meta: {
						title: '基本信息'
					},
					children: [{
							path: '/address',
							name: 'address',
							component: address,
							meta: {
								title: '地址信息'
							},
						},
						{
							path: '/build',
							name: 'build',
							component: build,
							meta: {
								title: '建筑信息'
							},
						},
						{
							path: '/car',
							name: 'car',
							component: car,
							meta: {
								title: '车辆信息'
							},
						},
						{
							path: '/company',
							name: 'company',
							component: company,
							meta: {
								title: '公司信息'
							},
						},
						{
							path: '/employee',
							name: 'employee',
							component: employee,
							meta: {
								title: '人员信息'
							},
						},
						{
							path: '/equipment',
							name: 'equipment',
							component: equipment,
							meta: {
								title: '机电设备'
							},
						},
						{
							path: '/goods',
							name: 'goods',
							component: goods,
							meta: {
								title: '货物信息'
							},
						},
						{
							path: '/certification',
							name: 'certification',
							component: certification,
							meta: {
								title: '证件信息'
							},
						},
						{
							path: '/material',
							name: 'material',
							component: material,
							meta: {
								title: '物资信息'
							},
						}
					]
				},
				{
					path: '/buyAndSaleManage',
					name: 'buyAndSaleManage',
					component: basic,
					//redirect: "/officeSupplies",
					meta: {
						title: '购销管理'
					},
					children: [{
							path: '/buildManage',
							name: 'buildManage',
							component: buildManage,
							meta: {
								title: '建筑租售'
							}
						},
						{
							path: '/materialManage',
							name: 'materialManage',
							component: materialManage,
							meta: {
								title: '物资购销'
							}
						},
						{
							path: '/carManage',
							name: 'carManage',
							component: carManage,
							meta: {
								title: '汽车购销'
							}
						},
						{
							path: '/goodsManage',
							name: 'goodsManage',
							component: goodsManage,
							meta: {
								title: '货物购销'
							}
						},
						{
							path: '/officeSupplies',
							name: 'officeSupplies',
							component: officeSupplies,
							meta: {
								title: '办公耗材购买'
							}
						}
					]
				},
				{
					path: '/carFix',
					name: 'carFix',
					component: basic,
					//redirect: "/officeSupplies",
					meta: {
						title: '汽车修检'
					},
					children: [{
							path: '/carFixLog',
							name: 'carFixLog',
							component: carFixLog,
							meta: {
								title: '车辆维修记录'
							}
						},
						{
							path: '/materialUseLog',
							name: 'materialUseLog',
							component: materialUseLog,
							meta: {
								title: '物资使用记录'
							}
						}
					]
				},
				{
					path: '/transportationSchedule',
					name: 'transportationSchedule',
					component: basic,
					//redirect: "/officeSupplies",
					meta: {
						title: '运输调度'
					},
					children: [{
							path: '/carOperation',
							name: 'carOperation',
							component: carOperation,
							meta: {
								title: '单车运营记录'
							}
						},
						{
							path: '/carrierBusiness',
							name: 'carrierBusiness',
							component: carrierBusiness,
							meta: {
								title: '承运商业务记录'
							}
						}
					]
				},
				{
					path: '/cooperation',
					name: 'cooperation',
					component: basic,
					//redirect: "/officeSupplies",
					meta: {
						title: '对外合作'
					},
					children: [{
							path: '/communication',
							name: 'communication',
							component: communication,
							meta: {
								title: '信息交流'
							}
						},
						{
							path: '/advertisement',
							name: 'advertisement',
							component: advertisement,
							meta: {
								title: '广告信息交流'
							}
						}
					]
				}
			]
		},
		{
			path: '/common',
			name: 'common',	
			component: common,
			children: [{
				path: '/ad',
				name: 'ad',
				component: ad
			},
			{
				path:'aboutUs',
				name:'aboutUs',
				component: companyInformation
			}]
		}
	]
});
