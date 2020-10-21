// 按钮权限指令
import Vue from 'vue'

function auth (val) {
    let isShow = false
    let btnPowerArr = localStorage.getItem('rolesCode')
    if (btnPowerArr === undefined || btnPowerArr === null) {
        return false
    }
    if (btnPowerArr.indexOf(val) > -1) {
        isShow = true
    }
    return isShow
    // return true
}

export default {
    bind: function (el, binding) {
        let path = binding.value.id
        if (!auth(path)) {
            Vue.nextTick(() => {
                el.parentNode.removeChild(el)
            })
        }
    }
}
