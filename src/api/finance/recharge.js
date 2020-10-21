import request from '@/utils/request'

// 充值记录查询
export function rechargeRecord (data) {
    return request({
        url: '/dc/wallet/charge/list/query',
        method: 'post',
        data
    })
}

// 获取币种列表
export function getCurrency (data) {
    return request({
        url: '/wallet/currency/query',
        method: 'post',
        data
    })
}
