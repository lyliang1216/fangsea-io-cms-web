// 需要注册的全局指令
import auth from './auth'

const directives = {auth}

export default {
    install (Vue) {
        Object.keys(directives).forEach(k => Vue.directive(k, directives[k]))
    }
}
