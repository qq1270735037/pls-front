import request from '../utils/request.js'


export function queryByCondition(data){
    return request({
        url: '/transportationinfo/queryByCondition',//请求接口
        method: 'post',//请求方式
        data
    })
}

export function addTransportation(data) {
    return request({
        url: '/transportationinfo/add',
        method: 'post',
        data
    })
}
export function updateTransportation(data){
    return request({
        url: '/transportationinfo/update',//请求接口
        method: 'post',//请求方式
        data
    })
}

export function deleteTransportation(data){
    return request({
        url: '/transportationinfo/deleteById',//请求接口
        method: 'post',//请求方式
        data
    })
}