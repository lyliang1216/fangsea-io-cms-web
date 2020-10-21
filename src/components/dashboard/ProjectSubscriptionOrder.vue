<template>
    <div>
        <div v-if="tabsType === 0">
            <span>项目认购订单</span>
            <el-divider/>
            <el-table
                stripe
                :data="list">
                <el-table-column
                    label="Ticker">
                    <template slot-scope="props">
                        <el-button
                            v-auth="{id: 10200010000}"
                            type="text"
                            size="small">
                            <router-link :to="{'path':'/order/releaseorder', 'query':{'ticker': props.row.ticker}}"
                                         tag="a" target="_blank">
                                {{props.row.ticker}}
                            </router-link>
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    label="销售额(USDT)"
                    prop="salesVolume">
                </el-table-column>
                <el-table-column
                    label="认购投资人总数"
                    prop="totalPeople">
                </el-table-column>
                <el-table-column
                    label="认购订单总数"
                    prop="totalOrders">
                </el-table-column>
            </el-table>
            <pagination v-show="total > 0" :total="total" :page.sync="pageNum" :limit.sync="pageSize" @pagination="getTabsReleaseOrderData"/>
        </div>
        <div v-else>
            <span>投资人充值</span>
            <el-divider/>
            <el-table
                stripe
                :data="list">
                <el-table-column
                    label="币种">
                    <template slot-scope="props">
                        <el-button
                            v-auth="{id: 10500010000}"
                            type="text"
                            size="small">
                            <router-link :to="{'path':'/finance/recharge', 'query':{'currency': props.row.currency}}"
                                         tag="a" target="_blank">
                                {{props.row.currency}}
                            </router-link>
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    label="充值总量"
                    prop="totalRecharge">
                </el-table-column>
                <el-table-column
                    label="充值总次数"
                    prop="totalNumberOfrecharge">
                </el-table-column>
                <el-table-column
                    label="充值总人数"
                    prop="totalNumberOfPeople">
                </el-table-column>
            </el-table>
            <pagination v-show="total > 0" :total="total" :page.sync="pageNum" :limit.sync="pageSize" @pagination="getTabsInvestmentRechargeData"/>
        </div>
    </div>
</template>

<script>
    import { getTabsReleaseOrderData, getTabsInvestmentRechargeData } from '@/api/dashboard/index'
    import Pagination from '@/components/Pagination'

    export default {
        name: 'ProjectSubscriptionOrder',
        props: ['timeRange', 'tabsType'],
        data () {
            return {
                // 提现列表数据
                list: [],
                // 数据总数
                total: 0,
                // 当前页码
                pageNum: 1,
                // 分页条数
                pageSize: 10
            }
        },
        created () {
            this.checkTabsType()
        },
        watch: {
            timeRange (val) {
                this.checkTabsType()
            },
            tabsType (val) {
                this.checkTabsType()
            }
        },
        methods: {
            // 判断类型查询列表
            checkTabsType () {
                if (this.tabsType === 0) {
                    this.getTabsReleaseOrderData()
                } else {
                    this.getTabsInvestmentRechargeData()
                }
            },
            // 获取项目认购订单
            getTabsReleaseOrderData () {
                let data = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        startTime: this.timeRange[0],
                        endTime: this.timeRange[1],
                        pageSize: this.pageSize,
                        pageNum: this.pageNum
                    }
                }
                getTabsReleaseOrderData(data).then(response => {
                    if (response.code.toString() === '0') {
                        this.list = response.data.list
                        this.total = response.data.total
                    } else {
                        this.$message.error(response.msg)
                    }
                })
            },
            // 获取项目认购订单
            getTabsInvestmentRechargeData () {
                let data = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        startTime: this.timeRange[0],
                        endTime: this.timeRange[1],
                        pageSize: this.pageSize,
                        pageNum: this.pageNum
                    }
                }
                getTabsInvestmentRechargeData(data).then(response => {
                    if (response.code.toString() === '0') {
                        this.list = response.data.list
                        this.total = response.data.total
                    } else {
                        this.$message.error(response.msg)
                    }
                })
            }
        },
        components: {
            Pagination
        }
    }
</script>

<style scoped>
    .target {
        color: #3AA1FF;
    }
</style>
