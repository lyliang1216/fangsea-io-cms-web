<template>
    <div class="app-container">
        <p>注意：所有平台钱包（包括：提现钱包、矿工费钱包、冷钱包）向用户钱包提现均不会上账，请不要使用这些钱包对用户钱包做任何提现操作。</p>
        <el-tabs
            :before-leave='getWalletData'
            v-model="activeTab"
            type="border-card"
            style="min-height: 200px;">
            <el-tab-pane label="平台资产钱包" name="platformWallet">
                <el-table
                    stripe
                    :data="platformWalletData"
                    style="width: 100%">
                    <el-table-column
                        prop="address"
                        label="钱包地址">
                        <template slot-scope="props">
                            <router-link class="link-style"
                                         :to="{'path':'/finance/walletassets',
                                 'query':{'addr':props.row.address,'type':props.row.walletType}}"
                                         tag="a" target="_blank">
                                {{ props.row.address }}
                            </router-link>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="walletType"
                        label="类别">
                        <template slot-scope="props">
                            {{ matchType(props.row.walletType) }}
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-show="platformPages.total>0" :total="platformPages.total"
                            :page.sync="platformPages.pageNum" :limit.sync="platformPages.pageSize"
                            @pagination="getWalletData"/>
            </el-tab-pane>
            <el-tab-pane label="项目钱包" name="projectWallet">
                <el-form :inline="true" :model="searchFormData" class="demo-form-inline" ref="projectWalletSearch">
                    <el-form-item label="项目编号" prop="number">
                        <el-select v-model="searchFormData.number" filterable clearable placeholder="项目编号">
                            <el-option v-for="item in number"
                                       :key="item.projectId"
                                       :label="item.number"
                                       :value="item.number">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Ticker" prop="ptCurCode">
                        <el-select v-model="searchFormData.ptCurCode" filterable clearable placeholder="Ticker">
                            <el-option v-for="item in ptCurCode"
                                       :key="item.projectId"
                                       :label="item.code"
                                       :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getprojectWallet('searched')">搜索</el-button>
                        <el-button @click="resetSearchForm">重置</el-button>
                    </el-form-item>
                </el-form>
                <el-table
                    stripe
                    :data="projectWalletData"
                    @sort-change="sortTable"
                    style="width: 100%">
                    <el-table-column
                        prop="walletAddr"
                        label="钱包地址"
                        width="370">
                        <template slot-scope="props">
                            <router-link class="link-style"
                                         :to="{'path':'/finance/walletassets',
                                 'query':{'addr':props.row.walletAddr,'type':8}}"
                                         tag="a" target="_blank">
                                {{ props.row.walletAddr }}
                            </router-link>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="number"
                        label="项目编号"
                        sort-by="number"
                        sortable="custom">
                    </el-table-column>
                    <el-table-column
                        prop="ptCurCode"
                        label="Ticker">
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="项目名称">
                    </el-table-column>
                </el-table>
                <pagination v-show="projectPages.total>0" :total="projectPages.total"
                            :page.sync="projectPages.pageNum" :limit.sync="projectPages.pageSize"
                            @pagination="getprojectWallet"/>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import {
        getPlatformWallet,
        getprojectWallet,
        getprojectNumber,
        getWalletCurrency
    } from '@/api/finance/platform-wallet'
    import Pagination from '@/components/Pagination'

    export default {
        components: {
            Pagination
        },
        data () {
            return {
                // 当前选中tab
                activeTab: 'platformWallet',
                // 平台钱包分页
                platformPages: {
                    // 页码
                    pageNum: 1,
                    // 每页显示数据条数
                    pageSize: 10,
                    // 数据总条数
                    total: 0
                },
                // 项目钱包分页
                projectPages: {
                    // 页码
                    pageNum: 1,
                    // 每页显示数据条数
                    pageSize: 10,
                    // 数据总条数
                    total: 0
                },
                // 平台资产钱包列表
                platformWalletData: [],
                // 项目钱包列表
                projectWalletData: [],
                // 项目钱包查询条件
                searchFormData: {
                    number: '',
                    ptCurCode: ''
                },
                // 项目钱包查询条件（搜索）
                searchFormDataFilter: {
                    number: '',
                    ptCurCode: ''
                },
                // 项目编号列表
                number: [],
                // ticker列表
                ptCurCode: [],
                // 排序规则
                sortRule: ''
            }
        },
        created () {
            // 初始化数据
            this.getWalletData()
        },
        methods: {
            // 获取钱包币种
            getWalletCurrency () {
                let formData = {
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
                getWalletCurrency(formData).then(res => {
                    if (res.code.toString() === '0') {
                        this.ptCurCode = res.data.list
                    }
                })
            },
            // tabs切换触发查询请求
            getWalletData (activeName, oldActiveName) {
                let tabName = ''
                if (activeName === undefined) {
                    tabName = this.activeTab
                } else {
                    tabName = activeName
                }
                if (tabName === 'platformWallet') {
                    // 获取平台钱包列表
                    let formdata = {
                        traceId: Math.random().toString(36).substr(2),
                        data: {
                            pageNum: this.platformPages.pageNum,
                            pageSize: this.platformPages.pageSize
                        }
                    }
                    getPlatformWallet(formdata).then(response => {
                        let res = response.data
                        this.platformWalletData = res.list
                        this.platformPages.pageNum = res.pageNum
                        this.platformPages.pageSize = res.pageSize
                        this.platformPages.total = res.total
                    })
                } else {
                    this.getprojectNumber()
                    this.getWalletCurrency()
                    this.resetSearchForm()
                }
            },
            /**
             * 获取项目编号
             */
            getprojectNumber () {
                let params = {
                    traceId: Math.random().toString(36).substr(2)
                }
                getprojectNumber(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.number = res.data
                    }
                })
            },
            // 获取项目钱包数据
            getprojectWallet (str) {
                if (str === 'searched') {
                    this.searchFormDataFilter = Object.assign({}, this.searchFormData)
                }
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        pageNum: this.projectPages.pageNum,
                        pageSize: this.projectPages.pageSize,
                        filter: this.searchFormDataFilter
                    }
                }
                // 是否有排序
                if (this.sortRule !== '') {
                    params.data.filter.orderByKey = this.sortRule.split(' ')[0]
                    params.data.filter.orderByDesc = this.sortRule.split(' ')[1]
                } else {
                    delete params.data.filter.orderByKey
                    delete params.data.filter.orderByDesc
                }
                getprojectWallet(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.projectWalletData = res.data.list
                        this.projectPages.pageNum = res.data.pageNum
                        this.projectPages.pageSize = res.data.pageSize
                        this.projectPages.total = res.data.total
                    }
                })
            },
            // 重置搜索
            resetSearchForm () {
                this.$refs.projectWalletSearch.resetFields()
                this.getprojectWallet('searched')
            },
            // 排序监听
            sortTable (params) {
                let sort = ''
                if (params.order) {
                    sort = params.prop + ' ' + (params.order === 'ascending' ? 'asc' : 'desc')
                    this.sortRule = sort
                    this.getprojectWallet()
                } else {
                    this.sortRule = ''
                    this.getprojectWallet()
                }
            },
            // 匹配平台钱包类别
            matchType (type) {
                switch (type) {
                case 1:
                    return '提现钱包'
                case 2:
                    return '矿工费钱包'
                case 3:
                    return '冷钱包'
                case 7:
                    return '公司钱包'
                }
            }
        }
    }
</script>

<style scoped>
    .link-style {
        color: #2ea9df;
    }
</style>
