import request from '@/utils/request'

// 获取消息模板列表
export function selectTemplate (data) {
    return request({
        url: '/cms/message/template/query',
        method: 'post',
        data
    })
}

// 新增消息模板
export function addTemplate (data) {
    return request({
        url: '/cms/message/template/add',
        method: 'post',
        data
    })
}

// 更新消息模板
export function updateTemplate (data) {
    return request({
        url: '/cms/message/template/update',
        method: 'post',
        data
    })
}

// 删除消息模板
export function deleteTemplate (data) {
    return request({
        url: '/cms/message/template/delete',
        method: 'post',
        data
    })
}

// 根据 tab 拿国家化信息
export function getTemplate (data) {
    return request({
        url: '/cms/message/template/id/query',
        method: 'post',
        data
    })
}

// 获取使用场景类型
export function getUseScen (data) {
    return request({
        url: '/cms/message/template/queryUseSceneEnum',
        method: 'post',
        data
    })
}
