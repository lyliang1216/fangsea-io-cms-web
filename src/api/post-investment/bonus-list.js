import request from '@/utils/request'

// 获取赠币列表
export function getCoinList (data) {
    return request({
        url: '/cms/present/list/query',
        method: 'post',
        data
    })
}

// 获取项目列表
export function getProjectList (data) {
    return request({
        url: '/pto/complete/list',
        method: 'post',
        data
    })
}
