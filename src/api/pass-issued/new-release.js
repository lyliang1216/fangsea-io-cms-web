import request from '@/utils/request'

/**
 * 提交（下一步）(新增)
 */
// 提交基础信息
export function saveBase (data) {
    return request({
        url: '/pto/base/save',
        method: 'post',
        data
    })
}

// 提交发行人资料
export function saveIssuer (data) {
    return request({
        url: '/pto/issuer/save',
        method: 'post',
        data
    })
}

// 提交项目资料
export function saveMaterial (data) {
    return request({
        url: '/pto/material/save',
        method: 'post',
        data
    })
}

// 提交发行资料
export function saveExamine (data) {
    return request({
        url: '/pto/examine/save',
        method: 'post',
        data
    })
}

// 提交发行内容
export function saveDist (data) {
    return request({
        url: '/pto/dist/save',
        method: 'post',
        data
    })
}

// 提交发行设置
export function saveDistset (data) {
    return request({
        url: '/pto/dist/setting/save',
        method: 'post',
        data
    })
}

// 提交发行设置后(保存所有)
export function saveReleaseall (data) {
    return request({
        url: '/pto/all/save',
        method: 'post',
        data
    })
}

/**
 * 暂存（新增）
 */
// 暂存基础信息
export function tempBase (data) {
    return request({
        url: '/pto/base/temp/save',
        method: 'post',
        data
    })
}

// 暂存发行人资料
export function tempIssuer (data) {
    return request({
        url: '/pto/issuer/temp/save',
        method: 'post',
        data
    })
}

// 暂存项目资料
export function tempMaterial (data) {
    return request({
        url: '/pto/material/temp/save',
        method: 'post',
        data
    })
}

// 暂存发行资料
export function tempExamine (data) {
    return request({
        url: '/pto/examine/temp/save',
        method: 'post',
        data
    })
}

// 暂存发行内容
export function tempDist (data) {
    return request({
        url: '/pto/dist/temp/save',
        method: 'post',
        data
    })
}

// 暂存发行设置
export function tempDistset (data) {
    return request({
        url: '/pto/dist/setting/temp/save',
        method: 'post',
        data
    })
}

/**
 * 提交（下一步）(编辑)
 */
// 提交基础信息
export function saveBaseUpdate (data) {
    return request({
        url: '/pto/base/update',
        method: 'post',
        data
    })
}

// 提交发行人资料
export function saveIssuerUpdate (data) {
    return request({
        url: '/pto/issuer/update',
        method: 'post',
        data
    })
}

// 提交项目资料
export function saveMaterialUpdate (data) {
    return request({
        url: '/pto/material/update',
        method: 'post',
        data
    })
}

// 提交发行资料
export function saveExamineUpdate (data) {
    return request({
        url: '/pto/examine/update',
        method: 'post',
        data
    })
}

// 提交发行内容
export function saveDistUpdate (data) {
    return request({
        url: '/pto/dist/update',
        method: 'post',
        data
    })
}

// 提交发行设置
export function saveDistsetUpdate (data) {
    return request({
        url: '/pto/dist/setting/update',
        method: 'post',
        data
    })
}

/**
 * 暂存（编辑）
 */
// 暂存基础信息
export function tempBaseUpdate (data) {
    return request({
        url: '/pto/base/temp/update',
        method: 'post',
        data
    })
}

// 暂存发行人资料
export function tempIssuerUpdate (data) {
    return request({
        url: '/pto/issuer/temp/update',
        method: 'post',
        data
    })
}

// 暂存项目资料
export function tempMaterialUpdate (data) {
    return request({
        url: '/pto/material/temp/update',
        method: 'post',
        data
    })
}

// 暂存发行资料
export function tempExamineUpdate (data) {
    return request({
        url: '/pto/examine/temp/update',
        method: 'post',
        data
    })
}

// 暂存发行内容
export function tempDistUpdate (data) {
    return request({
        url: '/pto/dist/temp/update',
        method: 'post',
        data
    })
}

// 暂存发行设置
export function tempDistsetUpdate (data) {
    return request({
        url: '/pto/dist/setting/temp/update',
        method: 'post',
        data
    })
}

/**
 * 获取
 */
// 获取基础信息
export function getBase (data) {
    return request({
        url: '/pto/base/get',
        method: 'post',
        data
    })
}

// 获取发行人资料
export function getIssuer (data) {
    return request({
        url: '/pto/issuer/get',
        method: 'post',
        data
    })
}

// 获取项目资料
export function getMaterial (data) {
    return request({
        url: '/pto/material/get',
        method: 'post',
        data
    })
}

// 获取发行资料
export function getExamine (data) {
    return request({
        url: '/pto/examine/get',
        method: 'post',
        data
    })
}

// 获取发行内容
export function getDist (data) {
    return request({
        url: '/pto/dist/get',
        method: 'post',
        data
    })
}

// 获取发行设置
export function getDistset (data) {
    return request({
        url: '/pto/dist/setting/get',
        method: 'post',
        data
    })
}

// 获取房产类型
export function getProjectType (data) {
    return request({
        url: '/pto/dictionary/project/type/get',
        method: 'post',
        data
    })
}

// 获取房产属性
export function getProjectNature (data) {
    return request({
        url: '/pto/dictionary/project/nature/get',
        method: 'post',
        data
    })
}

// 获取区号
export function getAreacode (data) {
    return request({
        url: '/cms/region/usable/country/query',
        method: 'post',
        data
    })
}

// 获取发行方列表
export function getKyclist (data) {
    return request({
        url: '/user/kyc/base/list/query',
        method: 'post',
        data
    })
}

// 获取支付币种
export function getPaycurr (data) {
    return request({
        url: '/wallet/currency/front/query',
        method: 'post',
        data
    })
}

// 获取所有币种
export function getAllcurr (data) {
    return request({
        url: '/wallet/currency/query',
        method: 'post',
        data
    })
}

// 获取法币
export function getLegalcurr (data) {
    return request({
        url: '/pto/dictionary/currency',
        method: 'post',
        data
    })
}

// 获取上市费用法币
export function getCommonlegalcurr (data) {
    return request({
        url: '/pto/common/currency',
        method: 'post',
        data
    })
}

// 获取所有资料信息
export function getAllproject (data) {
    return request({
        url: '/pto/all/get',
        method: 'post',
        data
    })
}

// 用userid查usercode
export function getUsercode (data) {
    return request({
        url: '/user/info/id/query',
        method: 'post',
        data
    })
}

// 查询支付货币汇率
export function getPaymentrate (data) {
    return request({
        url: '/pto/common/exchange/rate/query',
        method: 'post',
        data
    })
}
