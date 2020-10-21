<template>
    <div class="app-container">
        <el-form :inline="true" :model="searchFormData" class="demo-form-inline" ref="walletAssetsSearch">
            <el-form-item label="钱包类型" prop="walletTypes" class="search-item">
                <el-select v-model="searchFormData.walletTypes" @change="matchWalletType" multiple collapse-tags
                           filterable clearable placeholder="钱包类型">
                    <el-option label="提现钱包" :value="1"/>
                    <el-option label="矿工费钱包" :value="2"/>
                    <el-option label="冷钱包" :value="3"/>
                    <el-option label="公司钱包" :value="7"/>
                    <el-option label="项目钱包" :value="8"/>
                </el-select>
                <div class="select-mask">
                    <span>{{selectWalletType}}</span>
                </div>
            </el-form-item>
            <el-form-item label="钱包地址" prop="address">
                <el-input v-model="searchFormData.address" style="width: 385px;" placeholder="钱包地址"></el-input>
            </el-form-item>
            <el-form-item label="币种" prop="ptCurCodes" class="search-item">
                <el-select v-model="searchFormData.ptCurCodes" @change="matchCur" multiple collapse-tags filterable
                           clearable placeholder="Ticker">
                    <el-option v-for="item in ptCurCode"
                               :key="item.id"
                               :label="item.code"
                               :value="item.code">
                    </el-option>
                </el-select>
                <div class="select-mask">
                    <span>{{selectCur}}</span>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getWalletData('searched')">搜索</el-button>
                <el-button @click="resetSearchForm">重置</el-button>
            </el-form-item>
        </el-form>
        <el-table
            stripe
            :data="tableData"
            @sort-change="sortTable"
            style="width: 100%">
            <template v-if="tableData.length > 0">
                <el-table-column
                    prop="address"
                    label="钱包地址"
                    width="370">
                </el-table-column>
                <el-table-column
                    v-for="(item, index) in tableData[0].cur"
                    :key="index"
                    :label="item.cur"
                    sortable="custom">
                    <template slot-scope="scope">
                        {{tableData[scope.$index].cur[index].num}}
                    </template>
                </el-table-column>
            </template>
        </el-table>
        <pagination v-show="walletPages.total>0" :total="walletPages.total"
                    :page.sync="walletPages.pageNum" :limit.sync="walletPages.pageSize"
                    @pagination="getWalletData"/>
    </div>
</template>

<script>
    import {getWalletAssets, getWalletCurrency} from '@/api/finance/wallet-assets'
    import Pagination from '@/components/Pagination'

    export default {
        components: {
            Pagination
        },
        data () {
            return {
                // 项目钱包查询条件
                searchFormData: {
                    walletTypes: [1],
                    address: '',
                    ptCurCodes: []
                },
                // 查询条件中钱包类型展示
                selectWalletType: '',
                // 查询条件中币种展示
                selectCur: '',
                // 项目钱包查询条件（搜索）
                searchFormDataFilter: {
                    walletTypes: [1],
                    address: '',
                    ptCurCodes: []
                },
                // 分页
                walletPages: {
                    // 页码
                    pageNum: 1,
                    // 每页显示数据条数
                    pageSize: 10,
                    // 数据总条数
                    total: 0
                },
                // 币种列表
                ptCurCode: [],
                // 排序规则
                sortRule: '',
                // 列表数据
                tableData: []
            }
        },
        created () {
            // 初始化数据
            if (this.$route.query.addr) {
                this.searchFormData.address = this.$route.query.addr
            }
            if (this.$route.query.type) {
                this.searchFormData.walletTypes = [parseInt(this.$route.query.type)]
            }
            this.getWalletData('searched')
            this.getWalletCurrency()
            this.matchWalletType()
            this.matchCur()
        },
        methods: {
            // 获取项目钱包数据
            getWalletData (str) {
                if (str === 'searched') {
                    this.searchFormDataFilter = Object.assign({}, this.searchFormData)
                }
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        pageNum: this.walletPages.pageNum,
                        pageSize: this.walletPages.pageSize,
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
                getWalletAssets(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.tableData = res.data.list
                        this.walletPages.pageNum = res.data.pageNum
                        this.walletPages.pageSize = res.data.pageSize
                        this.walletPages.total = res.data.total
                    }
                })
            },
            // 获取币种
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
            // 重置搜索
            resetSearchForm () {
                this.$refs.walletAssetsSearch.resetFields()
                this.searchFormData.address = ''
                this.searchFormData.walletTypes = [1]
                this.matchWalletType()
                this.matchCur()
                this.getWalletData('searched')
            },
            // 排序监听
            sortTable (params) {
                let sort = ''
                if (params.order) {
                    sort = params.column.label + ' ' + (params.order === 'ascending' ? 'asc' : 'desc')
                    this.sortRule = sort
                    this.getWalletData()
                } else {
                    this.sortRule = ''
                    this.getWalletData()
                }
            },
            // 匹配查询条件选择钱包类型展示
            matchWalletType () {
                this.selectWalletType = ''
                for (let i = 0; i < this.searchFormData.walletTypes.length; i++) {
                    switch (this.searchFormData.walletTypes[i]) {
                    case 1:
                        this.selectWalletType = this.selectWalletType + '提现钱包;'
                        break
                    case 2:
                        this.selectWalletType = this.selectWalletType + '矿工费钱包;'
                        break
                    case 3:
                        this.selectWalletType = this.selectWalletType + '冷钱包;'
                        break
                    case 7:
                        this.selectWalletType = this.selectWalletType + '公司钱包;'
                        break
                    case 8:
                        this.selectWalletType = this.selectWalletType + '项目钱包;'
                        break
                    }
                    if (i === this.searchFormData.walletTypes.length - 1) {
                        this.selectWalletType = this.selectWalletType.substr(0, this.selectWalletType.length - 1)
                    }
                }
            },
            // 匹配查询条件选择币种展示
            matchCur () {
                this.selectCur = ''
                for (let i = 0; i < this.searchFormData.ptCurCodes.length; i++) {
                    this.selectCur = this.selectCur + this.searchFormData.ptCurCodes[i] + ';'
                    if (i === this.searchFormData.ptCurCodes.length - 1) {
                        this.selectCur = this.selectCur.substr(0, this.selectCur.length - 1)
                    }
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .search-item {
        position: relative;
        .select-mask {
            position: absolute;
            pointer-events: none;
            width: 85%;
            height: 38px;
            background-color: #fff;
            left: 1px;
            top: 1px;
            justify-content: center;
            align-items: left;
            border-radius: 6px;
            z-index: 9;
            padding-left: 8px;
            color: #333333;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            /*! autoprefixer: ignore next */
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            -webkit-box-pack: inherit;
            word-break: break-all;
        }
    }
</style>
