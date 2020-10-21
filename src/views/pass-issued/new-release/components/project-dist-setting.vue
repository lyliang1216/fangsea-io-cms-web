<template>
    <div>
        <el-form ref="projectDistSetting" :rules="projectDistSettingrules" :model="projectDistSetting"
                 label-width="180px">
            <el-form-item label="发行方：" prop="issueUserCode">
                <el-input v-model="projectDistSetting.issueUserCode" class="with-unit-input" readonly
                          placeholder="请选择发行方">
                    <el-button
                        class="append-btn"
                        slot="append"
                        :disabled="issueState!==0&&issueState!==1"
                        @click="showkyclist">选择
                    </el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="发行方自持数量：" prop="selfAmount">
                <el-input v-model="projectDistSetting.selfAmount"
                          :disabled="issueState!==0&&issueState!==1"
                          oninput="value=value.replace(/[^\d.]/g,'')"
                          placeholder="请填写发行方自持数量"
                          @change="singlehighest"></el-input>
            </el-form-item>
            <el-form-item label="项目最低认购数量：" prop="minimumBuyAmount">
                <el-input v-model.number="projectDistSetting.minimumBuyAmount" @input="inputtennum"
                          @change="cminimumBuyAmount" placeholder="请填写项目最低认购数量"></el-input>
            </el-form-item>
            <el-form-item label="项目最低认购人数：" prop="minimumPeopleAmount">
                <el-input v-model.number="projectDistSetting.minimumPeopleAmount"
                          oninput="value=value.replace(/[^\d]/g,'')"
                          placeholder="请填写项目最低认购人数"></el-input>
            </el-form-item>
            <el-form-item label="单人最低认购数量：" prop="userMinAmount">
                <el-input v-model="projectDistSetting.userMinAmount" oninput="value=value.replace(/[^\d.]/g,'')"
                          @change="cuserMinAmount"
                          placeholder="请填写单人最低认购数量"></el-input>
            </el-form-item>
            <el-form-item label="单人最高认购数量：" prop="userMaxAmount">
                <el-input v-model="projectDistSetting.userMaxAmount" oninput="value=value.replace(/[^\d.]/g,'')"
                          @change="cuserMaxAmount"
                          placeholder="请填写单人最高认购数量"></el-input>
            </el-form-item>
            <el-form-item label="即将售罄提示百分比：" prop="sellOutRatio">
                <el-input class="with-unit-input" v-model.number="projectDistSetting.sellOutRatio"
                          oninput="value=value.replace(/[^\d]/g,'')"
                          placeholder="请填写即将售罄提示百分比">
                    <template slot="append">%</template>
                </el-input>
            </el-form-item>
            <el-form-item label="保证金及币种：" prop="depositPrice">
                <el-input placeholder="请填写保证金" v-model="projectDistSetting.depositPrice"
                          :disabled="payState===1||(issueState!==0&&issueState!==1)"
                          class="input-with-select">
                    <el-select v-model="projectDistSetting.depositCurId" slot="append" placeholder="请选择"
                               @change="checkCur" class="telareacode" clearable filterable>
                        <el-option
                            v-for="item in paycurrlist"
                            :key="item.curId"
                            :label="item.code"
                            :disabled="(payState===1&&item.curId!==projectDistSetting.depositCurId)||(issueState!==0&&issueState!==1)"
                            :value="item.curId">
                        </el-option>
                    </el-select>
                </el-input>
            </el-form-item>
            <el-form-item label="上市费用及币种：" prop="paymentPrice">
                <el-input placeholder="请填写上市费用" v-model="projectDistSetting.paymentPrice"
                          class="input-with-select">
                    <el-select v-model="projectDistSetting.paymentCurId" slot="append" placeholder="请选择"
                               @change="checkpriceCur" class="telareacode" clearable filterable>
                        <el-option
                            v-for="item in legalcurrlist"
                            :key="item.id"
                            :label="item.code"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-input>
            </el-form-item>
            <el-form-item label="发行单价：" prop="ptExchangeRate">
                <div>
                    <el-radio v-model="projectDistSetting.ptRateAuto" :label="true" @change="setauto">自动设置</el-radio>
                    <el-radio v-model="projectDistSetting.ptRateAuto" :label="false" @change="setauto">手动设置</el-radio>
                </div>
                <el-input v-model="projectDistSetting.ptExchangeRate"
                          @keyup.native="inputptExchangeRate"
                          :disabled="projectDistSetting.ptRateAuto"
                          placeholder="请填写发行单价"
                          class="ptExchangeRate-input">
                </el-input>
                <el-tooltip class="item" effect="light" placement="right-end">
                    <div slot="content">指购买1个PT需要支付的数量<br v-if="exchangerate_text1!==''"/>{{exchangerate_text1}}<br
                        v-if="exchangerate_text2!==''">{{exchangerate_text2}}
                    </div>
                    <i class="el-icon-info"></i>
                </el-tooltip>
            </el-form-item>
            <el-form-item label="价格锁定时间：" prop="priceLockTime">
                <el-input class="with-unit-input" oninput="value=value.replace(/[^\d.]/g,'')"
                          v-model.number="projectDistSetting.priceLockTime" placeholder="请填写">
                    <template slot="append">秒</template>
                </el-input>
            </el-form-item>
            <div class="bottom-btn-box">
                <el-button v-if="issueState===0" size="small" @click="nextpage6('projectDistSetting', false)">暂&emsp;存
                </el-button>
                <el-button size="small" type="primary" @click="nextpage6('projectDistSetting', false, 'pre')">上一步
                </el-button>
                <el-button size="small" type="primary" @click="nextpage6('projectDistSetting', true, 'next')">
                    保&emsp;存
                </el-button>
            </div>
        </el-form>
        <el-dialog title="选择发行方" :close-on-click-modal="false" :visible.sync="showcheckkyclist" width="60%">
            <el-form :inline="true" ref="filterkyc" :model="filterkyc" class="filter-form-inline">
                <el-form-item label="UID" size="small">
                    <el-input v-model="filterkyc.userCode" size="small" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="电子邮箱" size="small">
                    <el-input v-model="filterkyc.email" size="small" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" size="small">
                    <el-input v-model="filterkyc.mobile" size="small" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-button type="primary" size="small" @click="getkyclist">搜索</el-button>
                <el-button size="small" @click="resetfilterkyc">重置</el-button>
            </el-form>
            <el-table
                stripe
                :data="kyclist"
                style="width: 100%">
                <el-table-column
                    prop="userCode"
                    width="140"
                    label="UID">
                </el-table-column>
                <el-table-column
                    prop="familyName"
                    label="KYC姓氏">
                </el-table-column>
                <el-table-column
                    prop="selfName"
                    label="KYC名字">
                </el-table-column>
                <el-table-column
                    prop="email"
                    label="电子邮箱">
                </el-table-column>
                <el-table-column
                    prop="mobile"
                    label="手机号码">
                </el-table-column>
                <el-table-column
                    width="100"
                    label="操作">
                    <template slot-scope="props">
                        <el-button type="primary" size="small" @click="checkkycrow(props.row)">选择</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="kyccurrentPage"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="kycpageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="kyctotal">
            </el-pagination>
        </el-dialog>
    </div>
</template>

<script>
    import {
        tempDistset,
        saveDistset,
        tempDistsetUpdate,
        saveDistsetUpdate,
        getDistset,
        getKyclist,
        getCommonlegalcurr,
        getUsercode,
        getPaycurr,
        getDist,
        getAllcurr,
        getPaymentrate
    } from '@/api/pass-issued/new-release'
    import {fractionalformat} from '@/utils/validate'
    import Tinymce from '@/components/Tinymce'
    import {inputlimit, getFullNum, getfloat} from '@/utils/filters'

    // 发行设置
    export default {
        name: 'index',
        props: {
            projectIdf: {
                type: Number
            },
            issueState: {
                type: Number
            },
            payState: {
                type: Number
            }
        },
        data () {
            const lessseventy = (rule, value, callback) => {
                if (this.projectDistSetting.selfAmount === '') {
                    return callback(new Error('请填写发行方自持数量'))
                } else if (!fractionalformat(this.projectDistSetting.selfAmount)) {
                    return callback(new Error('请填写正确格式'))
                } else {
                    let s = this.ptAmount
                    if (s !== 0 && s !== '') {
                        if (value > s * 0.7) {
                            return callback(new Error('自持数量不超过总额的70%'))
                        } else {
                            this.projectDistSetting.selfAmount = getfloat(this.projectDistSetting.selfAmount, this.allprecision)
                            return callback()
                        }
                    } else {
                        this.projectDistSetting.selfAmount = getfloat(this.projectDistSetting.selfAmount, this.allprecision)
                        return callback()
                    }
                }
            }
            const vminimumBuyAmount = (rule, value, callback) => {
                if (value === '' || value === null) {
                    return callback(new Error('请填写项目最低认购数量'))
                } else if (this.projectDistSetting.minimumBuyAmount.toString() === '0') {
                    return callback(new Error('项目最低认购数量不能为0'))
                } else if (this.ptAmount && this.ptAmount > 0) {
                    if (this.projectDistSetting.selfAmount !== '') {
                        let snum = this.ptAmount - this.projectDistSetting.selfAmount
                        if (snum < this.projectDistSetting.minimumBuyAmount) {
                            return callback(new Error('项目最低认购数量不得高于通证总量减去自持数量'))
                        }
                    }
                }
                return callback()
            }
            const vuserprecision1 = (rule, value, callback) => {
                let min = this.projectDistSetting.userMinAmount * 1
                let max = this.projectDistSetting.userMaxAmount * 1
                if (this.projectDistSetting.userMinAmount === '' || this.projectDistSetting.userMinAmount === null) {
                    return callback(new Error('请填写单人最低认购数量'))
                } else if (!fractionalformat(this.projectDistSetting.userMinAmount)) {
                    return callback(new Error('请填写正确格式'))
                } else if (this.projectDistSetting.userMinAmount.toString() === '0') {
                    return callback(new Error('单人最低认购数量不得为0'))
                } else if (max < min) {
                    return callback(new Error('最高认购数量需大于或等于最低认购数量'))
                } else {
                    this.projectDistSetting.userMinAmount = getfloat(this.projectDistSetting.userMinAmount, this.allprecision)
                    return callback()
                }
            }
            const vuserprecision2 = (rule, value, callback) => {
                let min = this.projectDistSetting.userMinAmount * 1
                let max = this.projectDistSetting.userMaxAmount * 1
                if (this.projectDistSetting.userMaxAmount === '' || this.projectDistSetting.userMaxAmount === null) {
                    return callback(new Error('请填写单人最高认购数量'))
                } else if (!fractionalformat(this.projectDistSetting.userMaxAmount)) {
                    return callback(new Error('请填写正确格式'))
                } else if (max < min) {
                    return callback(new Error('最高认购数量需大于或等于最低认购数量'))
                } else {
                    this.projectDistSetting.userMaxAmount = getfloat(this.projectDistSetting.userMaxAmount, this.allprecision)
                    return callback()
                }
            }
            const checkcurr1 = (rule, value, callback) => {
                if (this.projectDistSetting.depositPrice === '') {
                    return callback(new Error('请填写保证金'))
                } else if (!(/^-?[1-9]+(\.\d+)?$|^-?0(\.\d+)?$|^-?[1-9]+[0-9]*(\.\d+)?$/.test(this.projectDistSetting.depositPrice))) {
                    return callback(new Error('请输入正确格式'))
                } else if (!fractionalformat(this.projectDistSetting.depositPrice)) {
                    return callback(new Error('请填写正确格式'))
                } else if (this.projectDistSetting.depositCurId === '') {
                    return callback(new Error('请选择币种'))
                } else {
                    this.projectDistSetting.depositPrice = getfloat(this.projectDistSetting.depositPrice, this.marginprecision)
                    return callback()
                }
            }
            const checkcurr2 = (rule, value, callback) => {
                if (this.projectDistSetting.paymentPrice === '') {
                    return callback(new Error('请填写上市费用'))
                } else if (!(/^-?[1-9]+(\.\d+)?$|^-?0(\.\d+)?$|^-?[1-9]+[0-9]*(\.\d+)?$/.test(this.projectDistSetting.paymentPrice))) {
                    return callback(new Error('请输入正确格式'))
                } else if (!fractionalformat(this.projectDistSetting.paymentPrice)) {
                    return callback(new Error('请填写正确格式'))
                } else if (this.projectDistSetting.paymentCurId === '') {
                    return callback(new Error('请选择币种'))
                } else {
                    this.projectDistSetting.paymentPrice = getfloat(this.projectDistSetting.paymentPrice, this.curLeng)
                    return callback()
                }
            }
            const vptExchangeRate = (rule, value, callback) => {
                if (this.projectDistSetting.ptExchangeRate === '') {
                    return callback(new Error('请填写发行单价'))
                } else if (!fractionalformat(this.projectDistSetting.ptExchangeRate)) {
                    return callback(new Error('请填写正确格式'))
                } else {
                    return callback()
                }
            }
            const vpriceLockTime = (rule, value, callback) => {
                if (this.projectDistSetting.priceLockTime === '') {
                    return callback(new Error('请填写价格锁定时间'))
                } else if (this.projectDistSetting.priceLockTime <= 0) {
                    return callback(new Error('价格锁定时间需大于0'))
                } else {
                    return callback()
                }
            }
            const checksellOutRatio = (rule, value, callback) => {
                if (value * 1 > 99) {
                    this.projectDistSetting.sellOutRatio = 99
                } else {
                    return callback()
                }
            }
            return {
                // 项目id
                projectId: -1,
                // 页面id
                examineId: '',
                // 所有币种列表
                allcurrlist: [],
                // 法币列表
                legalcurrlist: [],
                // 支付币种
                paycurrlist: [],
                // 所有币种精度 = 单人最低最高，自持数量精度
                allprecision: 0,
                // 保证金精度 = 保证金币种精度
                marginprecision: 0,
                /**
                 * 发行设置
                 */
                projectDistSetting: {
                    // 发行设置id
                    distSettingId: '',
                    // 发行人userid
                    issueUserId: '',
                    // 发行人UID
                    issueUserCode: '',
                    // 发行方自持数量
                    selfAmount: '',
                    // 最低认购数量
                    minimumBuyAmount: '',
                    // 最低预售认购人数
                    minimumPeopleAmount: '',
                    // 单人最低认购数量
                    userMinAmount: 100,
                    // 单人最高认购数量
                    userMaxAmount: null,
                    // 即将售罄提示百分比
                    sellOutRatio: 85,
                    // 保证金币种
                    depositCurId: '',
                    // 保证金币符号
                    depositCurCode: '',
                    // 保证金金额
                    depositPrice: '',
                    // 上市费用币种
                    paymentCurId: '',
                    // 上市费用币符号
                    paymentCurCode: '',
                    // 上市费用金额
                    paymentPrice: '',
                    // 发行单价设置自动手动
                    ptRateAuto: true,
                    // 发行单价，pt/fst汇率
                    ptExchangeRate: '',
                    // 价格锁定时间
                    priceLockTime: ''
                },
                // 发行人列表
                kyclist: [],
                // 显示发行人列表弹框
                showcheckkyclist: false,
                // 发行人筛选内容
                filterkyc: {
                    userCode: '',
                    email: '',
                    mobile: ''
                },
                // 当前页
                kyccurrentPage: 1,
                // 总数据条数
                kyctotal: 0,
                // 每页条数
                kycpageSize: 10,
                // 通证数量
                ptAmount: '',
                // 是否获取过信息，初始化，校验表单是否修改(表单修改)
                getinfo: false,
                // 是否获取过信息，初始化，校验表单是否修改(uid)
                getucode: false,
                // 是否获取过信息，初始化，校验表单是否修改(发行单价)
                setRate: false,
                // 发行内容中设置的
                exchangerate: {
                    // 法币id
                    priceCurId: '',
                    // 法币code
                    priceCurCode: '',
                    // 支付货币id
                    curId: '',
                    // 支付货币code
                    curCode: '',
                    // 通证价格
                    ptPrice: ''
                },
                // 加密货币对法币汇率
                exchangerate_text1: '',
                // pt对法币汇率
                exchangerate_text2: '',
                // pt对加密货币汇率默认值（自动）
                ptExchangeRate_Defaults: '',
                // pt对加密货币汇率（修改后的手动）
                ptExchangeRate_Defaults_s: '',
                // 表单验证
                projectDistSettingrules: {
                    issueUserCode: [
                        {required: true, message: '请选择发行方', trigger: 'change'}
                    ],
                    selfAmount: [
                        {required: true, trigger: 'blur', validator: lessseventy}
                    ],
                    minimumBuyAmount: [
                        {required: true, validator: vminimumBuyAmount, trigger: 'blur'}
                    ],
                    minimumPeopleAmount: [
                        {required: true, message: '请填写项目最低认购人数', trigger: 'blur'}
                    ],
                    // 单人最低
                    userMinAmount: [
                        {required: true, validator: vuserprecision1, trigger: 'blur'}
                    ],
                    // 单人最高
                    userMaxAmount: [
                        {required: true, validator: vuserprecision2, trigger: 'blur'}
                    ],
                    // 即将售罄百分比
                    sellOutRatio: [
                        {required: false, validator: checksellOutRatio, trigger: 'blur'}
                    ],
                    depositPrice: [
                        {required: true, validator: checkcurr1, trigger: 'blur'}
                    ],
                    paymentPrice: [
                        {required: true, validator: checkcurr2, trigger: 'blur'}
                    ],
                    ptExchangeRate: [
                        {required: true, validator: vptExchangeRate, trigger: 'blur'}
                    ],
                    priceLockTime: [
                        {required: true, validator: vpriceLockTime, trigger: 'blur'}
                    ]
                },
                // 当前中介评估价格精度
                curLeng: 2
            }
        },
        mounted () {
            if (this.projectIdf) {
                this.projectId = this.projectIdf
            }
            // 获取支付币种
            this.getpaycurr()
            // 获取法币
            this.getlegalcurr()
            // 获取发行设置
            this.getprojectDistSetting()
        },
        watch: {
            projectDistSetting: {
                handler () {
                    if (this.getinfo) {
                        this.getinfo = false
                    } else if (this.getucode) {
                        this.getucode = false
                    } else if (this.setRate) {
                        this.setRate = false
                    } else {
                        this.$emit('tabschange', 1)
                    }
                },
                deep: true
            }
        },
        methods: {
            /**
             *  获取支付币种
             */
            getpaycurr () {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        pageSize: 0
                    }
                }
                getPaycurr(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.paycurrlist = res.data.list
                    }
                }).catch(() => {
                })
            },
            /**
             *  获取法币
             */
            getlegalcurr () {
                let params = {
                    traceId: Math.random().toString(36).substr(2)
                }
                getCommonlegalcurr(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.legalcurrlist = res.data
                    } else {
                        this.$message.error(res.msg)
                    }
                }).catch(() => {
                })
            },
            /**
             *  获取所有币种
             */
            getallcurr () {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {}
                }
                getAllcurr(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.allcurrlist = res.data.list
                        // 获取发行内容
                        this.getprojectDist()
                    }
                }).catch(() => {
                })
            },
            /**
             *  获取支付币种code
             */
            checkCur (value) {
                let _this = this
                this.paycurrlist.find((item) => {
                    if (value === item.curId) {
                        _this.projectDistSetting.depositCurCode = item.code
                        _this.marginprecision = item.decimals
                    }
                })
                this.$refs.projectDistSetting.validateField('depositPrice')
            },
            /**
             *  获取法币币种code
             */
            checkpriceCur (value) {
                let _this = this
                this.legalcurrlist.find((item) => {
                    if (value === item.id) {
                        _this.projectDistSetting.paymentCurCode = item.code
                        _this.curLeng = item.curLeng
                    }
                })
                this.$refs.projectDistSetting.validateField('paymentPrice')
            },
            /**
             *  选择发行方
             *  @param row 选中的行数据
             */
            checkkycrow (row) {
                this.showcheckkyclist = false
                this.projectDistSetting.issueUserId = row.userId
                this.projectDistSetting.issueUserCode = row.userCode
            },
            /**
             *  修改每页条数
             *  @param val 每页条数
             */
            handleSizeChange (val) {
                this.this.kycpageSize = val
                this.getkyclist()
            },
            /**
             *  页码跳转
             *  @param val 跳转到第几页
             */
            handleCurrentChange (val) {
                this.kyccurrentPage = val
                this.getkyclist()
            },
            /**
             * 打开发行人列表
             */
            showkyclist () {
                this.showcheckkyclist = true
                this.getkyclist()
            },
            /**
             * 重置搜索发行人列表
             */
            resetfilterkyc () {
                this.filterkyc = {
                    userCode: '',
                    email: '',
                    mobile: ''
                }
                this.getkyclist()
            },
            /**
             * 获取发行人列表
             */
            getkyclist () {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        pageNum: this.kyccurrentPage,
                        pageSize: this.kycpageSize,
                        filter: this.filterkyc
                    }
                }
                getKyclist(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.kyclist = res.data.list
                        this.kyctotal = res.data.total
                    } else {
                        this.$message.error(res.msg)
                    }
                }).catch(() => {
                })
            },
            /**
             * 通过uid获取发行人code
             */
            getissueusercode (id) {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: id
                }
                getUsercode(params).then(res => {
                    this.getucode = true
                    if (res.code.toString() === '0') {
                        this.projectDistSetting.issueUserCode = res.data.userCode
                    } else {
                        this.$message.error(res.msg)
                    }
                }).catch(() => {
                })
            },
            /**
             *  加密货币汇率查询
             */
            getpaymentrate () {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        legalCurId: this.exchangerate.priceCurId,
                        legalCurCode: this.exchangerate.priceCurCode,
                        encCurId: this.exchangerate.curId,
                        encCurCode: this.exchangerate.curCode
                    }
                }
                getPaymentrate(params).then(res => {
                    // 计算后的汇率
                    let defaults = ''
                    // 保留8位小数后的汇率
                    let defaultsc = ''
                    if (res.code.toString() === '0') {
                        this.exchangerate_text1 = this.exchangerate.curCode + '/' + this.exchangerate.priceCurCode + '=' + res.data.exchangeRate
                        defaults = getFullNum(this.exchangerate.ptPrice / res.data.exchangeRate)
                        // 小数位数
                        let s = String(defaults).length - String(defaults).indexOf('.') - 1
                        if (s > 8 && String(defaults).indexOf('.') !== -1) {
                            let xs = String(defaults)[String(defaults).indexOf('.') + 9]
                            let s8 = parseFloat(String(defaults).substring(0, String(defaults).indexOf('.') + 9))
                            if (xs !== '0') {
                                defaultsc = s8 + parseFloat(getFullNum(0.00000001))
                            } else {
                                defaultsc = s8
                            }
                            defaultsc = parseFloat(String(defaultsc).substring(0, String(defaultsc).indexOf('.') + 9))
                        } else {
                            defaultsc = defaults
                        }
                    }
                    if (this.exchangerate.priceCurId !== null && this.exchangerate.ptPrice !== null) {
                        this.exchangerate_text2 = 'PT/' + this.exchangerate.priceCurCode + '=' + this.exchangerate.ptPrice
                    }
                    if (defaultsc !== '') {
                        this.ptExchangeRate_Defaults = defaultsc
                        if (!this.projectDistSetting.ptExchangeRate && this.exchangerate_text1 !== '' && this.exchangerate_text2 !== '') {
                            this.ptExchangeRate_Defaults_s = defaultsc
                            this.projectDistSetting.ptExchangeRate = defaultsc
                        } else {
                            this.ptExchangeRate_Defaults_s = this.projectDistSetting.ptExchangeRate
                        }
                    } else {
                        if (this.projectDistSetting.ptExchangeRate === '') {
                            this.projectDistSetting.ptExchangeRate = 0
                            this.ptExchangeRate_Defaults_s = 0
                            this.ptExchangeRate_Defaults = 0
                        } else {
                            this.ptExchangeRate_Defaults = 0
                        }
                    }
                    this.setRate = true
                }).catch()
            },
            /**
             *  发行单价校验
             */
            inputptExchangeRate () {
                if (fractionalformat(this.projectDistSetting.ptExchangeRate)) {
                    this.projectDistSetting.ptExchangeRate = inputlimit(this.projectDistSetting.ptExchangeRate, 10, 8)
                }
            },
            /**
             *  限制输入十位正整数
             */
            inputtennum (value) {
                this.projectDistSetting.minimumBuyAmount = value.replace(/[^\d]/g, '')
                if (this.projectDistSetting.minimumBuyAmount.length > 10) {
                    this.projectDistSetting.minimumBuyAmount = this.projectDistSetting.minimumBuyAmount.substring(0, 10)
                }
            },
            /**
             *  选择自动手动
             */
            setauto (value) {
                if (value) {
                    this.ptExchangeRate_Defaults_s = this.projectDistSetting.ptExchangeRate
                    this.projectDistSetting.ptExchangeRate = this.ptExchangeRate_Defaults
                } else {
                    this.projectDistSetting.ptExchangeRate = this.ptExchangeRate_Defaults_s
                }
            },
            /**
             *  获取发行内容
             */
            getprojectDist () {
                // 判断是否为第一次新增
                if (this.projectId !== -1) {
                    let params = {
                        traceId: Math.random().toString(36).substr(2),
                        data: {
                            projectId: this.projectId
                        }
                    }
                    getDist(params).then(res => {
                        if (res.code.toString() === '0') {
                            this.getinfo = true
                            if (res.data) {
                                if (res.data.ptCurId) {
                                    for (let i in this.allcurrlist) {
                                        if (this.allcurrlist[i].curId.toString() === res.data.ptCurId.toString()) {
                                            this.allprecision = Number(this.allcurrlist[i].decimals)
                                        }
                                    }
                                }
                                this.exchangerate.priceCurId = res.data.priceCurId
                                this.exchangerate.priceCurCode = res.data.priceCurCode
                                this.exchangerate.curId = res.data.curId
                                this.exchangerate.curCode = res.data.curCode
                                this.exchangerate.ptPrice = res.data.ptPrice
                                this.ptAmount = res.data.totalAmount
                            }
                            this.getpaymentrate()
                        }
                    }).catch(() => {
                    })
                } else {
                    this.getinfo = true
                    this.projectDistSetting.ptExchangeRate = 0
                    this.ptExchangeRate_Defaults_s = 0
                    this.ptExchangeRate_Defaults = 0
                }
            },
            /**
             *  获取发行设置
             */
            getprojectDistSetting () {
                // 判断是否为第一次新增
                if (this.projectId !== -1) {
                    let params = {
                        traceId: Math.random().toString(36).substr(2),
                        data: {
                            projectId: this.projectId
                        }
                    }
                    getDistset(params).then(res => {
                        if (res.code.toString() === '0') {
                            this.getinfo = true
                            if (res.data) {
                                for (let key in this.projectDistSetting) {
                                    if (res.data[key] || res.data[key] === 0) {
                                        this.projectDistSetting[key] = res.data[key]
                                    }
                                }
                                if (res.data.ptExchangeRate === null) {
                                    this.projectDistSetting.ptExchangeRate = 0
                                } else if (res.data.ptExchangeRate.toString().indexOf('e') !== -1) {
                                    this.projectDistSetting.ptExchangeRate = getFullNum(res.data.ptExchangeRate)
                                } else {
                                    this.projectDistSetting.ptExchangeRate = res.data.ptExchangeRate
                                }
                                this.projectDistSetting.ptRateAuto = res.data.ptRateAuto
                                if (this.projectDistSetting.issueUserId) {
                                    // 获取发行方回显uid
                                    this.getissueusercode(this.projectDistSetting.issueUserId)
                                }
                            }
                        } else {
                            this.$message.error(res.msg)
                        }
                    }).catch(() => {
                    })
                }
                // 获取所有币种
                this.getallcurr()
            },
            /**
             *  发行设置 暂存/上一步/下一步/保存事件
             *  @param formname 表单名称
             *  @param bool 是否校验格式
             *  @param direction pre上一步，next下一步
             */
            nextpage6 (formname, bool, direction) {
                this.$emit('opencloseloading', 1)
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: JSON.parse(JSON.stringify(this.projectDistSetting))
                }
                if (this.projectId !== -1) {
                    params.data.projectId = this.projectId
                } else {
                    params.data.projectId = null
                }
                if (params.data.ptExchangeRate !== '') {
                    params.data.ptExchangeRate = parseFloat(params.data.ptExchangeRate)
                }
                if (params.data.ptRateAuto) {
                    delete params.data['ptExchangeRate']
                }
                if (bool) {
                    this.$refs[formname].validate((valid) => {
                        if (valid) {
                            if (this.projectId !== -1) {
                                saveDistsetUpdate(params).then(res => {
                                    if (res.code.toString() === '0') {
                                        this.handleReqSucc(res)
                                        this.$emit('submitall', params)
                                    } else {
                                        this.$emit('opencloseloading', 0)
                                        this.$message.error(res.msg)
                                    }
                                }).catch(() => {
                                    this.$emit('opencloseloading', 0)
                                })
                            } else {
                                saveDistset(params).then(res => {
                                    if (res.code.toString() === '0') {
                                        this.handleReqSucc(res)
                                        this.$emit('submitall', params)
                                    } else {
                                        this.$emit('opencloseloading', 0)
                                        this.$message.error(res.msg)
                                    }
                                }).catch(() => {
                                    this.$emit('opencloseloading', 0)
                                })
                            }
                        } else {
                            this.$emit('opencloseloading', 0)
                            return false
                        }
                    })
                } else {
                    if (this.issueState !== 0) {
                        this.$refs[formname].validate((valid) => {
                            if (valid) {
                                if (this.projectId !== -1) {
                                    saveDistsetUpdate(params).then(res => {
                                        this.$emit('opencloseloading', 0)
                                        if (res.code.toString() === '0') {
                                            this.handleReqSucc(res)
                                            this.$emit('prepage', 'projectDist')
                                        } else {
                                            this.$message.error(res.msg)
                                        }
                                    }).catch(() => {
                                        this.$emit('opencloseloading', 0)
                                    })
                                } else {
                                    saveDistset(params).then(res => {
                                        this.$emit('opencloseloading', 0)
                                        if (res.code.toString() === '0') {
                                            this.handleReqSucc(res)
                                            this.$emit('prepage', 'projectDist')
                                        } else {
                                            this.$message.error(res.msg)
                                        }
                                    }).catch(() => {
                                        this.$emit('opencloseloading', 0)
                                    })
                                }
                            } else {
                                this.$emit('opencloseloading', 0)
                                return false
                            }
                        })
                    } else {
                        if (this.projectId !== -1) {
                            tempDistsetUpdate(params).then(res => {
                                this.$emit('opencloseloading', 0)
                                if (res.code.toString() === '0') {
                                    this.handleReqSucc(res)
                                    this.$message.success('草稿已保存')
                                    if (direction === 'pre') {
                                        // 切换标签页
                                        this.$emit('prepage', 'projectDist')
                                    }
                                } else {
                                    this.$message.error(res.msg)
                                }
                            }).catch(() => {
                                this.$emit('opencloseloading', 0)
                            })
                        } else {
                            tempDistset(params).then(res => {
                                this.$emit('opencloseloading', 0)
                                if (res.code.toString() === '0') {
                                    this.handleReqSucc(res)
                                    this.$message.success('草稿已保存')
                                    if (direction === 'pre') {
                                        // 切换标签页
                                        this.$emit('prepage', 'projectDist')
                                    }
                                } else {
                                    this.$message.error(res.msg)
                                }
                            }).catch(() => {
                                this.$emit('opencloseloading', 0)
                            })
                        }
                    }
                }
            },
            /**
             *  处理请求成功数据
             * @param res 请求的返回数据
             */
            handleReqSucc (res) {
                this.projectId = res.data ? res.data.projectId : ''
                this.$emit('returnproject', this.projectId)
                this.getinfo = true
                this.$emit('tabschange', 0)
            },
            /**
             *  单人最高认购数量
             *  @param value 发行方自持数量
             */
            singlehighest (value) {
                if (this.ptAmount !== '' && this.projectDistSetting.selfAmount && (this.projectDistSetting.userMaxAmount === '' || !this.projectDistSetting.userMaxAmount)) {
                    let max = Number(this.ptAmount) - Number(this.projectDistSetting.selfAmount)

                    if (this.projectDistSetting.userMinAmount > max) {
                        this.projectDistSetting.userMaxAmount = this.projectDistSetting.userMinAmount
                    } else {
                        this.projectDistSetting.userMaxAmount = max
                    }
                }
                if (this.projectDistSetting.minimumBuyAmount !== '') {
                    this.$refs.projectDistSetting.validateField('minimumBuyAmount')
                }
            },
            // 单人最低认购
            cuserMinAmount () {
                if (this.projectDistSetting.userMaxAmount !== '') {
                    this.$refs.projectDistSetting.validateField('userMaxAmount')
                }
            },
            // 单人最高认购
            cuserMaxAmount () {
                if (this.projectDistSetting.userMinAmount !== '') {
                    this.$refs.projectDistSetting.validateField('userMinAmount')
                }
            },
            cminimumBuyAmount () {
                if (this.projectDistSetting.selfAmount !== '') {
                    this.$refs.projectDistSetting.validateField('selfAmount')
                }
            }
        },
        components: {
            Tinymce
        }
    }
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
    .form-item-group {
        font-size: 18px;
        margin: 0 0 16px;
        padding: 0 0 16px;
        border-bottom: 1px solid #dcdfe6;
        font-weight: 600;
    }

    .selectright {
        margin-right: 10px;
    }

    .choosetime {
        width: 70px;
        margin: 0 8px;
    }

    .with-unit-input {
        width: 375px;
    }

    .input-with-select {
        max-width: 375px;
    }

    .ptExchangeRate-input {
        width: 375px;
    }

    .telareacode {
        width: 140px;
        height: 40px;
        background: #fff;
        border: 1px solid #DCDFE6;
        border-left: 0;
        box-sizing: border-box;
    }

    .bottom-btn-box {
        margin-top: 30px;
        display: flex;
        justify-content: center;
    }

    .bottom-btn-box button {
        padding: 10px 23px;
        margin: 0 10px;
    }

    .el-icon-info {
        font-size: 18px;
        color: #2EA9DF;
        cursor: pointer;
        margin-left: 4px;
    }

    /deep/ .el-input-group__append {
        background: transparent;
    }
</style>
