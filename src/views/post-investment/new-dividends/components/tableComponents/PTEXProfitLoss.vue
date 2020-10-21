<template>
    <div>
        <el-table
            :data="tableData"
            stripe
            style="width: 100%">
            <el-table-column
                prop="uid"
                width="120px"
                label="UID">
            </el-table-column>
            <el-table-column
                prop="updateTime"
                width="200px"
                label="最后操作时间">
                <template slot-scope="scope">
                    {{scope.row.updateTime | getZoneTime}}
                </template>
            </el-table-column>
            <el-table-column
                prop="currency"
                label="币种">
            </el-table-column>
            <el-table-column
                prop="description"
                label="描述">
            </el-table-column>
            <el-table-column
                prop="balance"
                label="余额">
            </el-table-column>
            <el-table-column
                prop="freezBalance"
                label="冻结">
            </el-table-column>
            <el-table-column
                prop="lockBalance"
                label="锁仓">
            </el-table-column>
            <el-table-column
                prop="totalBalance"
                label="合计金额">
            </el-table-column>
            <el-table-column
                prop="priceUnit"
                label="单价USDT">
            </el-table-column>
            <el-table-column
                prop="amount"
                label="分红USDT">
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getData()"/>
    </div>
</template>

<script>
    import {getPTEXProfitLoss} from '@/api/post-investment/new-dividends'
    import Pagination from '@/components/Pagination'

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
                getPTEXProfitLoss(params).then(res => {
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

