<template>
    <div class="app-container">
        <p class="p-title">当使用账户搜索条件时，需要选择匹配的账户类型才可正常搜索</p>
        <el-form :inline="true" ref="filter" :model="filter" class="filter-form-inline">
            <el-form-item label="转出账户" prop="fromAccountId">
                <el-input v-model="filter.fromAccountId" size="small" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="转出账户类型" prop="fromAccountType">
                <el-select v-model="filter.fromAccountType" clearable filterable size="small" placeholder="请选择">
                    <el-option
                        v-for="item in account_type"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="转入账户" prop="toAccountId">
                <el-input v-model="filter.toAccountId" size="small" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="转入账户类型" prop="toAccountType">
                <el-select v-model="filter.toAccountType" clearable filterable size="small" placeholder="请选择">
                    <el-option
                        v-for="item in account_type"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="币种" prop="currency">
                <el-select v-model="filter.currency" clearable filterable size="small" placeholder="请选择">
                    <el-option
                        v-for="item in currencylist"
                        :key="item.curId"
                        :label="item.curName"
                        :value="item.curName">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="用途" prop="bizType">
                <el-select v-model="filter.bizType" clearable filterable size="small" placeholder="请选择">
                    <el-option
                        v-for="item in biz_type"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getListData" size="small">搜索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button @click="resetForm" size="small">重置</el-button>
            </el-form-item>
        </el-form>
        <el-table
            class="recordtable"
            :data="tableData"
            stripe
            style="width: 100%">
            <el-table-column
                prop="createTime"
                width="180"
                label="转账时间">
                <template slot-scope="props">
                    {{ props.row.createTime | getZoneTime }}
                </template>
            </el-table-column>
            <el-table-column
                prop="fromAccountId"
                label="转出账户">
            </el-table-column>
            <el-table-column
                prop="fromAccountType"
                label="转出账户类型">
                <template slot-scope="props">
                    {{gettype(props.row.fromAccountType)}}
                </template>
            </el-table-column>
            <el-table-column
                prop="toAccountId"
                label="转入账户">
            </el-table-column>
            <el-table-column
                prop="toAccountType"
                label="转入账户类型">
                <template slot-scope="props">
                    {{gettype(props.row.toAccountType)}}
                </template>
            </el-table-column>
            <el-table-column
                prop="currency"
                label="转账币种">
            </el-table-column>
            <el-table-column
                prop="amount"
                label="转账数量"
                width="220">
            </el-table-column>
            <el-table-column
                prop="usageType"
                label="用途">
                <template slot-scope="props">
                    {{getuse(props.row.bizType)}}
                </template>
            </el-table-column>
            <el-table-column
                prop="comments"
                label="备注">
            </el-table-column>
            <el-table-column
                label="操作人">
                <template slot-scope="props">
                    {{props.row.operationRole}}<span v-if="props.row.operatorName">({{props.row.operatorName}})</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="state"
                label="状态"
                width="100">
                <template slot-scope="props">
                    {{props.row.state | getstate}}
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="currentPage" :limit.sync="pageSize"
                    @pagination="searchlist"/>
    </div>
</template>

<script>
    import {getrecordlist, getcurrencylist, getbiztypelist} from '@/api/finance/transfer-record'
    import Pagination from '@/components/Pagination'

    export default {
        name: 'index',
        data () {
            return {
                // 账户类型
                account_type: [{
                    code: 0,
                    name: '用户账户'
                }, {
                    code: 1,
                    name: '提现账户'
                }, {
                    code: 2,
                    name: '矿工费账户'
                }, {
                    code: 3,
                    name: '冷钱包账户'
                }, {
                    code: 7,
                    name: '公司账户'
                }, {
                    code: 8,
                    name: '项目账户'
                }],
                // 用途（内部）
                biz_type: [],
                // 币种列表
                currencylist: [],
                // 筛选条件
                filter: {
                    fromAccountId: '',
                    fromAccountType: '',
                    toAccountId: '',
                    toAccountType: '',
                    currency: '',
                    // 内部转账userage_type=3
                    usageType: 3,
                    bizType: ''
                },
                // 筛选条件（查询）
                filterSearch: {
                    fromAccountId: '',
                    fromAccountType: '',
                    toAccountId: '',
                    toAccountType: '',
                    currency: '',
                    // 内部转账userage_type=3
                    usageType: 3,
                    bizType: ''
                },
                // 表格数据
                tableData: [],
                // 当前页
                currentPage: 1,
                // 总数据条数
                total: 0,
                // 每页条数
                pageSize: 10
            }
        },
        mounted () {
            if (this.$route.query.uid) {
                this.filter.fromAccountId = this.$route.query.uid
                this.filter.bizType = 'PTO_PT_INVEST'
            }
            this.searchlist()
            this.getcurr()
            this.getbiztype()
        },
        methods: {
            /**
             *  获取用途（内部）
             */
            getbiztype () {
                let params = {
                    traceId: Math.random().toString(36).substr(2)
                }
                getbiztypelist(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.biz_type = res.data
                    }
                }).catch(() => {
                })
            },
            /**
             *  获取币种列表
             */
            getcurr () {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        pageNum: 1,
                        pageSize: 0
                    }
                }
                getcurrencylist(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.currencylist = res.data.list
                        this.total = res.data.total
                    } else {
                        this.$message.error(res.msg)
                    }
                }).catch(() => {
                })
            },
            /**
             *  账户类型转换
             *  @param val 表格中的数据
             */
            gettype (val) {
                for (let i in this.account_type) {
                    if (val && this.account_type[i].code !== null) {
                        if (this.account_type[i].code.toString() === val.toString()) {
                            return this.account_type[i].name
                        }
                    }
                }
            },
            /**
             *  用途转换
             *  @param val 表格中的数据
             */
            getuse (val) {
                for (let i in this.biz_type) {
                    if (val && this.biz_type[i].code !== null) {
                        if (this.biz_type[i].code.toString() === val.toString()) {
                            return this.biz_type[i].name
                        }
                    }
                }
            },
            /**
             * 点击搜索
             */
            getListData () {
                this.currentPage = 1
                this.filterSearch = JSON.parse(JSON.stringify(this.filter))
                this.searchlist()
            },
            /**
             *  搜索筛选
             */
            searchlist () {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        pageNum: this.currentPage,
                        pageSize: this.pageSize,
                        filter: JSON.parse(JSON.stringify(this.filterSearch))
                    }
                }
                this.filter = this.removeSpaces(this.filter)
                params.data.filter = this.removeSpaces(params.data.filter)
                getrecordlist(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.tableData = res.data.list
                        this.total = res.data.total
                    }
                }).catch(() => {
                })
            },
            /**
             *  重置搜索条件
             */
            resetForm () {
                this.$refs.filter.resetFields()
                this.getListData()
            }
        },
        filters: {
            /**
             *  状态转换
             */
            getstate (val) {
                switch (val) {
                case 0:
                    return '成功'
                case 1:
                    return '失败'
                case 2:
                    return '交易中'
                }
            }
        },
        components: {Pagination}
    }
</script>

<style scoped>
    .p-title {
        font-weight: normal;
        font-size: 14px;
        color: #909399;
    }

    .recordtable {
        margin: 16px 0;
    }
</style>
