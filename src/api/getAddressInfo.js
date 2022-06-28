import request from '../utils/request.js'

	
export function queryByCondition(data){
	return request({
		url: '/addressinfo/queryByCondition',//请求接口
		method: 'post',//请求方式
		data
	})
}

export function addAddress(data) {
	return request({
		url: '/addressinfo/add',
		method: 'post',
		data
	})
}
export function update(data){
	return request({
		url: '/addressinfo/update',//请求接口
		method: 'post',//请求方式
		data
	})
}

export function deleteAddress(data){
	return request({
		url: '/addressinfo/deleteById',//请求接口
		method: 'post',//请求方式
		data
	})
}