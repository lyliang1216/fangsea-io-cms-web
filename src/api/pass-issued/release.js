import request from '@/utils/request'

// 获取通证发行列表
export function getReleaseList (data) {
    return request({
        url: '/pto/admin/list',
        method: 'post',
        data
    })
}

// 获取上市费用数据
export function getPaymentData (data) {
    return request({
        url: '/pto/payment/get',
        method: 'post',
        data
    })
}

// 修改上市费用数据
export function postPaymentData (data) {
    return request({
        url: '/pto/payment/update',
        method: 'post',
        data
    })
}

// 已支付保证金弹窗数据获取
export function getMarginPaidData (data) {
    return request({
        url: '/pto/deposit/get',
        method: 'post',
        data
    })
}
// 已支付保证金
export function marginPaid (data) {
    return request({
        url: '/pto/deposit/pay',
        method: 'post',
        data
    })
}

// 开始预售
export function startPresale (data) {
    return request({
        url: '/pto/state/start',
        method: 'post',
        data
    })
}

// 获取开始、完成、取消发行弹框表格数据
export function completeReleaseTableData (data) {
    return request({
        url: '/pto/state/tips/query',
        method: 'post',
        data
    })
}
// 获取完成发行弹框统计数据
export function completeReleaseStatistics (data) {
    return request({
        url: '/pto/state/dist/statistics/query',
        method: 'post',
        data
    })
}
// 完成发行
export function completeRelease (data) {
    return request({
        url: '/pto/state/complete',
        method: 'post',
        data
    })
}

// 取消发行
export function cancelRelease (data) {
    return request({
        url: '/pto/state/cancel',
        method: 'post',
        data
    })
}

// 保证金退款相关数据
export function getMarginRefundData (data) {
    return request({
        url: '/pto/deposit/refund',
        method: 'post',
        data
    })
}
// 保证金退款前弹窗相关数据
export function MarginRefundMsg (data) {
    return request({
        url: '/user/kyc/wallet/info/query',
        method: 'post',
        data
    })
}

// 保证金退款
export function marginRefund (data) {
    return request({
        url: '/pto/deposit/refund/confirm',
        method: 'post',
        data
    })
}

// 获取预售退款弹窗数据
export function getPresaleRefundData (data) {
    return request({
        url: '/pto/invest/refund/query',
        method: 'post',
        data
    })
}
// 预售退款（全部）
export function presaleRefundAll (data) {
    return request({
        url: '/pto/invest/refund',
        method: 'post',
        data
    })
}
// 预售退款（部分）
export function presaleRefundSection (data) {
    return request({
        url: '/pto/invest/user/refund',
        method: 'post',
        data
    })
}

// 删除通证
export function deleteRelease (data) {
    return request({
        url: '/pto/state/delete',
        method: 'post',
        data
    })
}

// 获取法币币种
export function getCurrencyList (data) {
    return request({
        url: '/pto/common/currency',
        method: 'post',
        data
    })
}
// 获取单用户单币种数据
export function getCurrencyBalance (data) {
    return request({
        url: '/wallet/account/info/single/query',
        method: 'post',
        data
    })
}

// 获取项目公示信息
export function getPublicInfo (data) {
    return request({
        url: '/pto/project/publicity/get',
        method: 'post',
        data
    })
}

// 保存项目公示信息
export function savePublicInfo (data) {
    return request({
        url: '/pto/project/publicity/save',
        method: 'post',
        data
    })
}

// 获取钱包币种
export function getWalletCurrency (data) {
    return request({
        url: '/wallet/currency/query',
        method: 'post',
        data
    })
}
