import request from '../utils/request.js'

//获取所有carinfo，
export function queryByCondition(data){
    return request({
        url: '/merchandiseinfo/queryByCondition',//请求接口
        method: 'post',//请求方式
        data
    })
}
//新增
export function add(data){
    return request({
        url: '/merchandiseinfo/add',//请求接口
        method: 'post',//请求方式
        data
    })
}
//修改
export function update(data){
    return request({
        url: '/merchandiseinfo/update',//请求接口
        method: 'post',//请求方式
        data
    })
}
export function deleteById(data){
    return request({
        url: '/merchandiseinfo/deleteById',//请求接口
        method: 'post',//请求方式
        data
    })
}