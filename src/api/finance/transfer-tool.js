import request from '@/utils/request'

// 获取账户类型
export function selectAcountType (data) {
    return request({
        url: '/wallet/plat/account/type/list',
        method: 'post',
        data
    })
}

// 获取币种类型
export function selectCurrent (data) {
    return request({
        url: '/wallet/currency/query',
        method: 'post',
        data
    })
}

// 获取账户余额
export function selectBalance (data) {
    return request({
        url: '/wallet/transfer/tools/balance/query',
        method: 'post',
        data
    })
}

// 提交转账
export function commitTransfer (data) {
    return request({
        url: '/cms/wallet/internal/transfer',
        method: 'post',
        data
    })
}

// 获取项目类型
export function getProjectTypes (data) {
    return request({
        url: '/pto/complete/list',
        method: 'post',
        data
    })
}
