<template>
    <div class="app-container">
        <el-form :inline="true" ref="filter" :model="filter" class="filter-form-inline">
            <el-form-item label="UID" prop="uid">
                <el-input v-model="filter.uid" size="small" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="币种" prop="currency">
                <el-select v-model="filter.currency" size="small" placeholder="" filterable>
                    <el-option
                        v-for="item in currency"
                        :key="item.curId"
                        :label="item.code"
                        :value="item.code">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="TXID" prop="txid">
                <el-input v-model="filter.txid" size="small" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="充值地址" prop="fromAddr">
                <el-input v-model="filter.fromAddr" size="small" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="到账地址" prop="toAddr">
                <el-input v-model="filter.toAddr" size="small" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="state">
                <el-select v-model="filter.state" size="small" placeholder="" filterable>
                    <el-option label="成功" :value="0"></el-option>
                    <el-option label="失败" :value="1"></el-option>
                    <el-option label="充值中" :value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchList(filter)" size="small">搜索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button @click="resetForm" size="small">重置</el-button>
            </el-form-item>
        </el-form>
        <el-table
            class="recordtable"
            :data="tableData"
            style="width: 100%"
            stripe>
            <el-table-column
                fixed
                prop="transferHash"
                label="单号"
                width="200">
            </el-table-column>
            <el-table-column
                prop="uid"
                width="95"
                label="UID">
            </el-table-column>
            <el-table-column
                prop="amount"
                label="充值数量">
            </el-table-column>
            <el-table-column
                prop="currency"
                label="币种"
                width="80">
            </el-table-column>
            <el-table-column
                label="充值时间"
                width="160">
                <template slot-scope="scope">
                    <span>{{scope.row.createTime | getZoneTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="txid"
                label="TXID">
            </el-table-column>
            <el-table-column
                prop="fromAddr"
                width="350"
                label="充值地址">
            </el-table-column>
            <el-table-column
                prop="toAddr"
                width="350"
                label="到账地址">
            </el-table-column>
            <el-table-column
                fixed="right"
                label="状态"
                width="70">
                <template slot-scope="scope">
                    <span>{{scope.row.state | state(scope.row.stateReason)}}</span>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="currentPage" :limit.sync="pageSize"
                    @pagination="searchList(filterOld)"/>
    </div>
</template>

<script>
    import {rechargeRecord, getCurrency} from '@/api/finance/recharge'
    import Pagination from '@/components/Pagination'

    export default {
        data () {
            return {
                // 数据个数
                pageSize: 10,
                // 当前页
                currentPage: 1,
                // 数据总数
                total: 0,
                // 表格数据
                tableData: [],
                // 币种列表
                currency: [],
                // 展示的筛选条件
                filter: {
                    uid: '',
                    currency: '',
                    txid: '',
                    fromAddr: '',
                    toAddr: '',
                    state: ''
                },
                // 查询的筛选条件
                filterOld: {
                    uid: '',
                    currency: '',
                    txid: '',
                    fromAddr: '',
                    toAddr: '',
                    state: ''
                }
            }
        },
        // 转换时间格式
        filters: {
            /**
             *  状态转换
             */
            state (val, stateReason) {
                let state = ''
                switch (val) {
                case 0 :
                    state = '成功'
                    break
                case 1 :
                    stateReason !== '1' ? state = '失败' : state = '未入账'
                    break
                case 2 :
                    state = '充值中'
                    break
                }
                return state
            }
        },
        // 初始化充值数据
        created () {
            if (this.$route.query.currency) {
                this.filter.currency = this.$route.query.currency
            }
            this.getCurrencyList()
            this.searchList(this.filter)
        },
        methods: {
            /**
             * 分页查询
             */
            searchList (filter) {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        pageSize: this.pageSize,
                        pageNum: this.currentPage,
                        filter: filter
                    }
                }
                params.data.filter = this.removeSpaces(params.data.filter)
                rechargeRecord(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.filterOld = {
                            uid: this.filter.uid,
                            currency: this.filter.currency,
                            txid: this.filter.txid,
                            fromAddr: this.filter.fromAddr,
                            toAddr: this.filter.toAddr,
                            state: this.filter.state
                        }
                        this.tableData = res.data.list
                        this.total = parseInt(res.data.total)
                    }
                })
            },
            /**
             *  筛选条件重置
             */
            resetForm () {
                this.$refs.filter.resetFields()
                // 筛选条件
                this.filterOld = {
                    uid: '',
                    currency: '',
                    txid: '',
                    fromAddr: '',
                    toAddr: '',
                    state: ''
                }
                this.searchList()
            },
            /**
             *  获取币种列表
             */
            getCurrencyList () {
                let params = {
                    traceId: Math.random().toString(36).substr(2)
                }
                getCurrency(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.currency = res.data.list
                    }
                }).catch()
            }
        },
        components: {Pagination}
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    /deep/ .recharge-header-bg {
        background-color: #FAFAFA;
    }

    /deep/ .el-pagination {
        margin: 20px auto;
    }

    .recordtable {
        margin: 16px 0;
    }
</style>
