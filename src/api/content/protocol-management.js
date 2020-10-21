import request from '@/utils/request'

// 获取注册协议、免责条款api
export function getProtocol (data) {
    return request({
        url: '/cms/config/query',
        method: 'post',
        data
    })
}

// 保存注册协议、免责条款api
export function updateProtocol (data) {
    return request({
        url: '/cms/config/update',
        method: 'post',
        data
    })
}
