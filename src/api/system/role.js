import request from '@/utils/request'

// 获取角色列表
export function getRoles (data) {
    return request({
        url: '/cms/role/list',
        method: 'post',
        data
    })
}

// 获取角色列表
export function getRolesOpreation (data) {
    return request({
        url: '/cms/role/mgr/permission/list',
        method: 'post',
        data
    })
}
// 更新角色状态
export function updateRuleState (data) {
    return request({
        url: '/cms/role/state/update',
        method: 'post',
        data
    })
}

/**
 * 添加
 * @param data 角色信息
 */
export function addRole (data) {
    return request({
        url: '/cms/role/add',
        method: 'post',
        data
    })
}

/**
 * 更新角色
 * @param data 角色信息
 */
export function updateRole (data) {
    return request({
        url: '/cms/role/update',
        method: 'post',
        data
    })
}

/**
 * 删除角色
 */
export function deleteRole (data) {
    return request({
        url: '/cms/role/delete',
        method: 'post',
        data
    })
}
