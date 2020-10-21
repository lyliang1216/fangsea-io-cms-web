import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import './assets/css/theme/index.css'
import lang from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import locale from 'element-ui/lib/locale'

// markdown 编辑器
import MavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

import '@/assets/css/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/assets/icons' // icon
import '@/permission' // permission control

// 引入基本模板
import echarts from 'echarts'

import Filter from './utils/global'
import Directives from './directives/global'

import {
    Pagination,
    Dialog,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Menu,
    Submenu,
    MenuItem,
    Input,
    InputNumber,
    Radio,
    RadioGroup,
    RadioButton,
    Checkbox,
    CheckboxGroup,
    Switch,
    Select,
    Option,
    Button,
    Table,
    TableColumn,
    DatePicker,
    Popover,
    Tooltip,
    Breadcrumb,
    BreadcrumbItem,
    Form,
    FormItem,
    Tabs,
    TabPane,
    Tag,
    Tree,
    Alert,
    Icon,
    Row,
    Col,
    Upload,
    Steps,
    Step,
    Scrollbar,
    Card,
    Divider,
    Loading,
    MessageBox,
    Message,
    Notification
} from 'element-ui'

import 'element-ui/lib/theme-chalk/pagination.css'
import 'element-ui/lib/theme-chalk/dialog.css'
import 'element-ui/lib/theme-chalk/dropdown.css'
import 'element-ui/lib/theme-chalk/dropdown-item.css'
import 'element-ui/lib/theme-chalk/dropdown-menu.css'
import 'element-ui/lib/theme-chalk/menu.css'
import 'element-ui/lib/theme-chalk/menu-item.css'
import 'element-ui/lib/theme-chalk/submenu.css'
import 'element-ui/lib/theme-chalk/input.css'
import 'element-ui/lib/theme-chalk/input-number.css'
import 'element-ui/lib/theme-chalk/radio.css'
import 'element-ui/lib/theme-chalk/radio-group.css'
import 'element-ui/lib/theme-chalk/radio-button.css'
import 'element-ui/lib/theme-chalk/checkbox.css'
import 'element-ui/lib/theme-chalk/checkbox-group.css'
import 'element-ui/lib/theme-chalk/switch.css'
import 'element-ui/lib/theme-chalk/select.css'
import 'element-ui/lib/theme-chalk/button.css'
import 'element-ui/lib/theme-chalk/table.css'
import 'element-ui/lib/theme-chalk/table-column.css'
import 'element-ui/lib/theme-chalk/date-picker.css'
import 'element-ui/lib/theme-chalk/popover.css'
import 'element-ui/lib/theme-chalk/tooltip.css'
import 'element-ui/lib/theme-chalk/breadcrumb.css'
import 'element-ui/lib/theme-chalk/breadcrumb-item.css'
import 'element-ui/lib/theme-chalk/form.css'
import 'element-ui/lib/theme-chalk/form-item.css'
import 'element-ui/lib/theme-chalk/tabs.css'
import 'element-ui/lib/theme-chalk/tag.css'
import 'element-ui/lib/theme-chalk/tree.css'
import 'element-ui/lib/theme-chalk/alert.css'
import 'element-ui/lib/theme-chalk/icon.css'
import 'element-ui/lib/theme-chalk/row.css'
import 'element-ui/lib/theme-chalk/col.css'
import 'element-ui/lib/theme-chalk/upload.css'
import 'element-ui/lib/theme-chalk/steps.css'
import 'element-ui/lib/theme-chalk/step.css'
import 'element-ui/lib/theme-chalk/scrollbar.css'
import 'element-ui/lib/theme-chalk/card.css'
import 'element-ui/lib/theme-chalk/divider.css'
import 'element-ui/lib/theme-chalk/loading.css'
import 'element-ui/lib/theme-chalk/message-box.css'
import 'element-ui/lib/theme-chalk/message.css'
import 'element-ui/lib/theme-chalk/notification.css'

Vue.prototype.$echarts = echarts

locale.use(lang)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Switch)
Vue.use(Select)
Vue.use(Option)
Vue.use(Button)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(DatePicker)
Vue.use(Popover)
Vue.use(Tooltip)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Alert)
Vue.use(Icon)
Vue.use(Row)
Vue.use(Col)
Vue.use(Upload)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Scrollbar)
Vue.use(Card)
Vue.use(Divider)
Vue.use(Loading.directive)

Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message

Vue.use(MavonEditor)
Vue.use(Directives)
Vue.use(Filter)

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
