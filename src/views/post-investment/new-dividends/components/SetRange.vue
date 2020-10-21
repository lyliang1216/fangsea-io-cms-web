<template>
    <div>
        <el-form :model="setRangeForm" :rules="setRangeFormRules"
                 class="demo-form-inline setRangeForm"
                 ref="setRangeForm"
                 label-width="200px"
                 label-position="right">
            <el-form-item label="损益类别：" prop="profitLossType">
                <el-select v-model="setRangeForm.profitLossType" :disabled="isDetail"
                           filterable size="small" placeholder="损益类别" @change="getBonusType">
                    <el-option
                        v-for="item in profitLossTypeList"
                        :key="item.id"
                        :label="item.categoryName"
                        :value="item.id"/>
                </el-select>
            </el-form-item>
            <el-form-item label="分红类型：" prop="bonusType" v-if="setRangeForm.profitLossType !== ''">
                <el-select v-model="setRangeForm.bonusType" filterable size="small" placeholder="分红类型"
                           :disabled="isDetail">
                    <el-option
                        v-for="item in bonusTypeList"
                        :key="item.id"
                        :label="item.categoryName"
                        :value="item.id"/>
                </el-select>
            </el-form-item>
            <el-form-item label="时间范围：" prop="timeFrame">
                <el-date-picker clearable style="width: 400px;"
                                v-model="setRangeForm.timeFrame"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                format="yyyy-MM-dd HH:mm:ss"
                                :disabled="isDetail"
                                :default-value="setRangeForm.timeFrame"
                                :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="范围（项目/Ticker）：" prop="projectRange">
                <el-select v-model="setRangeForm.projectRange" class="w400" :disabled="isDetail"
                           multiple filterable clearable size="small"
                           @change="projectRangeChange"
                           @clear="projectRangeClear"
                           value-key="projectId"
                           placeholder="范围（项目/Ticker）">
                    <el-option
                        v-for="item in setRangeForm.projectData"
                        :key="item.projectId"
                        :label="item.ptCurCode"
                        :value="item.projectId"/>
                </el-select>
            </el-form-item>
            <div class="projectSetting">
                <div class="settingItem" v-for="(item, index) in setRangeForm.projectsIncome" :key="index">
                    <item-form :formData="item" :ref="`itemForm${index}`"/>
                </div>
                <el-divider content-position="left"></el-divider>
            </div>
            <el-form-item label="兑付币种：" prop="CashPayment">
                <el-select v-model="setRangeForm.CashPayment" :disabled="isDetail" filterable size="small"
                           placeholder="兑付币种">
                    <el-option title="USDT" label="USDT" value="USDT"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="描述：" prop="description">
                <el-input class="description" :disabled="isDetail"
                          type="textarea"
                          placeholder="请输入描述"
                          v-model="setRangeForm.description">
                </el-input>
            </el-form-item>
            <el-form-item size="small" class="btns">
                <el-button type="primary" @click="onNext" v-if="!isDetail">保存并下一步</el-button>
                <el-button type="primary" @click="onNextOnly" v-else>下一步</el-button>
                <el-button size="small" @click="returnList" v-if="!isDetail">取消新增（返回列表）</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import itemForm from '@/views/post-investment/new-dividends/components/setRangeComponents/itemForm'
    import {
        getComplateList,
        getProfitLossType,
        saveRangeData,
        updateRangeData,
        getRangeData
    } from '@/api/post-investment/new-dividends'

    export default {
        name: 'SetRange',
        data () {
            // 时间范围校验
            const checkTime = (rule, value, callback) => {
                let nowDate = Date.parse(new Date())
                if (!value || value.length === 0) {
                    return callback(new Error('请选择时间范围'))
                } else {
                    if (value[0] - nowDate > 90 * 24 * 60 * 60 * 1000) {
                        return callback(new Error('起始时间不得大于未来90天'))
                    }
                    if (value[1] < value[0] || value[1] - value[0] > 730 * 24 * 60 * 60 * 1000) {
                        return callback(new Error('结束时间不得小于起始时间且不得大于起始时间后730天'))
                    }
                    return callback()
                }
            }
            // 范围校验
            const checkProjectRange = (rule, value, callback) => {
                if (!value || value.length === 0) {
                    return callback(new Error('请选择范围（项目/Ticker）'))
                } else {
                    return callback()
                }
            }
            // 描述校验
            const checkDescription = (rule, value, callback) => {
                if (value === '') {
                    return callback(new Error('请填写描述'))
                } else if (value.length < 4 || value.length > 140) {
                    return callback(new Error('长度限制为4-140字符'))
                } else {
                    return callback()
                }
            }
            return {
                setRangeForm: {
                    // 损益类别
                    profitLossType: '',
                    // 分红类型
                    bonusType: '',
                    // 时间范围
                    timeFrame: null,
                    // 已完成项目数据
                    projectData: [],
                    // 范围（项目/Ticker）
                    projectRange: [],
                    // 项目修正数据
                    projectsIncome: [],
                    // 兑付币种
                    CashPayment: 'USDT',
                    // 描述
                    description: ''
                },
                setRangeFormRules: {
                    profitLossType: [
                        {required: true, message: '请选择损益类别', trigger: 'change'}
                    ],
                    bonusType: [
                        {required: true, message: '请选择分红类型', trigger: 'change'}
                    ],
                    timeFrame: [
                        {required: true, validator: checkTime, trigger: 'blur'}
                    ],
                    projectRange: [
                        {required: true, validator: checkProjectRange, trigger: ['blur', 'change']}
                    ],
                    CashPayment: [
                        {required: true, message: '请选择兑付币种', trigger: 'change'}
                    ],
                    description: [
                        {required: true, validator: checkDescription, trigger: 'blur'}
                    ]
                },
                // 损益类别列表
                profitLossTypeList: [],
                // 分红类型列表
                bonusTypeList: [],
                // 损益信息id
                profitId: '',
                // 是否为查看详情
                isDetail: false,
                // 原始表单数据
                oldRangeForm: []
            }
        },
        created () {
            // 初始化数据
            this.getComplateList()
            this.getProfitLossType(0)
            if (this.$route.query) {
                if (this.$route.query.details) {
                    this.isDetail = true
                }
            }
        },
        methods: {
            // 获取已完成项目数据
            getComplateList () {
                let params = {
                    traceId: Math.random().toString(36).substr(2)
                }
                getComplateList(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.setRangeForm.projectData = res.data
                        if (this.$route.query) {
                            if (this.$route.query.profitId) {
                                this.profitId = this.$route.query.profitId
                                this.getRangeData()
                            }
                        }
                    } else {
                        this.$message.error(res.msg)
                    }
                }).catch(err => {
                    this.$message.error(err.msg)
                })
            },
            // 获取损益列表数据
            getProfitLossType (id) {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        id: id
                    }
                }
                getProfitLossType(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.profitLossTypeList = res.data
                        for (let i = 0; i < res.data.length; i++) {
                            if (res.data[i].categoryName === '租金分红') {
                                this.setRangeForm.profitLossType = res.data[i].id
                                this.getBonusType(res.data[i].id)
                            }
                        }
                    } else {
                        this.$message.error(res.msg)
                    }
                }).catch(err => {
                    this.$message.error(err.msg)
                })
            },
            // 获取分红数据
            getBonusType (id) {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        id: id
                    }
                }
                getProfitLossType(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.bonusTypeList = res.data
                        for (let i = 0; i < res.data.length; i++) {
                            if (res.data[i].categoryName === '合约固定分红') {
                                this.setRangeForm.bonusType = res.data[i].id
                            }
                        }
                    } else {
                        this.$message.error(res.msg)
                    }
                }).catch(err => {
                    this.$message.error(err.msg)
                })
            },
            // 获取损益范围表单数据
            getRangeData () {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        profitId: this.profitId
                    }
                }
                getRangeData(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.getBonusType(res.data.profitType)
                        this.profitId = res.data.profitId
                        this.setRangeForm.profitLossType = res.data.profitType
                        this.setRangeForm.bonusType = res.data.bonusType
                        this.setRangeForm.timeFrame = [this.getZoneTime(res.data.startTime), this.getZoneTime(res.data.endTime)]
                        this.setRangeForm.CashPayment = res.data.profitCurCode
                        this.setRangeForm.description = res.data.proDescribe
                        for (let i = 0; i < res.data.projectList.length; i++) {
                            this.setRangeForm.projectRange.push(res.data.projectList[i].projectId)
                            let json_ = {}
                            json_.itemId = res.data.projectList[i].itemId
                            json_.projectId = res.data.projectList[i].projectId
                            json_.projectNumber = res.data.projectList[i].projectNumber
                            json_.ptBizAccountId = res.data.projectList[i].ptBizAccountId
                            json_.ptCurCode = res.data.projectList[i].ptCurCode
                            if (res.data.projectList[i].isPercent) {
                                json_.IncomeCheckType = '0'
                                json_.responseRate = res.data.projectList[i].profitPercent
                                json_.annualReturnCur = res.data.projectList[i].paymentCurCode ? res.data.projectList[i].paymentCurCode : 'THB'
                            } else {
                                json_.IncomeCheckType = '1'
                                json_.annualReturn = res.data.projectList[i].profitPrice
                                json_.annualReturnCur = res.data.projectList[i].paymentCurCode
                            }
                            json_.totalPriceCorrection = res.data.projectList[i].projectTotalPrice
                            json_.priceCurCodeCorrection = res.data.projectList[i].projectTotalCurCode
                            for (let j = 0; j < this.setRangeForm.projectData.length; j++) {
                                if (res.data.projectList[i].projectId === this.setRangeForm.projectData[j].projectId) {
                                    json_.name = this.setRangeForm.projectData[j].name
                                    json_.prospectiveYield = this.setRangeForm.projectData[j].prospectiveYield
                                    json_.totalPrice = this.setRangeForm.projectData[j].totalPrice
                                    json_.priceCurCode = this.setRangeForm.projectData[j].priceCurCode
                                }
                            }
                            this.setRangeForm.projectsIncome.push(json_)
                        }
                        this.oldRangeForm = JSON.parse(JSON.stringify(this.setRangeForm))
                    }
                })
            },

            // 范围下拉框选择改变触发
            projectRangeChange (options) {
                for (let i = 0; i < this.setRangeForm.projectData.length; i++) {
                    for (let j = 0; j < options.length; j++) {
                        if (this.setRangeForm.projectData[i].projectId === options[j]) {
                            let result = this.setRangeForm.projectsIncome.some(item => {
                                if (item.projectId === options[j]) {
                                    return true
                                } else {
                                    return false
                                }
                            })
                            if (!result) {
                                let assembleData = Object.assign({}, this.setRangeForm.projectData[i])
                                assembleData.IncomeCheckType = ''
                                assembleData.responseRate = ''
                                assembleData.annualReturn = ''
                                assembleData.annualReturnCur = 'THB'
                                assembleData.totalPriceCorrection = ''
                                assembleData.priceCurCodeCorrection = 'THB'
                                this.setRangeForm.projectsIncome.push(assembleData)
                            }
                        }
                    }
                }
                if (this.setRangeForm.projectsIncome.length > options.length) {
                    for (let k = 0; k < this.setRangeForm.projectsIncome.length; k++) {
                        let hasItem = options.some(item => {
                            if (item === this.setRangeForm.projectsIncome[k].projectId) {
                                return true
                            } else {
                                return false
                            }
                        })
                        if (!hasItem) {
                            this.setRangeForm.projectsIncome.splice(k, 1)
                        }
                    }
                }
            },
            // 清空范围选择
            projectRangeClear () {
                this.setRangeForm.projectsIncome = []
            },
            // 保存并下一步
            onNext () {
                let validArr = [this.$refs.setRangeForm.validate()]
                for (let i = 0; i < this.setRangeForm.projectsIncome.length; i++) {
                    validArr.push(this.$refs['itemForm' + i][0].$refs.itemForm.validate())
                }
                Promise.all(validArr)
                    .then(res => {
                        let params = {
                            traceId: Math.random().toString(36).substr(2),
                            data: {
                                profitId: this.profitId,
                                profitType: this.setRangeForm.profitLossType,
                                bonusType: this.setRangeForm.bonusType,
                                startTime: this.parseTime(this.setRangeForm.timeFrame[0]),
                                endTime: this.parseTime(this.setRangeForm.timeFrame[1]),
                                profitCurCode: this.setRangeForm.CashPayment,
                                proDescribe: this.setRangeForm.description,
                                projectList: []
                            }
                        }
                        for (let i = 0; i < this.setRangeForm.projectsIncome.length; i++) {
                            params.data.projectList[i] = {}
                            if (this.profitId !== '') {
                                params.data.projectList[i]['itemId'] = this.setRangeForm.projectsIncome[i].itemId
                            }
                            params.data.projectList[i]['projectId'] = this.setRangeForm.projectsIncome[i].projectId
                            params.data.projectList[i]['projectNumber'] = this.setRangeForm.projectsIncome[i].projectNumber
                            params.data.projectList[i]['ptBizAccountId'] = this.setRangeForm.projectsIncome[i].ptBizAccountId
                            params.data.projectList[i]['ptCurCode'] = this.setRangeForm.projectsIncome[i].ptCurCode
                            if (this.setRangeForm.projectsIncome[i].IncomeCheckType === '0') {
                                params.data.projectList[i]['isPercent'] = true
                                params.data.projectList[i]['profitPercent'] = this.setRangeForm.projectsIncome[i].responseRate
                            } else {
                                params.data.projectList[i]['isPercent'] = false
                                params.data.projectList[i]['profitPrice'] = this.setRangeForm.projectsIncome[i].annualReturn
                                params.data.projectList[i]['paymentCurCode'] = this.setRangeForm.projectsIncome[i].annualReturnCur
                            }
                            params.data.projectList[i]['projectTotalPrice'] = this.setRangeForm.projectsIncome[i].totalPriceCorrection
                            params.data.projectList[i]['projectTotalCurCode'] = this.setRangeForm.projectsIncome[i].priceCurCodeCorrection
                        }
                        if (this.profitId === '') {
                            saveRangeData(params).then(res => {
                                if (res.code.toString() === '0') {
                                    this.$route.query.profitId = res.data.profitId
                                    this.$emit('nextStep')
                                } else {
                                    this.$message.error(res.msg)
                                }
                            })
                        } else {
                            updateRangeData(params).then(res => {
                                if (res.code.toString() === '0') {
                                    this.$route.query.profitId = res.data.profitId
                                    this.$emit('nextStep')
                                } else {
                                    this.$message.error(res.msg)
                                }
                            })
                        }
                    })
            },
            onNextOnly () {
                this.$emit('nextStep')
            },
            /**
             * 返回列表
             */
            returnList () {
                if (JSON.stringify(this.oldRangeForm) !== JSON.stringify(this.setRangeForm)) {
                    this.$confirm('当前输入内容还未保存，如果取消，输入内容将会丢失。', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$router.push({path: '/postinvestment/profitloss'})
                    }).catch(() => {
                    })
                } else {
                    this.$router.push({path: '/postinvestment/profitloss'})
                }
            }
        },
        components: {
            itemForm
        }
    }
</script>

<style lang="scss" scoped>

    .setRangeForm {
        width: 80%;
        margin: 0 auto;
        padding-top: 50px;
        .w400 {
            width: 400px;
        }
        .w200 {
            width: 200px;
        }
        .projectSetting {
            padding-left: 100px;
        }
        .description {
            width: 400px;
        }
        .btns {
            padding-left: 150px;
        }
        /deep/ .is-disabled {
            background-color: #fff;
            input {
                background-color: #fff;
                color: #777;
            }
            .el-textarea__inner {
                background-color: #fff;
            }
        }
        /deep/ .el-form-item__label {
            color: #333333;
        }
    }
</style>
