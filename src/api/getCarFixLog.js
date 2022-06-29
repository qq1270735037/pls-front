import request from '../utils/request.js'

	
export function queryByName(data){
	return request({
		url: '/fixinfo/getByRepairmanName',//请求接口
		method: 'post',//请求方式
		data
	})
}
export function update(data){
	return request({
		url: '/fixinfo/updateFixLog',//请求接口
		method: 'post',//请求方式
		data
	})
}
export function insert(data){
	return request({
		url: '/fixinfo/insertFixLog',//请求接口
		method: 'post',//请求方式
		data
	})
}
export function deleteFixLog(data){
	return request({
		url: '/fixinfo/deleteFixLog',//请求接口
		method: 'post',//请求方式
		data
	})
}