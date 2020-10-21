<template>
    <div class="app-container">
        <div class="tx-title" v-auth="{id: 10500020002}">
            <div class="tx-right" v-show="isShow">
                <span class="tx-span" v-if="accelerateTime === null">最长一笔提现链上发起交易距现在 <span class="tx-time">{{transferTime | toMMSS}}</span></span>
                <span class="tx-span" v-else>交易正在加速，该交易上一次加速发起于 <span class="tx-time">{{accelerateTime | toMMSS}}</span> 前，请耐心等待</span>
                <el-button v-if="accelerateStatus" type="primary" size="mini" @click="checkQuicken">提现加速</el-button>
                <template v-else>
                    <el-button type="info" size="mini" disabled>提现加速</el-button>
                    <el-button class="tx-refersh" type="info" size="mini" @click="getQuickenStatus">
                        <svg t="1566888837044" class="icon" viewBox="0 0 1024 1024" version="1.1"
                             xmlns="http://www.w3.org/2000/svg" p-id="1991" width="16" height="16">
                            <path
                                d="M834.2 531.9c0 187.7-152.2 339.9-339.9 339.9S154.4 719.7 154.4 531.9c0-187.7 152.2-339.9 339.9-339.9 124.8 0 233.6 67.5 292.7 167.7h63.8c-64.1-132.5-199.4-224.1-356.5-224.1C275.4 135.6 98 313.1 98 531.9s177.4 396.3 396.3 396.3 396.3-177.4 396.3-396.3c0-4.9-0.6-9.7-0.7-14.6 0 0-1.4-28.9-28.7-28.9-30.6 0-27.6 28.9-27.6 28.9 0.1 4.9 0.6 9.7 0.6 14.6z"
                                fill="#2680F0" p-id="1992"></path>
                            <path
                                d="M853.9 101.1C843 100 833.1 108 832 119l-21.6 213.7c-1.1 10.9-11 19-21.9 17.9L574.8 329c-10.9-1.1-20.8 6.9-21.9 17.9l-1.5 14.8c-1.1 10.9 6.9 20.8 17.9 21.9L783 405.2c10.9 1.1 19.9 2 19.9 2s9 0.9 19.9 2l14.8 1.5c10.9 1.1 20.8-6.9 21.9-17.9l27.1-268.3c1.1-10.9-6.9-20.8-17.9-21.9l-14.8-1.5z"
                                fill="#2680F0" p-id="1993"></path>
                        </svg>
                    </el-button>
                </template>
            </div>
        </div>
        <el-table
            stripe
            :data="list">
            <el-table-column
                label="单号"
                prop="orderId"
                width="180px">
            </el-table-column>
            <el-table-column
                label="UID"
                width="100px"
                prop="userCode">
            </el-table-column>
            <el-table-column
                width="100px"
                label="提现数量"
                prop="amount">
            </el-table-column>
            <el-table-column
                width="100px"
                label="提现币种"
                prop="curCode">
            </el-table-column>
            <el-table-column
                width="80px"
                label="手续费"
                prop="fee">
            </el-table-column>
            <el-table-column
                label="手续费币种"
                prop="feeCurCode"
                width="100px">
            </el-table-column>
            <el-table-column
                label="提现时间"
                width="170px">
                <template slot-scope="props">
                    {{ props.row.applyDate | getZoneTime }}
                </template>
            </el-table-column>
            <el-table-column
                label="提现地址"
                prop="toAddr">
            </el-table-column>
            <el-table-column
                label="TXID"
                prop="transHash">
            </el-table-column>
            <el-table-column
                label="审核人"
                width="80px"
                prop="checkStaff">
            </el-table-column>
            <el-table-column
                label="状态"
                width="80px">
                <template slot-scope="props">
                    {{ matchState(props.row.state) }}
                </template>
            </el-table-column>
            <el-table-column
                :fixed="list.length===0?false:'right'"
                width="160px"
                label="操作">
                <template slot-scope="scope">
                    <el-button
                        v-auth="{id: 10500020001}"
                        v-if="scope.row.state === 0"
                        size="mini"
                        @click="handlePass(scope.$index, scope.row, true)">通过
                    </el-button>
                    <el-button
                        v-auth="{id: 10500020001}"
                        v-if="scope.row.state === 0"
                        size="mini"
                        type="danger"
                        @click="handlePass(scope.$index, scope.row, false)">不通过
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="pageNum" :limit.sync="pageSize" @pagination="getList"/>
        <el-dialog
            class="dialog-quicken"
            title="提现加速"
            :visible.sync="dialogVisible"
            width="50%">
            <div class="dialog-body">
                <div class="tx-right">
                    <span class="tx-span-body">提现队列中共 <span class="tx-time">{{GweiData.currentApplyCount}}</span> 笔提现正在处理，你将对队列第一笔提现加速</span>
                </div>
                <el-row :gutter="30" class="row-body">
                    <el-col :span="8" class="text-right"><span>提现单号</span></el-col>
                    <el-col :span="10"><span>{{GweiData.orderId}} </span></el-col>
                </el-row>
                <el-row :gutter="30" class="row-body">
                    <el-col :span="8" class="text-right"><span>UID</span></el-col>
                    <el-col :span="10"><span>{{GweiData.userCode}} </span></el-col>
                </el-row>
                <el-row :gutter="30" class="row-body">
                    <el-col :span="8" class="text-right"><span>提现数量</span></el-col>
                    <el-col :span="10"><span>{{GweiData.applyAmount}} {{GweiData.curCode}} (实际到账 {{GweiData.actualAmount}} {{GweiData.curCode}})</span>
                    </el-col>
                </el-row>
                <el-row :gutter="30" class="row-body">
                    <el-col :span="8" class="text-right"><span>提现地址</span></el-col>
                    <el-col :span="10"><span>{{GweiData.toAddr}} </span></el-col>
                </el-row>
                <el-row :gutter="30" class="row-body">
                    <el-col :span="8" class="text-right"><span>提现 Gas Price</span></el-col>
                    <el-col :span="10"><span>{{GweiData.currentGasPrice}} Gwei</span></el-col>
                </el-row>
                <el-row :gutter="30" class="row-body">
                    <el-col :span="8" class="text-right"><span>提现审批发起</span></el-col>
                    <el-col :span="10"><span style="color: red">{{GweiData.initiateTime | toMMSS}} </span>前</el-col>
                </el-row>
                <el-row :gutter="30" class="row-body">
                    <el-col :span="8" class="text-right"><span>系统最高 Gas Price 限制</span></el-col>
                    <el-col :span="10"><span>{{GweiData.maxGasPrice}} Gwei</span></el-col>
                </el-row>
                <el-row :gutter="30" class="row-body">
                    <el-col :span="8" class="text-right"><span>最近区块最高 Gas Price</span></el-col>
                    <el-col :span="10"><span>{{GweiData.highestGasPrice}} Gwei</span></el-col>
                </el-row>
                <el-row :gutter="30" class="row-body">
                    <el-col :span="8" class="text-right"><span>加权平均 Gas Price</span></el-col>
                    <el-col :span="10"><span>{{GweiData.avgGasPrice}} Gwei</span></el-col>
                </el-row>

                <el-row :gutter="30" class="row-body input-body">
                    <el-col :span="8" class="text-right"><span>设置 Gas Price</span></el-col>
                    <el-col :span="12" class="Gwei-col">
                        <el-input
                            class="Gwei-input"
                            placeholder="请输入 Gas Price"
                            v-model="Gwei"
                            :min="GweiData.minGasPrice"
                            :max="GweiData.maxGasPrice"
                            @keyup.native="number"
                            @blur="checkGwei">
                        </el-input>
                        <div class="Gwei-unit">
                            Gwei
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="30" class="row-body">
                    <el-col :span="10" :offset="8"><span>1 Gwei</span> = <span>0.000000001 Eth</span></el-col>
                </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="quicken" :disabled="disabled">立即加速</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {
        getWithdrawList,
        approvedWithdraw,
        getWithdrawAccelerateStatus,
        checkWithdrawCashImmediately,
        WithdrawCashImmediately
    } from '@/api/finance/withdraw'
    import Pagination from '@/components/Pagination'
    import {judgingempty} from '@/utils/validate'
    import {toMMSS} from '@/utils/filters'

    export default {
        components: {Pagination},
        filters: {
            // 分钟 秒
            toMMSS
        },
        data () {
            return {
                // 提现列表数据
                list: [],
                // 数据总数
                total: 0,
                // 当前页码
                pageNum: 1,
                // 分页条数
                pageSize: 20,
                // 总页数
                pages: (this.total + this.pageSize - 1) / this.pageSize,
                // 提现加速
                dialogVisible: false,
                // 立即加速是否可用
                disabled: true,
                // 加速Gwei
                Gwei: '',
                // 立即加速窗口数据
                GweiData: {
                    'minGasPrice': '0',
                    'maxGasPrice': '0',
                    'highestGasPrice': '0',
                    'avgGasPrice': '0',
                    'currentGasPrice': '0',
                    'orderId': '0',
                    'userCode': '0',
                    'applyAmount': '0',
                    'actualAmount': '0',
                    'curCode': '0',
                    'currentApplyCount': '0',
                    'toAddr': '0',
                    'initiateTime': '0'
                },
                // 提现加速按钮
                accelerateStatus: true,
                // 发起交易距离现在时间(分钟)
                transferTime: 0,
                // 发起加速距离现在时间(分钟)
                accelerateTime: null,
                // 是否显示加速功能
                isShow: false
            }
        },
        created () {
            // 初始化获取列表数据
            this.getList()
        },
        methods: {
            // 只能输入整数
            number () {
                this.Gwei = this.Gwei.replace(/[^.\d]/g, '')
                this.Gwei = this.Gwei.replace('.', '')
            },
            // 校验用户设置的Gwei
            checkGwei () {
                if (parseInt(this.Gwei) < parseInt(this.GweiData.minGasPrice)) {
                    this.Gwei = parseInt(this.GweiData.minGasPrice)
                }
                if (parseInt(this.Gwei) > parseInt(this.GweiData.maxGasPrice)) {
                    this.Gwei = parseInt(this.GweiData.maxGasPrice)
                }
                if (!judgingempty(this.Gwei)) {
                    this.disabled = true
                } else {
                    this.disabled = false
                }
            },
            /**
             * 是否提现加速可用
             */
            getQuickenStatus () {
                let data = {
                    traceId: Math.random().toString(36).substr(2)
                }
                getWithdrawAccelerateStatus(data).then(res => {
                    if (res.code.toString() === '0') {
                        if (res.data) {
                            this.isShow = true
                            this.accelerateTime = res.data.accelerateTime
                            this.accelerateStatus = res.data.accelerateStatus
                            this.transferTime = res.data.transferTime
                        } else {
                            this.isShow = false
                        }
                    } else {
                        this.$message.error(res.msg)
                    }
                }).catch((err) => {
                    this.$message.error(err.msg)
                })
            },
            /**
             * 点击提现加速校验加速信息
             */
            checkQuicken () {
                let data = {
                    traceId: Math.random().toString(36).substr(2)
                }
                checkWithdrawCashImmediately(data).then(res => {
                    if (res.code.toString() === '0') {
                        this.GweiData = res.data
                        this.Gwei = ''
                        this.disabled = true
                        this.dialogVisible = true
                    } else {
                        // 初始化提现按钮
                        this.getQuickenStatus()
                        this.$message.error(res.msg)
                    }
                }).catch((err) => {
                    this.$message.error(err.msg)
                })
            },
            // 立即加速
            quicken () {
                if (!judgingempty(this.Gwei)) {
                    this.$message({
                        message: '请输入 Gas Price',
                        type: 'error'
                    })
                } else {
                    let data = {
                        traceId: Math.random().toString(36).substr(2),
                        data: {
                            transferHash: this.GweiData.orderId,
                            newGasPrice: this.Gwei
                        }
                    }
                    WithdrawCashImmediately(data).then(res => {
                        if (res.code.toString() === '0') {
                            this.dialogVisible = false
                            // 初始化提现按钮
                            this.getQuickenStatus()
                            this.$message.success('加速成功')
                        } else {
                            this.$message.error(res.msg)
                        }
                    }).catch((err) => {
                        this.$message.error(err.msg)
                    })
                }
            },
            // 获取提现列表数据
            getList () {
                let formData = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                        total: this.total,
                        pages: this.pages
                    }
                }
                getWithdrawList(formData).then(response => {
                    let res = response.data
                    this.list = res.list
                    this.pageNum = res.pageNum
                    this.pageSize = res.pageSize
                    this.total = res.total
                    this.pages = res.pages
                    // 初始化提现按钮
                    this.getQuickenStatus()
                })
            },
            // 是否通过提现
            handlePass (index, row, isPass) {
                let rowData = row
                rowData['applyState'] = isPass ? 1 : 2
                let formData = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        fromAddr: row.fromAddr,
                        toAddr: row.toAddr,
                        amount: row.amount,
                        curCode: row.curCode,
                        fee: row.fee,
                        feeCurCode: row.feeCurCode,
                        orderId: row.orderId,
                        userCode: row.userCode,
                        state: isPass ? 1 : 2
                    }
                }
                approvedWithdraw(formData).then(res => {
                    if (res.code.toString() === '0') {
                        this.$message.success('操作成功')
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'error'
                        })
                    }
                    this.getList()
                })
            },
            // 状态
            matchState (state) {
                switch (state) {
                case 0:
                    return '待审核'
                case 1:
                    return '通过'
                case 2:
                    return '已拒绝'
                case 3:
                    return '已撤销'
                case 4:
                    return '已完成'
                case 5:
                    return '提现失败'
                case 6:
                    return '提现中'
                default:
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .tx-title {
        text-align: right;

        .tx-right {
            float: right;
            font-size: 12px;
            color: #9DA0A2;
            display: flex;
            align-items: center;

            .tx-span {
                margin-right: 25px;
            }

            .tx-time {
                color: red;
            }

            .tx-refersh {
                width: 28px;
                height: 28px;
                margin-left: -2px;
                border: none;
                background: #ECF0F2;
                border-radius: 0;
                padding: 0;
            }
        }
    }

    .tx-right {
        font-size: 12px;
        color: #9DA0A2;
        display: flex;
        align-items: center;

        .tx-span-body {
            margin-right: 25px;
            margin-bottom: 30px;
        }

        .tx-time {
            color: red;
        }
    }

    .dialog-body {
        padding: 0 100px;

        .input-body {
            margin-top: 30px;
            display: flex;
            align-items: center;

            .Gwei-input {
                width: 250px;

                /deep/ .el-input__inner {
                    text-align: left;
                }
            }

            .Gwei-col {
                display: flex;
            }

            .Gwei-unit {
                width: 80px;
                height: 40px;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #F5F7FA;
                border-bottom-right-radius: 4px;
                border-top-right-radius: 4px;
                border: 1px solid #D0D3DB;
                margin-left: -3px;
                z-index: 2;
            }
        }

        .row-body {
            margin-bottom: 20px;

            .text-right {
                text-align: right;
            }
        }
    }

    .dialog-quicken {
        /deep/ .el-dialog__footer {
            text-align: center;
            padding: 40px 20px 80px 20px;
        }
    }
</style>
