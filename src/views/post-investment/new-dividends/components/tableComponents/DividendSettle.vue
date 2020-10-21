<template>
    <div>
        <el-table
            :data="tableData"
            stripe
            style="width: 100%">
            <el-table-column
                prop="type"
                width="200px"
                label="类型">
                <template slot-scope="scope">
                    <span>{{scope.row.type | typeFilter}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="bizAccountId"
                width="200px"
                label="赠币账户">
            </el-table-column>
            <el-table-column
                prop="uid"
                width="200px"
                label="UID">
            </el-table-column>
            <el-table-column
                prop="address"
                label="地址">
            </el-table-column>
            <el-table-column
                prop="currency"
                width="200px"
                label="币种">
            </el-table-column>
            <el-table-column
                prop="amount"
                label="数量">
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getData()"/>
    </div>
</template>

<script>
    import {getDividendSettle} from '@/api/post-investment/new-dividends'
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
                getDividendSettle(params).then(res => {
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
        },
        filters: {
            // 类型
            typeFilter (type) {
                switch (type) {
                case 'PTEx':
                    return 'PTEx'
                case 'PTOHOME':
                    return 'PTOHome'
                case 'THIRD_PARTY':
                    return '第三方'
                }
            }
        }
    }
</script>
