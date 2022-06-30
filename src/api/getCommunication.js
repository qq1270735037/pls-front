import request from '../utils/request.js'

//获取所有carinfo，有分页
export function queryByCondition(data){
    return request({
        url: '/communicationinfo/queryByCondition',//请求接口
        method: 'post',//请求方式
        data
    })
}
//新增
export function add(data){
    return request({
        url: '/communicationinfo/add',//请求接口
        method: 'post',//请求方式
        data
    })
}
//修改
export function update(data){
    return request({
        url: '/communicationinfo/update',//请求接口
        method: 'post',//请求方式
        data
    })
}
export function deleteById(data){
    return request({
        url: '/communicationinfo/deleteById',//请求接口
        method: 'post',//请求方式
        data
    })
}