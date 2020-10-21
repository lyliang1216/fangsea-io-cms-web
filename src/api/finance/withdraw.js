import request from '@/utils/request'

// 获取提现列表
export function getWithdrawList (data) {
    return request({
        url: '/dc/cms/wallet/withdraw/apply/query',
        method: 'post',
        data
    })
}

// 是否通过提现审核
export function approvedWithdraw (data) {
    return request({
        url: '/cms/wallet/withdraw/check',
        method: 'post',
        data
    })
}

// 查询提现加速按钮是否可用
export function getWithdrawAccelerateStatus (data) {
    return request({
        url: '/cms/wallet/withdraw/accelerate/status',
        method: 'post',
        data
    })
}

// 点击提现加速校验加速信息
export function checkWithdrawCashImmediately (data) {
    return request({
        url: '/cms/wallet/withdraw/accelerate/check',
        method: 'post',
        data
    })
}

// 立即加速
export function WithdrawCashImmediately (data) {
    return request({
        url: '/cms/wallet/withdraw/accelerate',
        method: 'post',
        data
    })
}
