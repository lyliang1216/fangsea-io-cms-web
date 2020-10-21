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
                prop="snapshotTime"
                width="200px"
                label="快照时间">
                <template slot-scope="scope">
                    {{scope.row.snapshotTime | getZoneTime}}
                </template>
            </el-table-column>
            <el-table-column
                prop="address"
                label="地址">
            </el-table-column>
            <el-table-column
                prop="currency"
                label="币种">
            </el-table-column>
            <el-table-column
                prop="balance"
                label="余额">
            </el-table-column>
            <el-table-column
                prop="usableBalance"
                label="可用">
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
                prop="updateTime"
                width="200px"
                label="最后更新时间">
                <template slot-scope="scope">
                    {{scope.row.updateTime | getZoneTime}}
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getData()"/>
    </div>
</template>

<script>
    import {getPTOSnapshot} from '@/api/post-investment/new-dividends'
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
                getPTOSnapshot(params).then(res => {
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

