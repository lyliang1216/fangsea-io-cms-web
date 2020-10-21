import request from '@/utils/request'

// 获取推荐人列表数据
export function getRecommenderList (data) {
    return request({
        url: '/dc/user/recommend/list',
        method: 'post',
        data
    })
}

// 获取推荐人总计信息
export function getRecommenderTotal (data) {
    return request({
        url: '/dc/user/recommend/invest/refund/total/query',
        method: 'post',
        data
    })
}

// 获取推荐人总计信息
export function getPayCueCode (data) {
    return request({
        url: '/pto/invest/currency/code/query',
        method: 'post',
        data
    })
}
