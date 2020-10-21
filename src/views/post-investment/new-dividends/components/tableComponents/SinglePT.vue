<template>
    <div>
        <el-table
            :data="tableData"
            stripe
            style="width: 100%">
            <el-table-column
                prop="ticker"
                width="120px"
                label="PT代码">
            </el-table-column>
            <el-table-column
                prop="totalValue"
                label="项目总价THB">
            </el-table-column>
            <el-table-column
                prop="ptAmount"
                label="PT数量">
            </el-table-column>
            <el-table-column
                prop="roi"
                label="年回报率(%)">
            </el-table-column>
            <el-table-column
                prop="totalDividend"
                label="年总分红THB">
            </el-table-column>
            <el-table-column
                prop="dailyDividendThb"
                label="每份PT日分红THB">
            </el-table-column>
            <el-table-column
                prop="rate"
                label="THB:USDT汇率">
            </el-table-column>
            <el-table-column
                prop="dailyDividendUsdt"
                label="每份PT日分红USDT">
            </el-table-column>
            <el-table-column
                prop="cycleTotalDividendUsdt"
                label="本期总分红USDT">
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getData()"/>
    </div>
</template>

<script>
    import Pagination from '@/components/Pagination'
    import {getSinglePT} from '@/api/post-investment/new-dividends'

    export default {
        data () {
            return {
                // 表格数据
                tableData: [],
                // 数据总数
                total: 0,
                // 当前页
                page: 1,
                // 分页条数
                limit: 10
            }
        },
        created () {
            this.getData()
        },
        methods: {
            /**
             * 查询表格数据
             */
            getData () {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        pageNum: this.page,
                        pageSize: this.limit,
                        filter: this.$route.query.profitId.toString()
                    }
                }
                getSinglePT(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.tableData = res.data.list
                        this.total = res.data.total
                    } else {
                        this.$message.error(res.msg)
                    }
                }).catch(err => {
                    this.$message.error(err.msg)
                })
            }
        },
        components: {
            Pagination
        }
    }
</script>

