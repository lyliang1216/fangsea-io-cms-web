import Vue from 'vue'
import Router from 'vue-router'

/* Layout */
import Layout from '../views/layout/Layout'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
 **/
export const constantRouterMap = [
    {path: '/login', component: () => import('@/views/login/index'), hidden: true},
    {path: '/404', component: () => import('@/views/404'), hidden: true},
    {path: '/preview', component: () => import('@/views/preview'), hidden: true},

    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        name: 'Dashboard',
        hidden: true,
        children: [{
            path: 'dashboard',
            component: () => import('@/views/dashboard/index')
        }]
    },

    // 通证发行相关路由
    {
        path: '/passissued',
        component: Layout,
        redirect: '/passissued/releaselist',
        name: 'PassIssued',
        meta: {title: '通证发行', icon: 'issued', id: 10000000000},
        children: [
            // 发行列表
            {
                path: 'releaselist',
                name: 'ReleaseList',
                component: () => import('@/views/pass-issued/release-list'),
                meta: {title: '发行列表', id: 10000010000}
            },
            // 新增
            {
                path: 'newrelease',
                name: 'NewRelease',
                component: () => import('@/views/pass-issued/new-release'),
                meta: {title: '项目发行', id: 10000020000}
            },
            // 详情
            {
                path: 'releasedetails',
                name: 'ReleaseDetails',
                component: () => import('@/views/pass-issued/release-details'),
                meta: {title: '项目发行', id: 10000010001},
                hidden: true
            },
            // 编辑
            {
                path: 'editrelease',
                name: 'EditRelease',
                component: () => import('@/views/pass-issued/new-release'),
                meta: {title: '项目发行', id: 10000010002},
                hidden: true
            }
        ]
    },

    // 运营管理相关路由
    {
        path: '/operation',
        component: Layout,
        redirect: '/operation/memberlist',
        name: 'Operation',
        meta: {title: '运营管理', icon: 'operation', id: 10100000000},
        children: [
            {
                path: 'memberlist',
                name: 'MemberList',
                component: () => import('@/views/operation/registered-customer'),
                meta: {title: '注册客户', id: 10100010000}
            },
            {
                path: 'kyc',
                name: 'Kyc',
                component: () => import('@/views/operation/kyc'),
                meta: {title: '身份认证', id: 10100020000}
            },
            {
                path: 'recommender',
                name: 'Recommender',
                component: () => import('@/views/operation/recommender'),
                meta: {title: '推荐人报表', id: 10100030000}
            },
            {
                path: 'currency',
                name: 'Currency',
                component: () => import('@/views/operation/currency'),
                meta: {title: '币种管理', id: 10100040000}
            },
            {
                path: 'area',
                name: 'Area',
                component: () => import('@/views/operation/area'),
                meta: {title: '地区管理', id: 10100050000}
            },
            {
                path: 'feedback',
                name: 'Feedback',
                component: () => import('@/views/operation/feedback'),
                meta: {title: '用户反馈', id: 10100060000}
            }
        ]
    },

    // 订单管理相关路由
    {
        path: '/order',
        component: Layout,
        redirect: '/order/releaseorder',
        name: 'Order',
        meta: {title: '订单管理', icon: 'order', id: 10200000000},
        children: [
            {
                path: 'releaseorder',
                name: 'ReleaseOrder',
                component: () => import('@/views/order/release-order'),
                meta: {title: '认购订单', id: 10200010000}
            }
        ]
    },

    // 投后管理相关路由
    {
        path: '/postinvestment',
        component: Layout,
        redirect: '/postinvestment/profitloss',
        name: 'postInvestment',
        meta: {title: '投后管理', icon: 'post', id: 10300000000},
        children: [
            {
                path: 'profitloss',
                name: 'ProfitLoss',
                component: () => import('@/views/post-investment/profit-loss'),
                meta: {title: '资产损益', id: 10300010000}
            },
            {
                path: 'bonuslist',
                name: 'BonusList',
                component: () => import('@/views/post-investment/bonus-list'),
                meta: {title: '分红列表', id: 10300020000}
            },
            {
                path: 'newdividends',
                name: 'newDividends',
                component: () => import('@/views/post-investment/new-dividends'),
                meta: {title: '新增分红(新)', id: 10300030000}
            },
            // 详情
            {
                path: 'dividendsdetails',
                name: 'dividendsDetails',
                component: () => import('@/views/post-investment/new-dividends'),
                meta: {title: '分红', id: 10300010001},
                hidden: true
            },
            // 编辑
            {
                path: 'editdividends',
                name: 'editDividends',
                component: () => import('@/views/post-investment/new-dividends'),
                meta: {title: '分红', id: 10300010002},
                hidden: true
            },
            {
                path: 'newbonus',
                name: 'NewBonus',
                component: () => import('@/views/post-investment/new-bonus'),
                meta: {title: '新增分红(旧)', id: 10300040000}
            },
            {
                path: 'financesettle',
                name: 'FinanceSettle',
                component: () => import('@/views/post-investment/finance-settle'),
                meta: {title: '财务结算', id: 10300010003},
                hidden: true
            }
        ]
    },

    // 内容管理相关路由
    {
        path: '/contentmanage',
        component: Layout,
        redirect: '/contentmanage/infodisclosure',
        name: 'ContentManage',
        meta: {title: '内容管理', icon: 'content', id: 10400000000},
        children: [
            {
                path: 'infodisclosure',
                name: 'InfoDisclosure',
                redirect: '/contentmanage/infodisclosure/categorymanage',
                component: () => import('@/views/content/info-disclosure'),
                meta: {title: '信息披露', id: 10400010000},
                children: [
                    {
                        path: 'categorymanage',
                        name: 'CategoryManage',
                        component: () => import('@/views/content/info-disclosure/category-manage'),
                        meta: {title: '类别管理', id: 10400011000}
                    },
                    // 新增
                    {
                        path: 'inforelease',
                        name: 'InfoRelease',
                        component: () => import('@/views/content/info-disclosure/info-release'),
                        meta: {title: '信息发布', id: 10400012000}
                    },
                    // 编辑
                    {
                        path: 'editinforelease',
                        name: 'EditInfoRelease',
                        component: () => import('@/views/content/info-disclosure/info-release'),
                        meta: {title: '信息发布', id: 10400013003},
                        hidden: true
                    },
                    {
                        path: 'infomanagement',
                        name: 'InfoManagement',
                        component: () => import('@/views/content/info-disclosure/info-management'),
                        meta: {title: '披露信息管理', id: 10400013000}
                    }
                ]
            },
            {
                path: 'reminder',
                name: 'Reminder',
                component: () => import('@/views/content/reminder-setting'),
                meta: {title: '提醒设置', id: 10400020000}
            },
            {
                path: 'message',
                name: 'Message',
                component: () => import('@/views/content/message-settings'),
                meta: {title: '消息推送配置', id: 10400030000}
            },
            {
                path: 'indexconfig',
                name: 'IndexConfig',
                component: () => import('@/views/content/index-config'),
                meta: {title: '首页份额购买', id: 10400040000}
            },
            {
                path: 'projectorder',
                name: 'ProjectOrder',
                component: () => import('@/views/content/project-order'),
                meta: {title: '项目展示顺序', id: 10400050000}
            },
            {
                path: 'protocol',
                name: 'Protocol',
                redirect: '/contentmanage/protocol/license',
                component: () => import('@/views/content/protocol-management'),
                meta: {title: '协议管理', id: 10400060000},
                children: [
                    {
                        path: 'license',
                        name: 'License',
                        component: () => import('@/views/content/protocol-management/registration-agreement'),
                        meta: {title: '注册协议', id: 10400061000}
                    },
                    {
                        path: 'exception',
                        name: 'Exception',
                        component: () => import('@/views/content/protocol-management/disclaimer-agreement'),
                        meta: {title: '免责条款', id: 10400062000}
                    }
                ]
            }
        ]
    },

    // 财务管理相关路由
    {
        path: '/finance',
        component: Layout,
        redirect: '/finance/recharge',
        name: 'Finance',
        meta: {title: '财务管理', icon: 'finance', id: 10500000000},
        children: [
            {
                path: 'recharge',
                name: 'TransactionRecharge',
                component: () => import('@/views/finance/recharge'),
                meta: {title: '充值', id: 10500010000}
            },
            {
                path: 'withdraw',
                name: 'TransactionWithdraw',
                component: () => import('@/views/finance/withdraw'),
                meta: {title: '提现', id: 10500020000}
            },
            {
                path: 'transferrecord',
                name: 'TransferRecord',
                component: () => import('@/views/finance/transfer-record'),
                meta: {title: '转账记录', id: 10500030000}
            },
            {
                path: 'walletrecord',
                name: 'WalletRecord',
                component: () => import('@/views/finance/wallet-record'),
                meta: {title: '钱包记录', id: 10500040000}
            },
            {
                path: 'accountsnapshot',
                name: 'AccountSnapshot',
                component: () => import('@/views/finance/account-snapshot'),
                meta: {title: '账户快照', id: 10500050000}
            },
            {
                path: 'chain',
                name: 'Chain',
                component: () => import('@/views/finance/chain'),
                meta: {title: '链上快照', id: 10500060000}
            },
            {
                path: 'walletassets',
                name: 'WalletAssets',
                component: () => import('@/views/finance/wallet-assets'),
                meta: {title: '钱包账户资产', id: 10500070000}
            },
            {
                path: 'platformwallet',
                name: 'PlatformWallet',
                component: () => import('@/views/finance/platform-wallet'),
                meta: {title: '平台钱包管理', id: 10500080000}
            },
            {
                path: 'coinlist',
                name: 'CoinList',
                component: () => import('@/views/finance/coin-list'),
                meta: {title: '赠币列表', id: 10500090000}
            },
            {
                path: 'newcoin',
                name: 'newCoin',
                component: () => import('@/views/finance/new-coin'),
                meta: {title: '新增赠币', id: 10500100000}
            }
        ]
    },

    // 系统管理相关路由
    {
        path: '/system',
        component: Layout,
        redirect: '/system/usermanagement',
        name: 'System',
        meta: {title: '系统管理', icon: 'system', id: 10600000000},
        children: [
            {
                path: 'usermanagement',
                name: 'UserManagement',
                component: () => import('@/views/system/user'),
                meta: {title: '用户管理', id: 10600010000}
            },
            {
                path: 'rolemanagement',
                name: 'RoleManagement',
                component: () => import('@/views/system/role'),
                meta: {title: '角色管理', id: 10600020000}
            },
            {
                path: 'authoritymanagement',
                name: 'AuthorityManagement',
                component: () => import('@/views/system/authority'),
                meta: {title: '权限管理', id: 10600030000}
            },
            {
                path: 'operationrecord',
                name: 'OperationRecord',
                component: () => import('@/views/system/operation-record'),
                meta: {title: '操作记录', id: 10600040000}
            }
        ]
    }
]

export default new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({y: 0}),
    routes: constantRouterMap
})
