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
