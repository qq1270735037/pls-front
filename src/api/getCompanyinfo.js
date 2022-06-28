import request from '../utils/request.js'

	
export function queryByName(data){
	return request({
		url: '/companyinfo/queryByName',//请求接口
		method: 'post',//请求方式
		data
	})
}
export function update(data){
	return request({
		url: '/companyinfo/updateCompany',//请求接口
		method: 'post',//请求方式
		data
	})
}
export function insert(data){
	return request({
		url: '/companyinfo/insertCompany',//请求接口
		method: 'post',//请求方式
		data
	})
}
export function deleteCompany(data){
	return request({
		url: '/companyinfo/deleteCompany',//请求接口
		method: 'post',//请求方式
		data
	})
}