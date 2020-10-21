<template>
    <div class="app-container">
        <p class="content-title">转账工具</p>
        <el-form :model="TransferTool" class="demo-form-inline" ref="releaseSearch" :inline="true">
            <el-form-item label="转出" prop="type" class="form-item">
                <el-select placeholder="账户类型" @change="selectFromCurrent" v-model="TransferTool.fromType">
                    <el-option
                        v-for="acountType in acountTypes"
                        :key="acountType.bizAccountId"
                        :label="acountType.name"
                        :value="acountType.bizAccountId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="项目账户" prop="type" class="form-item" v-if="fromHasProjectType">
                <el-select placeholder="项目账户" @change="selectFromCurrent" v-model="TransferTool.fromProjectType">
                    <el-option
                        v-for="project in projectData"
                        :key="project.projectAccountId"
                        :label="project.name"
                        :value="project.projectAccountId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="币种" prop="currency" class="form-item">
                <el-select v-model="TransferTool.currency" placeholder="币种" @change="selectBalance(0)">
                    <el-option
                        v-for="item in tableData"
                        :key="item.curId"
                        :label="item.code"
                        :value="item.code">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="账户余额" class="form-item">
                <span>{{outBlance}} {{TransferTool.currency}}</span>
            </el-form-item>
            <br>
            <el-form-item label="转入" prop="type" class="form-item">
                <el-select placeholder="账户类型" v-model="TransferTool.toType" @change="selectToCurrent">
                    <el-option
                        v-for="acountType in acountTypes"
                        :key="acountType.bizAccountId"
                        :label="acountType.name"
                        :value="acountType.bizAccountId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="项目账户" prop="type" class="form-item" v-if="toHasProjectType">
                <el-select placeholder="项目账户" @change="selectBalance(1)" v-model="TransferTool.toProjectType">
                    <el-option
                        v-for="project in projectData"
                        :key="project.projectAccountId"
                        :label="project.name"
                        :value="project.projectAccountId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="币种" prop="currency" class="form-item">
                <span>{{TransferTool.currency}}</span>
            </el-form-item>
            <el-form-item label="账户余额" class="form-item">
                <span>{{inBlance}} {{TransferTool.currency}}</span>
            </el-form-item>
            <br>

            <el-form-item label="转账数量" class="form-item">
                <el-input-number :precision="decimals" v-model="TransferTool.amount" controls-position="right" :min="1"
                                 :max="parseInt(outBlance)"></el-input-number>
            </el-form-item>
            <el-form-item label="币种" prop="currency" class="form-item">
                <span>{{TransferTool.currency}}</span>
            </el-form-item>

            <el-form-item label="备注" prop="association">
                <el-input
                    style="width: 1100px"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入内容"
                    v-model="TransferTool.comments">
                </el-input>
            </el-form-item>
            <el-form-item style="width: 100%;text-align: center">
                <el-button type="primary" size="small" @click="commitTransfer">提 交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {
        selectAcountType,
        selectCurrent,
        selectBalance,
        commitTransfer,
        getProjectTypes
    } from '@/api/finance/transfer-tool'

    export default {
        data () {
            return {
                TransferTool: {
                    amount: '',
                    comments: '',
                    toType: '',
                    toProjectType: '',
                    fromType: '',
                    fromProjectType: '',
                    currency: ''
                },
                // 转账数量
                number: 0,
                // 描述
                desc: '',
                // 账户类型
                acountTypes: [],
                // 币种类型
                currents: [],
                // 转出余额
                outBlance: '',
                // 转入余额
                inBlance: '',
                // 当前币种
                currency: '',
                // 币种列表
                tableData: [],
                // 项目列表
                projectData: [],
                // 当前币种的精度
                decimals: 0,
                // 转出项目账户类型
                fromHasProjectType: false,
                // 转入项目账户类型
                toHasProjectType: false
            }
        },
        created () {
            // 初始化数据
            this.selectAcountType()
        },
        methods: {
            // 获取账户类型
            selectAcountType () {
                let data = {
                    traceId: Math.random().toString(36).substr(2)
                }
                selectAcountType(data).then(res => {
                    if (res.code.toString() === '0') {
                        this.acountTypes = res.data
                    } else {
                        this.$message.error('获取账户类型失败')
                    }
                }).catch(err => {
                    this.$message.error(err)
                })
            },
            /**
             * 转出查询，项目类型或余额
             */
            selectFromCurrent () {
                let bool = false
                this.acountTypes.forEach((item, index) => {
                    this.fromHasProjectType = false
                    if (item.typee === 8 && item.bizAccountId === this.TransferTool.fromType) {
                        bool = true
                        this.fromHasProjectType = true
                    }
                })
                if (bool && this.TransferTool.fromProjectType === '') {
                    this.outBlance = ''
                    // 查询项目类型列表
                    let data = {
                        traceId: Math.random().toString(36).substr(2)
                    }
                    getProjectTypes(data).then(res => {
                        this.projectData = res.data
                    }).catch(err => {
                        this.$message.error(err)
                    })
                } else {
                    // 查询币种列表
                    if (this.TransferTool.currency === '') {
                        let data = {
                            traceId: Math.random().toString(36).substr(2),
                            data: {
                                pageSize: 0,
                                pageNum: 1,
                                filter: {
                                    state: '1'
                                }
                            }
                        }
                        selectCurrent(data).then(res => {
                            this.tableData = res.data.list
                        }).catch(err => {
                            this.$message.error(err)
                        })
                    } else {
                        this.selectBalance(0)
                    }
                }
            },
            /**
             * 转入查询，项目类型或余额
             */
            selectToCurrent () {
                let bool = false
                this.acountTypes.forEach((item, index) => {
                    this.toHasProjectType = false
                    if (item.typee === 8 && item.bizAccountId === this.TransferTool.toType) {
                        bool = true
                        this.toHasProjectType = true
                    }
                })
                if (bool && this.TransferTool.toProjectType === '') {
                    this.inBlance = ''
                    // 查询项目类型列表
                    let data = {
                        traceId: Math.random().toString(36).substr(2)
                    }
                    getProjectTypes(data).then(res => {
                        this.projectData = res.data
                    }).catch(err => {
                        this.$message.error(err)
                    })
                } else {
                    this.selectBalance(1)
                }
            },
            /**
             * 获取账户余额
             * @param type 查询的账户类型
             */
            selectBalance (type) {
                if (type === 0) {
                    this.tableData.filter((item) => {
                        if (item.code === this.TransferTool.currency) {
                            this.decimals = item.decimals
                        }
                    })
                }
                let bizAccountId = ''
                if (type === 0) {
                    if (this.fromHasProjectType) {
                        bizAccountId = this.TransferTool.fromProjectType
                    } else {
                        bizAccountId = this.TransferTool.fromType
                    }
                } else {
                    if (this.toHasProjectType) {
                        bizAccountId = this.TransferTool.toProjectType
                    } else {
                        bizAccountId = this.TransferTool.toType
                    }
                }
                if (bizAccountId !== '') {
                    let data = {
                        traceId: Math.random().toString(36).substr(2),
                        data: {
                            currency: this.TransferTool.currency,
                            bizAccountId: bizAccountId
                        }
                    }
                    selectBalance(data).then(res => {
                        if (res.code.toString() === '0') {
                            type === 0 ? this.outBlance = res.data.balance : this.inBlance = res.data.balance
                        } else {
                            this.$message.error('获取账户余额失败')
                        }
                    }).catch(err => {
                        this.$message.error(err)
                    })
                }
            },
            /**
             * 提交转账
             * @param currentPage 查询的页码
             */
            commitTransfer () {
                let fromBizAccountId = this.fromHasProjectType ? this.TransferTool.fromProjectType : this.TransferTool.fromType
                let toBizAccountId = this.toHasProjectType ? this.TransferTool.toProjectType : this.TransferTool.toType
                let data = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        amount: parseInt(this.TransferTool.amount),
                        comments: this.TransferTool.comments,
                        currency: this.TransferTool.currency,
                        fromBizAccountId: parseInt(fromBizAccountId),
                        toBizAccountId: parseInt(toBizAccountId)
                    }
                }
                commitTransfer(data).then(res => {
                    if (res.code.toString() === '0') {
                        this.inBlance = ''
                        this.outBlance = ''
                        this.TransferTool = {
                            amount: '',
                            comments: '',
                            currency: '',
                            fromProjectType: '',
                            toProjectType: ''
                        }
                        this.$message.success('转账成功')
                    } else {
                        this.$message.error('转账失败')
                    }
                }).catch(err => {
                    this.$message.error(err)
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .associationTip {
        margin: 0;
        line-height: 30px;
        display: inline-block;
    }

    .form-item {
        width: 20%;
    }
</style>
