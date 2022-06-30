import request from '../utils/request.js'

//获取所有adInfo
export function queryByPage(data){
    return request({
        url: '/advertisementinfo/queryAll',//请求接口
        method: 'post',//请求方式
        data
    })
}
//新增
export function add(data){
    return request({
        url: '/advertisementinfo/add',//请求接口
        method: 'post',//请求方式
        data
    })
}
//修改
export function update(data){
    return request({
        url: '/advertisementinfo/update',//请求接口
        method: 'post',//请求方式
        data
    })
}
export function deleteById(data){
    return request({
        url: '/advertisementinfo/deleteById',//请求接口
        method: 'post',//请求方式
        data
    })
}