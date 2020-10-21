import request from '@/utils/request'

// 获取所有资料信息
export function getAllproject (data) {
    return request({
        url: '/pto/all/get',
        method: 'post',
        data
    })
}

// 获取基础信息
export function getBase (data) {
    return request({
        url: '/pto/base/get',
        method: 'post',
        data
    })
}

// 获取发行人资料
export function getIssuer (data) {
    return request({
        url: '/pto/issuer/get',
        method: 'post',
        data
    })
}

// 获取项目资料
export function getMaterial (data) {
    return request({
        url: '/pto/material/get',
        method: 'post',
        data
    })
}

// 用userid查usercode
export function getUsercode (data) {
    return request({
        url: '/user/info/id/query',
        method: 'post',
        data
    })
}
