import request from '@/utils/request'

// 获取项目钱包数据
export function getWalletAssets (data) {
    return request({
        url: '/wallet/account/chain/many/balance/query',
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
