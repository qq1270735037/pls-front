import request from '../utils/request.js'

	
export function selectAll(){
	return request({
		url: '/matetialinfo/selectAll',//请求接口
		method: 'post',//请求方式
	})
}
export function selectByName(data){
	return request({
		url: '/matetialinfo/selectByName',//请求接口
		method: 'post',//请求方式
		data
	})
}
export function edit(data){
	return request({
		url: '/matetialinfo/edit',//请求接口
		method: 'post',//请求方式
		data
	})
}
export function addByName(data){
	return request({
		url: '/matetialinfo/add',//请求接口
		method: 'post',//请求方式
		data
	})
}
export function deleteById(data){
	return request({
		url: '/matetialinfo/deleteById',//请求接口
		method: 'post',//请求方式
		data
	})
}

export function getMaterialAndTypeList(data){
	return request({
		url: '/matetialinfo/getMaterialAndTypeList',//请求接口
		method: 'post',//请求方式
		data
	})
}

export function selectType(){
	return request({
		url: '/matetialinfo/selectType',//请求接口
		method: 'post',//请求方式
		
	})
}