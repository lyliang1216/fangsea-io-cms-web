import request from '@/utils/request'

// 获取损益类别 损益列表id传0，分红列表传损益列表的id
export function queryProfitCategory (data) {
    return request({
        url: '/cms/profit/category/query',
        method: 'post',
        data
    })
}

// 获取项目ticker
export function queryTicker (data) {
    return request({
        url: '/pto/cms/complete/list',
        method: 'post',
        data
    })
}

// 获取损益状态
export function queryStates (data) {
    return request({
        url: '/cms/profit/state/query',
        method: 'post',
        data
    })
}

// 获取损益列表
export function queryDetailsList (data) {
    return request({
        url: '/cms/profit/list/query',
        method: 'post',
        data
    })
}
