import request from '@/utils/request'

// 获取角色列表下拉框
export function getRoles (data) {
    return request({
        url: '/cms/roles/list',
        method: 'post',
        data
    })
}

// 获取菜单权限列表
export function getMenuList (data) {
    return request({
        url: '/cms/menu/permission/list',
        method: 'post',
        data
    })
}

// 编辑更新菜单
export function updateEditMenu (data) {
    return request({
        url: '/cms/menu/permission/update',
        method: 'post',
        data
    })
}

// 开启禁用权限
export function checkPermission (data) {
    return request({
        url: '/cms/permission/state/update',
        method: 'post',
        data
    })
}

// 角色与菜单权限更新
export function updateRolesMenus (data) {
    return request({
        url: '/cms/role/menu/permission/update',
        method: 'post',
        data
    })
}

// 获取操作权限列表
export function getOperaList (data) {
    return request({
        url: '/cms/operation/permission/list',
        method: 'post',
        data
    })
}

// 编辑操作权限
export function updateEditOpera (data) {
    return request({
        url: '/cms/operation/permission/update',
        method: 'post',
        data
    })
}

// 提交更新操作权限
export function updateRolesMenusOpera (data) {
    return request({
        url: '/cms/role/menu/operation/permission/update',
        method: 'post',
        data
    })
}
