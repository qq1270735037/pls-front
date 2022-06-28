import request from '../utils/request.js'

	
export function selectAll(){
	return request({
		url: '/buildinfo/selectAll',//请求接口
		method: 'post',//请求方式
	})
}
export function getBuildAndAddress(){
	return request({
		url: '/buildinfo/getBuildAndAddress',//请求接口
		method: 'post',//请求方式
	})
}

export function getBuildByName(data){
	return request({
		url: '/buildinfo/getBuildByName',//请求接口
		method: 'post',//请求方式
		data
	})
}
export function queryByCondition(data){
	return request({
		url: '/addressinfo/queryByCondition',//请求接口
		method: 'post',//请求方式
		data
	})
}
export function edit(data){
	return request({
		url: '/buildinfo/edit',//请求接口
		method: 'post',//请求方式
		data
	})
}
export function addByName(data){
	return request({
		url: '/buildinfo/add',//请求接口
		method: 'post',//请求方式
		data
	})
}
export function deleteById(data){
	return request({
		url: '/buildinfo/deleteById',//请求接口
		method: 'post',//请求方式
		data
	})
}