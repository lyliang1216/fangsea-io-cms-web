import request from '@/utils/request'

// 账户快照查询
export function accountSnapshot (data) {
    return request({
        url: '/dc/wallet/account/snapshot/query',
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
