<template>
    <div class="app-container">
        <div class="filter-container">
            <el-form :inline="true" :model="searchFormData" class="searchForm" ref="searchForm">
                <el-form-item label="" prop="searchInput">
                    <el-input placeholder="请输入内容" v-model="searchFormData.searchInput" ref="selectInput"
                              @focus="$event.target.select()"
                              class="input-with-select inline-input" size="small">
                        <el-select v-model="searchFormData.searchSelect" filterable slot="prepend"
                                   @change="checkSearchInput" placeholder="请选择" size="small"
                                   style="width: 110px;">
                            <el-option label="UID" value="0"></el-option>
                            <el-option label="手机号码" value="3"></el-option>
                            <el-option label="Email" value="4"></el-option>
                        </el-select>
                    </el-input>
                </el-form-item>
                <el-form-item label="姓氏" prop="familyName">
                    <el-input v-model="searchFormData.familyName" size="small" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="名字" prop="selfName">
                    <el-input v-model="searchFormData.selfName" size="small" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="钱包地址" prop="walletAddress">
                    <el-input v-model="searchFormData.walletAddress" size="small" placeholder=""></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getList('searched')" size="small">搜索</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="resetForm" size="small">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table stripe
                  :data="memberList"
                  :row-key='getRowKeys'
                  :expand-row-keys="expands"
                  @expand-change="expandSelect"
                  class="memberList"
                  style="width: 100%">
            <!--<el-table-column-->
            <!--type="selection"-->
            <!--width="55">-->
            <!--</el-table-column>-->
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-tabs v-if="expandId === props.row.userId"
                             @tab-click='getMemberMsg(activeTab,props.row.userId,props.row.bizAccountId)'
                             v-model="activeTab"
                             type="border-card">
                        <el-tab-pane name="userMsg" label="用户信息">
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item label="UID">
                                    <span>{{ props.row.userCode }}</span>
                                </el-form-item>
                                <el-form-item label="手机">
                                    <span
                                        v-if="props.row.mobile">{{ '+' +props.row.areaCode + ' ' + props.row.mobile }}</span>
                                </el-form-item>
                                <el-form-item label="Email">
                                    <span>{{ props.row.email }}</span>
                                </el-form-item>
                                <el-form-item label="性别">
                                    <span></span>
                                </el-form-item>
                                <el-form-item label="注册IP">
                                    <span>{{ props.row.ip }}</span>
                                </el-form-item>
                                <el-form-item label="注册时间">
                                    <span>{{ props.row.registerTime | getZoneTime }}</span>
                                </el-form-item>
                            </el-form>
                        </el-tab-pane>
                        <el-tab-pane name="kycState" label="认证进度">
                            <el-form label-position="left" inline class="demo-table-expand"
                                     v-if="memberKycState !== null">
                                <el-form-item label="审核状态">
                                    <span>{{ getState(memberKycState.auditState) }}</span>
                                    <span
                                        v-if="memberKycState.auditState === 1"> ({{memberKycState.auditRemark}})</span>
                                </el-form-item>
                            </el-form>
                            <p v-else>此用户暂未申请身份认证</p>
                        </el-tab-pane>
                        <el-tab-pane name="kyc" label="身份认证信息" v-if="showKycAuth">
                            <el-form label-position="left" inline class="demo-table-expand" v-if="memberKyc !== null">
                                <el-form-item label="姓氏">
                                    <span>{{ memberKyc.familyName }}</span>
                                </el-form-item>
                                <el-form-item label="名字">
                                    <span>{{ memberKyc.selfName }}</span>
                                </el-form-item>
                                <el-form-item label="国籍">
                                    <span>{{ memberKyc.nationalityName }}</span>
                                </el-form-item>
                                <el-form-item label="生日">
                                    <span>{{ memberKyc.birthday | parseTime('{y}-{m}-{d}') }}</span>
                                </el-form-item>
                                <el-form-item label="护照号">
                                    <span>{{ memberKyc.passportNo }}</span>
                                </el-form-item>
                                <el-form-item label="审核状态">
                                    <span>{{ getState(memberKyc.auditState) }}</span>
                                    <span v-if="memberKyc.auditState === 1"> ({{memberKyc.auditRemark}})</span>
                                </el-form-item>
                                <el-form-item label="护照封面" class="member-kyc-img">
                                    <img :src="memberKyc.passportCoverUrl" @click="opennew(memberKyc.passportCoverUrl)"
                                         alt="">
                                </el-form-item>
                                <el-form-item label="护照个人信息页" class="member-kyc-img">
                                    <img :src="memberKyc.passportInfoUrl" @click="opennew(memberKyc.passportInfoUrl)"
                                         alt="">
                                </el-form-item>
                                <el-form-item label="护照有效期至">
                                    <span v-if="memberKyc.passportEndTime !== null">{{ substr(getZoneTime(memberKyc.passportEndTime))}}</span>
                                </el-form-item>
                            </el-form>
                            <p v-else>此用户暂未申请身份认证</p>
                        </el-tab-pane>
                        <el-tab-pane name="account" label="账户">
                            <el-table stripe
                                      :data="accountData"
                                      style="width: 100%">
                                <el-table-column
                                    label="币种"
                                    prop="currency">
                                </el-table-column>
                                <el-table-column
                                    label="余额"
                                    prop="balance">
                                </el-table-column>
                                <el-table-column
                                    label="冻结"
                                    prop="freezBalance">
                                </el-table-column>
                                <el-table-column
                                    label="锁仓"
                                    prop="lockBalance">
                                </el-table-column>
                            </el-table>
                            <!--<pagination-->
                                <!--v-show="accountTotal>0"-->
                                <!--:total="accountTotal"-->
                                <!--:page.sync="accountPageNum"-->
                                <!--:limit.sync="accountPageSize"-->
                                <!--@pagination="getAccountData(props.row.bizAccountId)"-->
                            <!--/>-->
                        </el-tab-pane>
                        <el-tab-pane name="wallet" label="钱包">
                            <div class="currency-address">
                                <el-select v-model="selectedCurrency" @change="getWalletData(props.row.bizAccountId)"
                                           placeholder="请选择" size="small">
                                    <el-option
                                        v-for="item in currencyList"
                                        :key="item.curId"
                                        :label="item.curName"
                                        :value="item.code">
                                    </el-option>
                                </el-select>
                                <p v-if="walletAddress!=''" class="p-walletaddress copy-link" @click="copyAddress"
                                   :data-clipboard-text="walletAddress">
                                    钱包地址：{{walletAddress}}
                                    <span class="svg-container">
                                        <svg-icon icon-class="copy"/>
                                    </span>
                                </p>
                            </div>
                            <el-form label-position="left" inline class="demo-table-expand" v-if="walletData !== null">
                                <el-form-item label="币种">
                                    <span>{{ walletData.currency }}</span>
                                </el-form-item>
                                <el-form-item label="数量">
                                    <span>{{ walletData.balance }}</span>
                                </el-form-item>
                            </el-form>
                            <p v-else>暂无数据</p>
                        </el-tab-pane>
                    </el-tabs>
                </template>
            </el-table-column>
            <el-table-column
                label="UID"
                prop="userCode"
                min-width="80px">
            </el-table-column>
            <el-table-column
                label="手机"
                min-width="150px">
                <template slot-scope="props">
                    {{ props.row.mobile ? '+' + props.row.areaCode + ' ' + props.row.mobile : '-' }}
                </template>
            </el-table-column>
            <el-table-column
                label="Email"
                prop="email"
                min-width="160px">
                <template slot-scope="props">
                    {{ props.row.email ? props.row.email : '-' }}
                </template>
            </el-table-column>
            <el-table-column
                label="姓氏"
                prop="familyName"
                width="100px">
                <template slot-scope="props">
                    {{ props.row.familyName ? props.row.familyName : '-' }}
                </template>
            </el-table-column>
            <el-table-column
                label="名字"
                prop="selfName"
                width="100px">
                <template slot-scope="props">
                    {{ props.row.selfName ? props.row.selfName : '-' }}
                </template>
            </el-table-column>
            <el-table-column
                label="注册时间"
                min-width="150px">
                <template slot-scope="props">
                    {{ props.row.registerTime | getZoneTime }}
                </template>
            </el-table-column>
            <el-table-column
                label="注册IP"
                min-width="130px">
                <template slot-scope="props">
                    {{ props.row.ip ? props.row.ip : '-' }}
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getList"/>
    </div>
</template>

<script>
    import {
        getMemberData,
        getMemberAccount,
        getMemberWallet,
        getMemberKyc,
        getMemberKycState,
        getWalletCurrency
    } from '@/api/operation/member'
    import Pagination from '@/components/Pagination'
    import Clipboard from 'clipboard'

    export default {
        data () {
            return {
                // 用户列表数据
                memberList: [],
                // 数据总数
                total: 0,
                // 当前页码
                page: 1,
                // 分页条数
                limit: 20,
                // 展开行集合
                expands: [],
                // 展开行对应userID
                expandId: '',
                // 查询条件
                searchFormData: {
                    // 下拉所搜内容
                    searchInput: '',
                    // 0：UID 3：手机号 4：邮箱
                    searchSelect: '0',
                    // 姓
                    familyName: '',
                    // 名
                    selfName: '',
                    // 钱包地址
                    walletAddress: ''
                },
                // 查询条件(搜索)
                searchFormDataFilter: {
                    // 下拉所搜内容
                    searchInput: '',
                    // 0：UID 3：手机号 4：邮箱
                    searchSelect: '0',
                    // 姓
                    familyName: '',
                    // 名
                    selfName: '',
                    // 钱包地址
                    walletAddress: ''
                },
                // 单用户下拉展开tabs选中项name
                activeTab: 'userMsg',
                // 用户kyc数据
                memberKyc: {},
                // 用户kyc状态数据
                memberKycState: {},
                // 用户账户数据
                accountData: [],
                // 用户账户数据总数
                accountTotal: 0,
                // 用户账户当前页码
                accountPageNum: 1,
                // 用户账户分页条数
                accountPageSize: 100,
                // 用户钱包数据
                walletData: null,
                // 用户钱包地址
                walletAddress: '',
                // 当前选中币种
                selectedCurrency: '',
                // 币种列表
                currencyList: [],
                // 防止复制重复点击
                cancopy: true,
                // 是否显示Kyc认证全部信息
                showKycState: true,
                // 显示查看kyc权限
                showKycAuth: true
            }
        },
        mounted () {
            if (this.$route.query.uid) {
                this.searchFormData.searchInput = this.$route.query.uid
            }
            this.showKycAuth = localStorage.getItem('rolesCode').indexOf('10100010001') !== -1
            this.getList('searched')
        },
        methods: {
            /**
             * 获取用户列表
             */
            getList (str) {
                if (str === 'searched') {
                    this.searchFormDataFilter = Object.assign({}, this.searchFormData)
                }
                let formData = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        pageNum: this.page,
                        pageSize: this.limit,
                        filter: JSON.parse(JSON.stringify(this.searchFormDataFilter))
                    }
                }
                // 查询条件
                switch (this.searchFormDataFilter.searchSelect) {
                case '0':
                    formData.data.filter['userCode'] = this.searchFormDataFilter.searchInput
                    break
                case '3':
                    formData.data.filter['mobile'] = this.searchFormDataFilter.searchInput
                    break
                case '4':
                    formData.data.filter['email'] = this.searchFormDataFilter.searchInput
                    break
                default:
                    break
                }
                delete formData.data.filter['searchSelect']
                delete formData.data.filter['searchInput']
                formData.data.filter = this.removeSpaces(formData.data.filter)
                this.searchFormData = this.removeSpaces(this.searchFormData)
                getMemberData(formData).then(response => {
                    const res = response.data
                    this.total = res.total
                    this.memberList = res.list
                })
            },
            /**
             * 切换select筛选条件
             */
            checkSearchInput () {
                this.$nextTick(() => {
                    this.$refs.selectInput.focus()
                })
            },
            /**
             * 用户详情tabs切换事件触发
             */
            getMemberMsg (activeTab, userid, bizAccountId) {
                // 根据选中tab请求接口
                switch (activeTab) {
                // 请求用户账户状态
                case 'kycState':
                    this.memberKycState = []
                    this.getMemberKycState(userid)
                    break
                    // 请求用户账户数据
                case 'kyc':
                    this.memberKyc = []
                    this.getMemberKyc(userid)
                    break
                    // 请求用户账户数据
                case 'account':
                    this.accountData = []
                    this.getAccountData(bizAccountId)
                    break
                    // 请求钱包数据
                case 'wallet':
                    this.walletData = null
                    this.getWalletCurrency(bizAccountId)
                    break
                }
            },
            /**
             * 获取单用户kyc信息
             */
            getMemberKyc (userId) {
                let formData = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        userId: userId
                    }
                }
                getMemberKyc(formData).then(response => {
                    this.memberKyc = response.data
                })
            },
            /**
             * 获取单用户kyc状态信息
             */
            getMemberKycState (userId) {
                let formData = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        userId: userId
                    }
                }
                getMemberKycState(formData).then(response => {
                    this.memberKycState = response.data
                })
            },
            /**
             * 判定用户kyc审核状态
             */
            getState (val) {
                switch (val) {
                case 0:
                    return '未审核'
                case 1:
                    return '未通过'
                case 2:
                    return '已通过'
                default:
                    break
                }
            },
            /**
             *  新开页查看图片
             */
            opennew (url) {
                window.open(url)
            },
            /**
             * 获取单用户账户数据
             */
            getAccountData (bizAccountId) {
                let formData = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        pageNum: this.accountPageNum,
                        pageSize: this.accountPageSize,
                        filter: parseInt(bizAccountId)
                    }
                }
                getMemberAccount(formData).then(response => {
                    let res = response.data
                    this.accountTotal = res.total
                    this.accountPageNum = res.pageNum
                    this.accountPageSize = 100 // res.pageSize
                    this.accountData = res.list
                })
            },
            /**
             * 获取单用户钱包数据
             */
            getWalletData (bizAccountId) {
                let formData = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        // accountType: 0,
                        bizAccountId: bizAccountId,
                        currency: this.selectedCurrency
                    }
                }
                getMemberWallet(formData).then(response => {
                    if (response.code.toString() === '0') {
                        this.walletData = response.data
                        this.walletAddress = response.data.address
                    } else {
                        this.walletData = null
                    }
                })
            },
            /**
             * 获取钱包币种
             */
            getWalletCurrency (userid) {
                let formdata = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        pageNum: 1,
                        pageSize: 0,
                        filter: {
                            state: '1',
                            neState: '0'
                        }
                    }
                }
                getWalletCurrency(formdata).then(response => {
                    this.currencyList = response.data.list
                    this.selectedCurrency = response.data.list[0].code
                    this.getWalletData(userid)
                })
            },
            /**
             * 获取table行key
             */
            getRowKeys (row) {
                return row.userId
            },
            /**
             * 设置table每次只可以展开一行数据
             */
            expandSelect (row, expandedRows) {
                if (expandedRows.length) {
                    this.expands = []
                    if (row) {
                        this.expandId = row.userId
                        this.expands.push(row.userId)
                    }
                } else {
                    this.expands = []
                }
                this.memberKyc = {}
                this.walletAddress = ''
                this.activeTab = 'userMsg'
            },
            /**
             *  筛选条件重置
             */
            resetForm () {
                this.$refs.searchForm.resetFields()
                this.searchFormData.searchSelect = '0'
                this.getList('searched')
            },
            /**
             *  点击复制事件
             */
            copyAddress () {
                if (this.cancopy) {
                    this.cancopy = false
                    let clipboard = new Clipboard('.copy-link')
                    clipboard.on('success', e => {
                        this.$message.success('复制成功')
                        clipboard.destroy()
                    })
                    clipboard.on('error', e => {
                        this.$message.error(this.$t('复制失败，请手动复制'))
                        clipboard.destroy()
                    })
                    setTimeout(() => {
                        this.cancopy = true
                    }, 1000)
                }
            },
            // 截取时间字符串
            substr (str) {
                let newStr = str.substring(0, 10)
                return newStr
            }
        },
        components: {Pagination}
    }
</script>
<style lang="scss" scoped>
    .member-kyc-img {
        img {
            width: 130px;
            cursor: pointer;
        }
    }

    .memberList .el-form-item {
        min-width: 30%;
    }

    .currency-address {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        p {
            margin-left: 20px;
            line-height: 32px;
        }
    }

    .p-walletaddress {
        cursor: pointer;
        .svg-container {
            visibility: hidden;
        }
        &:hover .svg-container {
            visibility: visible;
        }
    }

    /deep/ .searchForm .el-input-group__prepend, .searchForm .el-input-group__append {
        background-color: #fff;
    }
</style>
