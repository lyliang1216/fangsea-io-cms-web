<template>
    <div class="app-container">
        <div style="display: flex;align-items: center">
            <!-- 按钮 -->
            <div v-auth="{id: 10100040004}">
                <el-button type="primary" size="small" @click="addCurrency"> + 新增币种</el-button>
            </div>
        </div>
        <!-- 表格 -->
        <el-table stripe
                  :data="tableData"
                  style="width: 100%">
            <el-table-column
                label=" 币种名称 "
                width="140">
                <template slot-scope="scope">
                    <span>{{ scope.row.currency }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label=" 是否开启 "
                width="140">
                <template slot-scope="scope">
                    <span>{{ scope.row.state | state}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label=" 是否开放充值 "
                width="140">
                <template slot-scope="scope">
                    <span>{{ scope.row.rechargeDisable | rechargeDisable}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label=" 是否开放提现 "
                width="140">
                <template slot-scope="scope">
                    <span>{{ scope.row.withdrawDisable | withdrawDisable }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label=" 排序 "
                width="60">
                <template slot-scope="scope">
                    <span>{{ scope.row.orderNum }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label=" 最小充值数量 "
                width="140">
                <template slot-scope="scope">
                    <span>{{ scope.row.rechargeLimitDown | nullToLine}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="手续费币种"
                width="140">
                <template slot-scope="scope">
                    <span>{{ scope.row.withdrawFeeCur }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="提现手续费"
                width="140">
                <template slot-scope="scope">
                    <span>{{ scope.row.withdrawFee }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="310">
                <template slot-scope="scope">
                    <el-button
                        size="mini" v-auth="{id: 10100040001}"
                        @click="editCurrency(scope.$index, scope.row)"> 编辑信息
                    </el-button>
                    <el-button
                        v-auth="{id: 10100040002}"
                        v-if="scope.row.contractAddr === null || scope.row.contractAddr === ''"
                        size="mini"
                        @click="showDialogForm(scope.$index, scope.row)"> 绑定合约地址
                    </el-button>
                    <el-button
                        v-auth="{id: 10100040003}"
                        v-if="scope.row.state === 0"
                        size="mini"
                        @click="changeUseContract(scope.row, 0)"> 开启
                    </el-button>
                    <el-button
                        v-auth="{id: 10100040003}"
                        v-else
                        size="mini"
                        @click="changeUseContract(scope.row, 1)"> 关闭
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            class="page-component"
            :page-size="pageSize"
            :total="total"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="selectCurrent"
            @prev-click="selectCurrent"
            @next-click="selectCurrent">
        </el-pagination>

        <!-- Form -->
        <el-dialog
            :title="currencyConfigTitle"
            :close-on-click-modal="false"
            :visible.sync="currencyConfig">
            <el-form :inline="true" ref="form" :model="form" label-width="130px">
                <el-form-item label="币种" style="width: 40%">
                    <el-input v-model="form.currency"></el-input>
                </el-form-item>
                <el-form-item label="排序" style="width: 40%">
                    <el-input-number
                        @change="orderNumChange"
                        v-model="form.orderNum"
                        controls-position="right"
                        :max="1000">
                    </el-input-number>
                </el-form-item>
                <el-form-item label="提现手续费" style="width: 40%">
                    <div style="display: flex">
                        <el-input-number
                            @change="handleChangeWithdrawFe"
                            v-model="form.withdrawFee"
                            controls-position="right">
                        </el-input-number>
                    </div>
                </el-form-item>
                <el-form-item label="提现手续费币种" prop="type" style="width: 40%">
                    <el-select v-model="form.withdrawFeeCur" placeholder="选择币种" filterable>
                        <el-option
                            v-for="item in currentData"
                            :key="item.curId"
                            :label="item.curName"
                            :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="合约精度" style="width: 40%" prop="formDecimals">
                    <el-input-number
                        :disabled="currencyConfigTitle === '编辑币种'? true: false"
                        @change="accuracyChanges"
                        v-model="form.decimals"
                        controls-position="right"
                        :min="0"
                        :max="18">
                    </el-input-number>
                </el-form-item>
                <el-form-item label="合约地址" style="width: 50%" v-if="currencyConfigTitle === '编辑币种'">
                    <span>{{form.contractAddr}}</span>
                </el-form-item>
                <el-form-item label="发行总量" style="width: 40%" v-if="currencyConfigTitle === '编辑币种'">
                    <span>{{form.totalSupply}}</span>
                </el-form-item>
                <el-form-item label="链上快照" style="width: 50%" v-if="currencyConfigTitle === '编辑币种' && tokenEventShow">
                    <el-radio v-model="form.tokenEvent" :label="0">不需要</el-radio>
                    <el-radio v-model="form.tokenEvent" :label="1">需要（可用于PT分红等用途）</el-radio>
                </el-form-item>
                <el-form-item label="是否开启" style="width: 100%" v-if="currencyConfigTitle === '编辑币种'">
                    <el-checkbox name="type" :value="form.state === 1" @change="changeDisable">是</el-checkbox>
                    <el-checkbox name="type" :value="form.rechargeDisable === '1'" @change="changeRechargeDisable">
                        是否开启充值
                    </el-checkbox>
                    <el-checkbox name="type" :value="form.withdrawDisable === '1'" @change="changeWithdrawDisable">
                        是否开启提现
                    </el-checkbox>
                </el-form-item>
                <el-form-item label="显示精度" style="width: 40%">
                    <el-input-number
                        :defaultValue="8"
                        @change="handleChangeDisplayDecimals"
                        v-model="form.displayDecimals"
                        controls-position="right"
                        :min="0"
                        :max="18">
                    </el-input-number>
                </el-form-item>
                <el-form-item label="最低充值数量" style="width: 40%">
                    <div style="display: flex">
                        <el-input-number
                            @change="handleChangeRechargeLimitDown"
                            v-model="form.rechargeLimitDown"
                            controls-position="right">
                        </el-input-number>
                    </div>
                </el-form-item>
                <el-form-item label="提现最低数量" style="width: 40%">
                    <div style="display: flex">
                        <el-input-number
                            @change="handleChangeWithdrawLimitDown"
                            v-model="form.withdrawLimitDown"
                            controls-position="right">
                        </el-input-number>
                    </div>
                </el-form-item>
                <el-form-item label="提现最大数量" style="width: 40%">
                    <div style="display: flex">
                        <el-input-number v-model="form.withdrawLimitUp" controls-position="right"
                                         :min="0"></el-input-number>
                    </div>
                </el-form-item>
                <el-form-item label="提现钱包建议数量" style="width: 40%">
                    <el-input-number v-model="form.withdrawAdvice" controls-position="right" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="归集最低数量" style="width: 40%">
                    <el-input-number v-model="form.collectLimitDown" controls-position="right"
                                     :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="提现钱包最大数量" style="width: 40%">
                    <el-input-number v-model="form.withdrawHigh" controls-position="right" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="提现钱包最小数量" style="width: 40%">
                    <el-input-number v-model="form.withdrawLow" controls-position="right" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="矿工费最大限额" style="width: 40%">
                    <el-input type="number" v-model="form.minerFeeLimitUp" :min="0"></el-input>
                </el-form-item>
                <el-form-item label="详细描述" style="width: 100%">
                    <el-input
                        style="width: 565px"
                        type="textarea"
                        :rows="4"
                        placeholder="请输入内容"
                        v-model="form.desc">
                    </el-input>
                </el-form-item>
            </el-form>
            <div
                style="display: flex;justify-content: center"
                slot="footer"
                class="dialog-footer">
                <el-button size="small" @click="currencyConfig = false"> 取 消</el-button>
                <el-button type="primary" size="small" @click="addCurrent" v-if="currencyConfigTitle === '新增币种'"> 保 存
                </el-button>
                <el-button type="primary" size="small" @click="updateCurrent" v-else> 保 存</el-button>
            </div>
        </el-dialog>
        <!-- From2 -->
        <el-dialog title="绑定合约地址" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
            <div style="max-height: 60vh;overflow: auto;">
                <el-form ref="form" :model="contractInfo" label-width="120px"  >
                    <el-form-item label="合约地址">
                        <el-input
                            size="small"
                            style="width: 400px;margin-right: 20px"
                            v-model="contractInfo.contractAddr">
                        </el-input>
                        <el-button size="small" @click="selectContract"> 获取合约信息</el-button>
                    </el-form-item>
                    <el-form-item label="链上快照">
                        <el-radio v-model="contractInfo.tokenEvent" :label="0">不需要</el-radio>
                        <el-radio v-model="contractInfo.tokenEvent" :label="1">需要（可用于PT分红等用途）</el-radio>
                    </el-form-item>
                    <el-form-item label="Token Symbol">
                        <span> {{contractInfo.symbol}} </span>
                    </el-form-item>
                    <el-form-item label="精度">
                        <span> {{contractInfo.decimals}} </span>
                    </el-form-item>
                    <el-form-item label="发行总量">
                        <span> {{contractInfo.totalSupply}} </span>
                    </el-form-item>
                </el-form>
            </div>
            <div
                style="display: flex;justify-content: center"
                slot="footer"
                class="dialog-footer">
                <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="bindContract" :disabled="contractInfo.symbol === ''">绑
                    定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        selectCurrent,
        addCurrent,
        updateCurrent,
        selectContract,
        bindContract,
        changeUseContract,
        getWalletCurrency
    } from '@/api/operation/currency'
    import {judgingempty} from '@/utils/validate'
    import {nullToLine} from '@/utils/filters'

    export default {
        data () {
            return {
                // 列表数据
                tableData: [],
                // 所有币种
                currentData: [],
                // 币种配置信息
                form: {
                    id: '',
                    curId: '',
                    currency: '',
                    contractAddr: '',
                    rechargeLimitDown: '',
                    withdrawLimitUp: '',
                    withdrawLimitUp2: '',
                    withdrawLimitDown: '',
                    withdrawHigh: '',
                    withdrawAdvice: '',
                    collectLimitDown: '',
                    minerFeeLimitUp: 0.01,
                    withdrawFee: '',
                    displayDecimals: 8,
                    decimals: '',
                    totalSupply: '',
                    withdrawFeeCur: '',
                    rechargeDisable: '0',
                    withdrawDisable: '0',
                    state: 0,
                    orderNum: 20,
                    desc: '',
                    withdrawLow: '',
                    // 链上快照
                    tokenEvent: 1
                },
                // 合约信息
                contractInfo: {
                    totalSupply: '',
                    decimals: '',
                    symbol: '',
                    contractAddr: '',
                    id: '',
                    // 链上快照
                    tokenEvent: 1
                },
                // 窗口标题
                currencyConfigTitle: '',
                // 币种配置窗口
                currencyConfig: false,
                // 合约地址窗口
                dialogFormVisible: false,
                // 数据个数
                pageSize: 10,
                // 当前页
                currentPage: 1,
                // 数据总数
                total: 0,
                tokenEventShow: false
            }
        },
        created () {
            this.selectCurrent(this.currentPage)
            this.selectAllCurrent()
        },
        methods: {
            changeDisable (result) {
                result ? this.form.state = 1 : this.form.state = 0
            },
            changeRechargeDisable (result) {
                result ? this.form.rechargeDisable = '1' : this.form.rechargeDisable = '0'
            },
            changeWithdrawDisable (result) {
                result ? this.form.withdrawDisable = '1' : this.form.withdrawDisable = '0'
            },
            // 显示编辑窗口
            editCurrency (index, row) {
                this.form = {
                    id: parseInt(row.id),
                    curId: parseInt(row.curId),
                    currency: row.currency,
                    contractAddr: row.contractAddr,
                    rechargeLimitDown: row.rechargeLimitDown,
                    withdrawLimitUp: row.withdrawLimitUp,
                    withdrawLimitDown: row.withdrawLimitDown,
                    withdrawHigh: row.withdrawHigh,
                    withdrawAdvice: row.withdrawAdvice,
                    collectLimitDown: row.collectLimitDown,
                    minerFeeLimitUp: row.minerFeeLimitUp,
                    withdrawFee: row.withdrawFee,
                    displayDecimals: row.displayDecimals ? parseInt(row.displayDecimals) : row.displayDecimals,
                    decimals: parseInt(row.decimals),
                    totalSupply: row.totalSupply,
                    withdrawFeeCur: row.withdrawFeeCur !== '' ? row.withdrawFeeCur : row.currency,
                    rechargeDisable: row.rechargeDisable,
                    withdrawDisable: row.withdrawDisable,
                    state: row.state,
                    orderNum: parseInt(row.orderNum),
                    desc: row.desc,
                    withdrawLow: row.withdrawLow,
                    tokenEvent: row.tokenEvent === undefined ? 1 : row.tokenEvent
                }
                if (row.contractAddr === null || row.contractAddr === '') {
                    this.tokenEventShow = false
                } else {
                    this.tokenEventShow = true
                }
                this.currencyConfigTitle = '编辑币种'
                this.currencyConfig = true
            },
            // 显示新增窗口
            addCurrency () {
                // 币种配置信息
                this.form = {
                    id: '',
                    curId: '',
                    currency: '',
                    contractAddr: '',
                    rechargeLimitDown: '',
                    withdrawLimitUp: '',
                    withdrawLimitDown: '',
                    withdrawHigh: '',
                    withdrawAdvice: '',
                    collectLimitDown: '',
                    minerFeeLimitUp: 0.01,
                    withdrawFee: '',
                    displayDecimals: 8,
                    decimals: '',
                    totalSupply: '',
                    withdrawFeeCur: '',
                    rechargeDisable: '0',
                    withdrawDisable: '0',
                    state: 0,
                    orderNum: 20,
                    desc: '',
                    withdrawLow: ''
                }
                this.currencyConfigTitle = '新增币种'
                this.currencyConfig = true
            },
            // 合约地址
            showDialogForm (index, row) {
                this.contractInfo = {
                    totalSupply: '',
                    decimals: '',
                    symbol: '',
                    contractAddr: '',
                    id: row.id,
                    tokenEvent: 1
                }
                this.dialogFormVisible = true
            },
            /**
             *  显示每页条数
             *  @param val 改变后的条数
             * */
            handleSizeChange (val) {
                this.pageSize = val
                this.selectCurrent(1)
            },
            /**
             * 查询币种列表
             * @param currentPage 查询的页码
             */
            selectCurrent (currentPage) {
                this.currentPage = currentPage
                let data = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        pageSize: this.pageSize,
                        pageNum: currentPage
                    }
                }
                selectCurrent(data).then(res => {
                    this.tableData = res.data.list
                    this.total = parseInt(res.data.total)
                })
            },
            /**
             * 查询所有币种
             */
            selectAllCurrent () {
                let data = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        pageNum: 1,
                        pageSize: 0
                    }
                }
                getWalletCurrency(data).then(res => {
                    this.currentData = res.data.list
                })
            },
            /**
             * 新增币种
             */
            addCurrent () {
                if (!judgingempty(this.form.currency)) {
                    this.$message.error('请输入币种')
                } else if (!judgingempty(this.form.orderNum)) {
                    this.$message.error('请输入排序')
                } else if (!judgingempty(this.form.withdrawFee)) {
                    this.$message.error('请输入提现手续费')
                } else if (!judgingempty(this.form.decimals)) {
                    this.$message.error('请输入精度')
                } else if (!judgingempty(this.form.withdrawLow)) {
                    this.$message.error('请输入提现钱包最小金额')
                } else {
                    let data = {
                        traceId: Math.random().toString(36).substr(2),
                        data: {
                            currency: this.form.currency,
                            rechargeLimitDown: this.form.rechargeLimitDown,
                            withdrawLimitUp: this.form.withdrawLimitUp,
                            withdrawLimitDown: this.form.withdrawLimitDown,
                            withdrawHigh: this.form.withdrawHigh,
                            withdrawAdvice: this.form.withdrawAdvice,
                            collectLimitDown: this.form.collectLimitDown,
                            minerFeeLimitUp: this.form.minerFeeLimitUp,
                            withdrawFee: this.form.withdrawFee,
                            decimals: parseInt(this.form.decimals),
                            displayDecimals: parseInt(this.form.displayDecimals),
                            withdrawFeeCur: this.form.withdrawFeeCur !== '' ? this.form.withdrawFeeCur : this.form.currency,
                            rechargeDisable: 0,
                            withdrawDisable: 0,
                            state: 0,
                            orderNum: parseInt(this.form.orderNum),
                            desc: this.form.desc,
                            withdrawLow: this.form.withdrawLow
                        }
                    }
                    addCurrent(data).then(res => {
                        if (res.code.toString() === '0') {
                            this.currencyConfig = false
                            this.selectCurrent(this.currentPage)
                        } else {
                            this.$message.error('新增币种失败')
                        }
                    })
                }
            },
            /**
             * 编辑币种
             */
            updateCurrent () {
                if (!judgingempty(this.form.currency)) {
                    this.$message.error('请输入币种')
                } else if (!judgingempty(this.form.orderNum)) {
                    this.$message.error('请输入排序')
                } else if (!judgingempty(this.form.withdrawFee)) {
                    this.$message.error('请输入提现手续费')
                } else if (!judgingempty(this.form.decimals)) {
                    this.$message.error('请输入精度')
                } else if (!judgingempty(this.form.withdrawLow)) {
                    this.$message.error('请输入提现钱包最小金额')
                } else {
                    let data = {
                        traceId: Math.random().toString(36).substr(2),
                        data: JSON.parse(JSON.stringify(this.form))
                    }
                    if (!this.tokenEventShow) {
                        delete data.data['tokenEvent']
                    }
                    updateCurrent(data).then(res => {
                        if (res.code.toString() === '0') {
                            this.currencyConfig = false
                            this.selectCurrent(this.currentPage)
                        } else {
                            if (res.code.toString() === '2351') {
                                this.$message.error('该币种已开启，不能修改币种符号')
                            } else {
                                this.$message.error('编辑币种失败')
                            }
                        }
                    })
                }
            },
            /**
             * 获取合约信息
             */
            selectContract () {
                let data = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        id: this.contractInfo.id,
                        contractAddr: this.contractInfo.contractAddr
                    }
                }
                selectContract(data).then(res => {
                    if (res.code.toString() === '0') {
                        this.contractInfo = res.data
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            },
            /**
             * 绑定合约信息
             */
            bindContract () {
                let data = {
                    traceId: Math.random().toString(36).substr(2),
                    data: this.contractInfo
                }
                bindContract(data).then(res => {
                    if (res.code.toString() === '0') {
                        this.dialogFormVisible = false
                        this.selectCurrent(this.currentPage)
                        this.$message.success('绑定合约地址成功')
                    } else {
                        this.$message.error('绑定合约地址失败')
                    }
                })
            },
            /**
             * 开启或关闭
             * @param row 币种信息
             * @param state 0开启1关闭
             */
            changeUseContract (row, state) {
                let data = {
                    traceId: Math.random().toString(36).substr(2),
                    data: row.currency
                }
                changeUseContract(data).then(res => {
                    if (res.code.toString() === '0') {
                        this.selectCurrent(this.currentPage)
                        state === 1 ? this.$message.success('关闭币种成功') : this.$message.success('开启币种成功')
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            },
            /**
             * 精度切换
             */
            handleChangeDisplayDecimals (value) {
                let reg = /^[0-9a-zA-Z]+$/
                if (!reg.test(value)) {
                    this.$message.error('请输入 0-18 之间的整数')
                    let math = Math.round(value)
                    // 初始化数值避免出现小数
                    this.form.displayDecimals = math
                }
            },
            /**
             * 新增币种时币种值得检测
             */
            accuracyChanges (value) {
            },
            /**
             *  到账最小金额为负数的时候提示
             */
            handleChangeWithdrawLimitDown (value) {
                if (value < 0) {
                    this.$message.error('到账最小金额不能小于 0 ')
                    this.form.withdrawLimitDown = 0
                }
            },
            /**
             *  最小充值金额
             */
            handleChangeRechargeLimitDown (value) {
                if (value < 0) {
                    this.$message.error('最小充值金额不能小于 0 ')
                    this.form.rechargeLimitDown = 0
                }
            },
            /**
             * 提现手续费为负数的时候提示
             */
            handleChangeWithdrawFe (value) {
                if (value < 0) {
                    this.$message.error('提现手续不能小于 0 ')
                    this.form.withdrawFee = 0
                }
            },
            /**
             * 排序为负数的时候的时候提示
             */
            orderNumChange (value) {
                if (value < 0) {
                    this.$message.error('排序数值不能小于 0 ')
                    // 设为默认值
                    this.form.orderNum = 20
                }
            }
        },
        filters: {
            state (val) {
                return val === 0 ? '否' : '是'
            },
            rechargeDisable (val) {
                return val === '0' ? '否' : '是'
            },
            withdrawDisable (val) {
                return val === '0' ? '否' : '是'
            },
            nullToLine
        }
    }
</script>
