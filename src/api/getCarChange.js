import request from '../utils/request.js'

	
export function getByOperation(data){
	return request({
		url: '/carchange/getByOperation',//请求接口
		method: 'post',//请求方式
		data
	})
}
export function update(data){
	return request({
		url: '/carchange/updateCarChange',//请求接口
		method: 'post',//请求方式
		data
	})
}
export function insert(data){
	return request({
		url: '/carchange/insertCarChange',//请求接口
		method: 'post',//请求方式
		data
	})
}
export function deleteCarChange(data){
	return request({
		url: '/carchange/deleteCarChange',//请求接口
		method: 'post',//请求方式
		data
	})
}
export function saleCar(data){
	return request({
		url: '/carchange/saleCar',//请求接口
		method: 'post',//请求方式
		data
	})
}