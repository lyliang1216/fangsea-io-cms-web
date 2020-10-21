<template>
    <div class="app-container">
        <div class="word">
            <p>
                当前页面配置
                <span>
                    <a href="https://www.ptohome.com/computer/CertificatePurchase" target="_blank">PTOHome房产通证购买页面</a>
                </span>
                的布局。
            </p>
            <p>注意：当项目布局调整后，房产通证购买页面将立即生效，请谨慎操作！</p>
        </div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>正在进行</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="resetOrder">重置为默认</el-button>
            </div>
            <div class="text item">
                <el-table
                    stripe
                    class="text item"
                    :data="projectData"
                    style="width: 100%"
                    row-key="sort">
                    <el-table-column
                        prop="name"
                        label="项目名称">
                    </el-table-column>
                    <el-table-column
                        prop="ticker"
                        label="ticker">
                    </el-table-column>
                    <el-table-column
                        prop="totalAmount"
                        label="可售PT总量">
                    </el-table-column>
                    <el-table-column
                        label="进度">
                        <template slot-scope="props">
                            {{getSchedule(props.row)}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="state"
                        label="状态">
                        <template slot-scope="props">
                            {{props.row.state | getState}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="createTime"
                        label="创建时间">
                        <template slot-scope="props">
                            {{props.row.createTime | getZoneTime}}
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
    </div>
</template>

<script>
    import {getProList, saveProOrder, resetProOrder} from '@/api/content/project-order'
    import Sortable from 'sortablejs'

    export default {
        data () {
            return {
                // 列表数据
                projectData: [],
                // 排序上传使用
                projectDataOrder: [],
                // 防止重复拖拽
                disabled: true
            }
        },
        mounted () {
            this.getList()
            this.rowDrop()
        },
        methods: {
            /**
             * 获取项目列表
             * @param f 修改失败后刷新
             */
            getList (f) {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        pageSize: 0
                    }
                }
                if (f === 0) {
                    this.projectData = []
                }
                getProList(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.projectData = res.data.list
                        this.projectDataOrder = res.data.list
                    }
                })
            },
            /**
             * 重置为默认
             */
            resetOrder () {
                let params = {
                    traceId: Math.random().toString(36).substr(2)
                }
                resetProOrder(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.getList()
                    }
                })
            },
            /**
             * 行拖拽
             */
            rowDrop () {
                let tbody = document.querySelector('.el-table__body-wrapper tbody')
                let _this = this
                Sortable.create(tbody, {
                    // 禁用拖拽
                    sort: _this.disabled,
                    onEnd ({newIndex, oldIndex}) {
                        if (newIndex !== oldIndex) {
                            _this.saveOrder(newIndex, oldIndex)
                        }
                    }
                })
            },
            /**
             * 修改项目顺序
             * @param newIndex 新的位置
             * @param oldIndex 原来的位置
             */
            saveOrder (newIndex, oldIndex) {
                let oldSort = this.projectDataOrder[oldIndex].sort
                let newSort = this.projectDataOrder[newIndex].sort
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        oldSort: oldSort,
                        newSort: newSort
                    }
                }
                this.disabled = false
                saveProOrder(params).then(res => {
                    this.disabled = true
                    if (res.code.toString() === '0') {
                        this.$message.success('操作成功')
                        let currRow = this.projectData.splice(oldIndex, 1)[0]
                        this.projectData.splice(newIndex, 0, currRow)
                        this.getList()
                    } else {
                        this.$message.error(res.msg)
                        this.getList(0)
                    }
                }).catch(err => {
                    this.disabled = true
                    this.$message.error(err.msg)
                    this.getList(0)
                })
            },
            /**
             * 获取进度
             * @param row 行数据
             */
            getSchedule (row) {
                let saleRatio = row.saleRatio
                if (row.state === 2) {
                    return '-'
                } else if (saleRatio === null) {
                    return '0%'
                } else if (Number(saleRatio) === 100) {
                    return '售罄'
                } else if (row.minimumBuyAmount / row.totalAmount * 100 <= row.sellOutRatio) {
                    // 达标比例小于等于即将售罄比例时
                    if (saleRatio >= row.sellOutRatio) {
                        return saleRatio + '%（即将售罄）'
                    } else if (row.saleAmount >= row.minimumBuyAmount) {
                        return saleRatio + '%（预售额达标）'
                    } else {
                        return saleRatio + '%'
                    }
                    // 达标比例大于即将售罄比例时，不显示即将售罄
                } else if (row.saleAmount >= row.minimumBuyAmount) {
                    return saleRatio + '%（预售额达标）'
                } else if (saleRatio >= row.sellOutRatio) {
                    return saleRatio + '%'
                } else {
                    return saleRatio + '%'
                }
            }
        },
        filters: {
            getState (state) {
                switch (state) {
                case 0:
                    return '创建'
                case 1:
                    return '未发行'
                case 2:
                    return '等待预售'
                case 3:
                    return '开始预售'
                case 4:
                    return '预售完成'
                case 5:
                    return '预售失败'
                case 6:
                    return '已发行'
                case 7:
                    return '已取消'
                case 8:
                    return '已删除'
                default:
                    break
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .word {
        color: #828282;
        span {
            color: #2EA9DF;
        }
    }
</style>
