<template>
    <div>
        <el-table
            :data="tableData"
            stripe
            style="width: 100%">
            <el-table-column
                prop="number"
                width="120px"
                label="损益表编号">
            </el-table-column>
            <el-table-column
                prop="data"
                label="DATA">
            </el-table-column>
            <el-table-column
                prop="errorInfo"
                label="异常信息">
            </el-table-column>
            <el-table-column
                prop="createTime"
                width="200px"
                label="创建时间">
                <template slot-scope="scope">
                    {{scope.row.createTime | getZoneTime}}
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getData()"/>
    </div>
</template>

<script>
    import {getErrorMessage} from '@/api/post-investment/new-dividends'
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
                getErrorMessage(params).then(res => {
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

