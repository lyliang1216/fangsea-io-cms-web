import request from '@/utils/request'

// 获取年度统计数据
export function getYearTotalData (data) {
    return request({
        url: '/dc/dashboard/getAnnualStatistics',
        method: 'post',
        data
    })
}

// 获取资产充值统计
export function getTabsAssetsBasicsData (data) {
    return request({
        url: '/dc/dashboard/queryAssetRecharge',
        method: 'post',
        data
    })
}

// 获取销售额统计
export function getTabsSalesBasicsData (data) {
    return request({
        url: '/dc/dashboard/getSalesStatistics',
        method: 'post',
        data
    })
}

// 获取销售趋势图
export function getSaleTrendMapData (data) {
    return request({
        url: '/dc/dashboard/querySaleTrendChart',
        method: 'post',
        data
    })
}

// 获取销售排行榜
export function getSalesLeaderboardData (data) {
    return request({
        url: '/dc/dashboard/querySalesRankings',
        method: 'post',
        data
    })
}

// 获取项目认购订单列表
export function getTabsReleaseOrderData (data) {
    return request({
        url: '/dc/dashboard/querySalesList',
        method: 'post',
        data
    })
}

// 获取项目销售额占比
export function getTabsProjectSalesData (data) {
    return request({
        url: '/dc/dashboard/queryProportionOfSales',
        method: 'post',
        data
    })
}

// 获取资产趋势图
export function getAssetsTrendMapData (data) {
    return request({
        url: '/dc/dashboard/queryAssetTrendChart',
        method: 'post',
        data
    })
}

// 获取资产充值排行
export function getTabsAssetRechargeData (data) {
    return request({
        url: '/dc/dashboard/queryAssetRankings',
        method: 'post',
        data
    })
}

// 获取投资人充值列表
export function getTabsInvestmentRechargeData (data) {
    return request({
        url: '/dc/dashboard/queryAssetList',
        method: 'post',
        data
    })
}

// 获取充值币种类别占比
export function getTabsRechargeAnalogyData (data) {
    return request({
        url: '/dc/dashboard/queryRechargeCategory',
        method: 'post',
        data
    })
}
