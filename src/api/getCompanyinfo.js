import request from '../utils/request.js'

	
export function queryByName(data){
	return request({
		url: '/companyinfo/queryByName',//请求接口
		method: 'post',//请求方式
		data
	})
}