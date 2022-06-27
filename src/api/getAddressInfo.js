import request from '../utils/request.js'

	
export function queryByCondition(data){
	return request({
		url: '/addressinfo/queryByCondition',//请求接口
		method: 'post',//请求方式
		data
	})
}