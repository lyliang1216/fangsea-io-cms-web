import request from '@/utils/request'

// 获取认购订单列表
export function getReleaseOrderList (data) {
    return request({
        url: '/dc/pto/invest/order/list',
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
