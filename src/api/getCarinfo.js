import request from '../utils/request.js'

//获取所有carinfo，有分页
export function queryByPage(data){
	return request({
		url: '/carinfo/queryByPage',//请求接口
		method: 'post',//请求方式
		data
	})
}