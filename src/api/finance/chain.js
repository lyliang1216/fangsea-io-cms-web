import request from '@/utils/request'

// 获取链上快照列表
export function getchain (data) {
    return request({
        url: '/wallet/chain/snapshot/list',
        method: 'post',
        data
    })
}

// 获取币种列表
export function getcurrency (data) {
    return request({
        url: '/wallet/currency/token/list',
        method: 'post',
        data
    })
}

// 获取可用的日期
export function accountSnapshotTimeQuery (data) {
    return request({
        url: '/wallet/account/snapshot/time/query',
        method: 'post',
        data
    })
}
