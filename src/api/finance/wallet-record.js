import request from '@/utils/request'

// 获取转账记录列表
export function getrecordlist (data) {
    return request({
        url: '/dc/wallet/transfer/record/list',
        method: 'post',
        data
    })
}

// 获取币种列表
export function getcurrencylist (data) {
    return request({
        url: '/wallet/currency/front/query',
        method: 'post',
        data
    })
}

// 获取用途
export function getusetypelist (data) {
    return request({
        url: '/wallet/usage/type/query',
        method: 'post',
        data
    })
}
