<template>
    <el-form class="demo-form-inline" :rules="itemFormRules"
             label-width="200px"
             label-position="right" :inline="true"
             ref="itemForm"
             :model="formData">
        <el-divider content-position="left">{{formData.ptCurCode+'--'+formData.name}}</el-divider>
        <p class="itemIncome">年租金收益：{{formData.prospectiveYield}}</p>
        <el-form-item label="租金年化收益：" prop="IncomeCheckType">
            <el-select v-model="formData.IncomeCheckType" :disabled="isDetail"
                       filterable size="small" @change="changeProfit"
                       placeholder="请选择类型">
                <el-option title="固定百分比" label="固定百分比" value="0"></el-option>
                <el-option title="固定金额" label="固定金额" value="1"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item v-if="formData.IncomeCheckType === '0'" prop="responseRate" class="mt0">
            <el-input v-model="formData.responseRate" size="small" style="margin-left: 0;"
                      oninput="value=value.replace(/[^\d.]/g,'')"
                      placeholder="请输入合约回报率" :disabled="isDetail"
                      class="input-with-slot">
                <div slot="append">%</div>
            </el-input>
        </el-form-item>
        <el-form-item v-if="formData.IncomeCheckType === '1'" prop="annualReturn" class="mt0">
            <el-input placeholder="请输入固定合约年回报" style="margin-left: 0;"
                      oninput="value=value.replace(/[^\d.]/g,'')"
                      v-model="formData.annualReturn" size="small" :disabled="isDetail"
                      class="input-with-select">
                <el-select v-model="formData.annualReturnCur" slot="append" :disabled="isDetail" placeholder="请选择">
                    <el-option label="THB" value="THB"></el-option>
                </el-select>
            </el-input>
        </el-form-item>
        <p class="itemIncome">项目总价：{{formData.totalPrice + ' ' + formData.priceCurCode}}</p>
        <el-form-item label="项目总价修正：" prop="totalPriceCorrection">
            <el-input placeholder="请输入项目总价" :disabled="isDetail"
                      v-model="formData.totalPriceCorrection" size="small" oninput="value=value.replace(/[^\d.]/g,'')"
                      class="input-with-select totalPrice">
                <el-select v-model="formData.priceCurCodeCorrection" :disabled="isDetail" slot="append"
                           placeholder="请选择">
                    <el-option label="THB" value="THB"></el-option>
                </el-select>
            </el-input>
            <el-button size="small" v-if="!isDetail" @click="resettotalPrice">重置</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import {judgingempty, fractionalformat} from '@/utils/validate'
    import {getCurLeng} from '@/utils/filters'

    export default {
        name: 'itemForm',
        props: ['formData'],
        data () {
            // 合约回报率校验
            const checkRate = (rule, value, callback) => {
                if (!judgingempty(this.formData.responseRate)) {
                    return callback(new Error('请输入合约回报率'))
                } else if (!fractionalformat(this.formData.responseRate)) {
                    return callback(new Error('请输入正确的合约回报率'))
                } else {
                    this.formData.responseRate = parseFloat(getCurLeng(this.formData.responseRate, 4))
                    return callback()
                }
            }
            // 固定合约年回报校验
            const checkAnnualReturn = (rule, value, callback) => {
                if (!judgingempty(this.formData.annualReturn)) {
                    return callback(new Error('请输入固定合约年回报'))
                } else if (!fractionalformat(this.formData.annualReturn)) {
                    return callback(new Error('请输入正确的固定合约年回报'))
                } else {
                    this.formData.annualReturn = parseFloat(getCurLeng(this.formData.annualReturn, 2))
                    return callback()
                }
            }
            return {
                itemFormRules: {
                    IncomeCheckType: [
                        {required: true, message: '请选择收益类型', trigger: 'change'}
                    ],
                    responseRate: [
                        {required: true, validator: checkRate, trigger: 'blur'}
                    ],
                    annualReturn: [
                        {required: true, validator: checkAnnualReturn, trigger: 'blur'}
                    ],
                    totalPriceCorrection: [
                        {required: true, message: '请输入项目总价', trigger: 'blur'}
                    ]
                },
                // 是否为查看详情
                isDetail: false,
                // form原始数据
                oldFormData: {}
            }
        },
        created () {
            if (this.$route.query) {
                if (this.$route.query.details) {
                    this.isDetail = true
                }
            }
            this.oldFormData = Object.assign({}, this.formData)
        },
        methods: {
            // 重置总价
            resettotalPrice () {
                this.formData.totalPriceCorrection = ''
            },
            changeProfit () {
                if (this.formData.IncomeCheckType === '0') {
                    this.$refs.itemForm.validateField('responseRate')
                } else {
                    this.$refs.itemForm.validateField('annualReturn')
                }
            }
        }
    }
</script>

<style lang="scss" scoped>

    .itemIncome {
        padding-left: 200px;
        font-size: 14px;
        color: #666666;
    }

    /deep/ .el-divider__text {
        color: #333333;
    }

    .input-with-select {
        width: 300px;
        margin: -4px 0 0 15px;
        /deep/ .el-input-group__append {
            background-color: #fff;
            width: 80px;
            overflow: hidden;
        }
        &.totalPrice {
            width: 300px;
            margin-left: 0;
        }
    }

    .mt0 {
        margin-top: 0;
    }

    .input-with-slot {
        width: 300px;
        margin: -4px 0 0 15px;
        /deep/ .el-input-group__append {
            background-color: #fff;
            width: 50px;
        }
    }
</style>
