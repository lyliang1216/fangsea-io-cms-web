/**
 * Created by jiachenpan on 16/11/18.
 */

export function isExternal (path) {
    return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 小数格式，不允许出现多个小数点
 */
export function fractionalformat (val) {
    return val.toString().split('.').length <= 2
}

/**
 * 判断不为''，null，undefined,[],{}
 */
export function judgingempty (val) {
    if (val === '' || val === null || val === undefined || val === [] || val === {}) {
        return false
    }
    return true
}
