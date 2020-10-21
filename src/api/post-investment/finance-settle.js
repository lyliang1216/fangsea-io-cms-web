import request from '@/utils/request'

// 获取结算按钮
export function settlementReq (data) {
    return request({
        url: '/cms/profit/bonus/clearing',
        method: 'post',
        data
    })
}

// 获取驳回按钮
export function turnDownReq (data) {
    return request({
        url: '/cms/profit/examine/reject',
        method: 'post',
        data
    })
}
