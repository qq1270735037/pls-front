import request from '../utils/request.js'

//获取所有carinfo，有分页
export function queryByPage(data){
	return request({
		url: '/carinfo/queryByPage',//请求接口
		method: 'post',//请求方式
		data
	})
}
//新增
export function add(data){
	return request({
		url: '/carinfo/add',//请求接口
		method: 'post',//请求方式
		data
	})
}
//修改
export function update(data){
	return request({
		url: '/carinfo/update',//请求接口
		method: 'post',//请求方式
		data
	})
}
export function deleteById(data){
	return request({
		url: '/carinfo/deleteById',//请求接口
		method: 'post',//请求方式
		data
	})
}