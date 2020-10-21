<template>
    <el-dialog
        :fullscreen="true"
        :visible.sync="dialogVisible"
        class="operation-dialog"
        :show-close="false"
        width="30%">
        <div class="dialog-content">
            <i class="el-icon-close close-dialog" @click="closeDialog"></i>
            <el-row type="flex" class="content-title" justify="space-between">
                <el-col :span="12">
                    <span v-if="isDetail">操作详情</span>
                    <span v-else>操作记录（{{businessDataId}}）</span>
                </el-col>
                <el-col :span="12" class="sort-btns">
                    <span class="active" v-if="sort">最新</span>
                    <span v-else @click="changeSort">最新</span>
                    <span class="active" v-if="!sort">最早</span>
                    <span v-else @click="changeSort">最早</span>
                </el-col>
            </el-row>
            <div class="content-main-box">
                <pagination layout="prev, pager, next" v-show="total > 0 && !isDetail"
                            :total="total" :page.sync="currentPage" :limit.sync="pageSize"
                            @pagination="getOperetionData"/>
                <!-- 详情展示user数据-->
                <el-row v-if="isDetail" type="flex" class="content-detail-desc" justify="space-between">
                    <el-col :span="8">
                        <span class="desc-lable">操作人：</span>
                        <span>{{operator}}</span>
                    </el-col>
                    <el-col :span="8">
                        <span class="desc-lable">角色：</span>
                        <span class="desc-text" :title="operatorRole">{{operatorRole}}</span>
                    </el-col>
                    <el-col :span="8">
                        <span class="desc-lable">UserID：</span>
                        <span>{{userId}}</span>
                    </el-col>
                </el-row>
                <div class="content-main-item" v-if="operationData.length > 0" v-for="(item, index) in operationData"
                     :key="index">
                    <!--详情展示操作编号-->
                    <p class="item-operationNum" v-if="isDetail">{{item.number}}</p>
                    <div class="item-msg">
                        <el-tooltip v-if="!isDetail" popper-class="msg-tooltip" class="item" effect="light"
                                    placement="bottom-start">
                            <span class="msg-uname">{{item.operator}}</span>
                            <div slot="content" class="tooltip-content">
                                <p class="content-title">操作人</p>
                                <section class="content-item">
                                    <span class="content-lable">操作人姓名</span>
                                    <span class="content-text">{{item.operator}}</span>
                                </section>
                                <section class="content-item">
                                    <span class="content-lable">UserId</span>
                                    <span class="content-text">{{item.userId}}</span>
                                </section>
                                <section class="content-item">
                                    <span class="content-lable">角色</span>
                                    <span class="content-text">{{item.operatorRole}}</span>
                                </section>
                            </div>
                        </el-tooltip>
                        <span class="msg-operation-type">{{item.action | getstate}}</span>
                        <span class="msg-operation-date">{{item.operatorTime | getZoneTime}}</span>
                        <span class="msg-operation-ip">{{item.operatorIp}}</span>
                        <span>{{item.tableIndex}}</span>
                        <div class="msg-table" v-if="item.modifyField.length > 0 && item.action === 'update'">
                            <el-table
                                :show-header="item.tableIndex === 0"
                                :data="item.modifyField"
                                stripe
                                style="width: 880px">
                                <el-table-column
                                    prop="fieldName"
                                    label="字段"
                                    width="200">
                                </el-table-column>
                                <el-table-column
                                    prop="beforeValue"
                                    label="原值">
                                </el-table-column>
                                <el-table-column
                                    prop="afterValue"
                                    label="新值">
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </div>
                <p class="content-main-empty" v-if="operationData.length === 0">暂无数据</p>
                <pagination v-show="total > 0 && !isDetail"
                            :total="total" :page.sync="currentPage" :limit.sync="pageSize"
                            @pagination="getOperetionData"/>
            </div>
            <p v-if="isDetail" class="detail-tip">仅展示当前操作人同一业务对象不超过五条的连续操作记录，更多操作请返回列表或前往对应业务模块查询</p>
        </div>
        <div slot="title" class="dialog-title"></div>
    </el-dialog>
</template>

<script>
    import {getOperationDetail, getOperationRecord} from '@/api/system/operation-record'
    import Pagination from '@/components/Pagination'

    export default {
        name: 'index',
        props: ['isDetail'],
        data () {
            return {
                // 控制弹窗是否显示
                dialogVisible: false,
                // 排序规则,true为最新排序，false为最早排序
                sort: true,
                // 当前页
                currentPage: 1,
                // 总条数
                total: 0,
                // 每页显示数量
                pageSize: 10,
                // 业务数据id
                businessDataId: undefined,
                // 用户id
                userId: undefined,
                // 模块
                businessModel: undefined,
                // 日志数据
                operationData: [],
                // 详情操作人
                operator: '',
                // 详情操作人角色
                operatorRole: ''
            }
        },
        methods: {
            /**
             * 显示弹窗
             */
            showDetail (businessDataId, businessModel, userId) {
                this.dialogVisible = true
                this.businessDataId = businessDataId
                this.businessModel = businessModel
                this.userId = userId
                this.getOperetionData()
            },
            /**
             * 关闭弹窗
             */
            closeDialog () {
                this.sort = true
                this.operationData = []
                this.dialogVisible = false
            },
            /**
             * 获取操作日志数据
             */
            getOperetionData () {
                if (this.$props.isDetail) {
                    this.getOperationDetail()
                } else {
                    this.getOperationRecord()
                }
            },
            /**
             * 获取操作详情
             */
            getOperationDetail () {
                const params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        userId: this.userId,
                        businessDataId: this.businessDataId,
                        businessModel: this.businessModel,
                        orderDesc: this.sort
                    }
                }
                getOperationDetail(params).then(res => {
                    if (res.code.toString() === '0') {
                        let dataList = res.data.list
                        let tableIndex = 0
                        for (let i = 0; i < dataList.length; i++) {
                            if (dataList[i].action === 'update') {
                                dataList[i]['tableIndex'] = tableIndex
                                tableIndex++
                            }
                        }
                        this.operationData = dataList
                        this.operator = res.data.operator
                        this.operatorRole = res.data.operatorRole
                        this.userId = res.data.userId
                    }
                })
            },
            /**
             * 获取操作记录
             */
            getOperationRecord () {
                const params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        pageNum: this.currentPage,
                        pageSize: this.pageSize,
                        filter: {
                            businessDataId: this.businessDataId,
                            businessModel: this.businessModel,
                            orderDesc: this.sort
                        }
                    }
                }
                getOperationRecord(params).then(res => {
                    if (res.code.toString() === '0') {
                        let dataList = res.data.list
                        let tableIndex = 0
                        for (let i = 0; i < dataList.length; i++) {
                            if (dataList[i].action === 'update') {
                                dataList[i]['tableIndex'] = tableIndex
                                tableIndex++
                            }
                        }
                        this.operationData = dataList
                        this.currentPage = res.data.pageNum
                        this.total = res.data.total
                    }
                })
            },
            /**
             * 切换排序
             */
            changeSort () {
                this.sort = !this.sort
                this.getOperetionData()
            }
        },
        filters: {
            /**
             *  状态转换
             */
            getstate (val) {
                switch (val) {
                case 'insert':
                    return '创建'
                case 'update':
                    return '更新'
                case 'delete':
                    return '删除'
                }
            }
        },
        components: {
            Pagination
        }
    }
</script>

<style lang="scss" scoped>
    .dialog-title {
        max-width: 1000px;
        margin: 0 auto;
        background-color: #fff;
    }

    .dialog-content {
        max-width: 1000px;
        margin: 0 auto;
        background-color: #fff;
        border-radius: 4px;
        height: calc(100vh - 40px);
        box-shadow: 0 0 4px 4px #e9e9e9;
        padding: 20px;
        .close-dialog {
            position: fixed;
            top: 16px;
            right: 20px;
            font-size: 24px;
            color: #333333;
            cursor: pointer;
        }
        .content-title {
            background-color: #ededed;
            padding: 16px 32px;
            font-size: 14px;
            border: 1px solid #d7d7d7;
            border-radius: 4px;
            .sort-btns {
                text-align: right;
                span {
                    color: #666666;
                    cursor: pointer;
                    font-size: 12px;
                    padding: 4px;
                    margin: 0 8px;
                    user-select: none;
                    &.active {
                        font-size: 13px;
                        cursor: auto;
                        border-bottom: 1px solid #333333;
                    }
                }
            }
        }
        .pagination-container {
            margin-top: 0;
            padding: 12px 32px;
            /deep/ .pagination {
                text-align: right;
            }
        }
        .content-main-box {
            padding: 24px 32px;
            height: calc(100% - 100px);
            overflow: auto;
            .content-detail-desc {
                padding: 12px 0;
                .desc-text {
                    display: inline-block;
                    width: calc(100% - 55px);
                    vertical-align: top;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    height: 16px;
                }
            }
            .content-main-item {
                margin-bottom: 20px;
                .item-operationNum {
                    color: #999999;
                    font-size: 12px;
                    text-align: center;
                    margin-bottom: 8px;
                }
                .item-msg {
                    font-size: 14px;
                    .msg-uname {
                        font-weight: bold;
                        cursor: pointer;
                        margin-right: 12px;
                    }
                    .msg-operation-type, .msg-operation-date, .msg-operation-ip {
                        margin-right: 8px;
                    }
                    .msg-table {
                        min-width: 880px;
                        overflow: auto;
                    }
                }
            }
            .content-main-empty {
                text-align: center;
                font-size: 18px;
                color: #666666;
            }
        }
        .detail-tip {
            color: #999999;
            font-size: 14px;
            text-align: center;
        }
    }

    /deep/ .el-dialog.is-fullscreen {
        background-color: #f0f0f0;
        padding: 20px;
    }

    /deep/ .el-dialog__header {
        padding: 0;
    }

    /deep/ .el-dialog__body {
        padding: 0;
    }
</style>
<style lang="scss">
    .msg-tooltip {
        border: none !important;
        box-shadow: 0 0 2px 2px #e9e9e9 !important;
        .tooltip-content {
            width: 200px;
            .content-title {
                font-size: 14px;
                color: #666666;
                margin-top: 0;
            }
            .content-item {
                margin-bottom: 12px;
                padding-left: 16px;
                .content-lable {
                    font-weight: bold;
                    display: inline-block;
                    width: 100%;
                    font-size: 12px;
                    margin-bottom: 4px;
                    color: #666666;
                }
                .content-text {
                    font-size: 12px;
                    display: inline-block;
                    width: 100%;
                    color: #999999;
                }
            }
        }
        .popper__arrow {
            border-bottom-color: #e9e9e9 !important;
        }
    }
</style>
