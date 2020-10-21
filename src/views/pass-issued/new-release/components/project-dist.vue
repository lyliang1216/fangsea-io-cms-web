<template>
    <div>
        <el-form ref="projectDist" :rules="projectDistrules" :model="projectDist" label-width="150px">
            <el-form-item label="币种：" prop="ptCurId">
                <el-select v-model="projectDist.ptCurId" @change="checkptCur" clearable filterable placeholder="请选择币种">
                    <el-option
                        v-for="item in allcurrlist"
                        :key="item.curId"
                        :disabled="(issueState!==0&&issueState!==1)&&item.curId!==projectDist.ptCurId"
                        :label="item.code"
                        :value="item.curId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="期望预售销售比例：" prop="planSalesRatio">
                <el-input class="with-unit-input" oninput="value=value.replace(/[^\d.]/g,'')"
                          v-model="projectDist.planSalesRatio" placeholder="请填写">
                    <template slot="append">%</template>
                </el-input>
            </el-form-item>
            <el-form-item label="设置支付币种：" prop="curId">
                <el-select v-model="projectDist.curId" @change="checkCur" clearable filterable placeholder="请选择币种">
                    <el-option
                        v-for="item in paycurrlist"
                        :key="item.curId"
                        :disabled="(issueState!==0&&issueState!==1)&&item.curId!==projectDist.curId"
                        :label="item.code"
                        :value="item.curId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="总价：" prop="totalPrice">
                <el-input v-model="projectDist.totalPrice" @keyup.native="keyup()"
                          placeholder="请填写房产总价" class="with-unit-input">
                    <el-select class="telareacode" v-model="projectDist.priceCurId" slot="append" placeholder="请选择"
                               @change="checkpriceCur" clearable filterable>
                        <el-option
                            v-for="item in legalcurrlist"
                            :key="item.id"
                            :label="item.code"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-input>
                <span class="usdt-text" v-show="isUSDT"> ≈ {{exchangePrice}} USDT</span>
            </el-form-item>
            <el-form-item label="通证数量：">
                <el-input v-model="ptAmount" readonly></el-input>
            </el-form-item>
            <el-form-item label="通证价格：">
                <el-input v-model="ptPrice" readonly></el-input>
            </el-form-item>
            <el-form-item label="租金收益：" prop="prospectiveYield">
                <el-input v-model="projectDist.prospectiveYield"
                          placeholder="请填写租金收益，如：50000THB 或 6.7%"></el-input>
            </el-form-item>
            <el-form-item label="预售最小时间：" prop="planMinTime">
                <el-input v-model.number="projectDist.planMinTime" oninput="value=value.replace(/[^\d]/g,'')"
                          @change="changeplantime" class="with-unit-input" placeholder="">
                    <template slot="append">天</template>
                </el-input>
            </el-form-item>
            <el-form-item label="预售最大时间：" prop="planMaxTime">
                <el-input v-model.number="projectDist.planMaxTime" oninput="value=value.replace(/[^\d]/g,'')"
                          @change="changeplantime" class="with-unit-input" placeholder="">
                    <template slot="append">天</template>
                </el-input>
            </el-form-item>
            <el-form-item label="预售开始时间：" prop="planStartTime">
                <el-date-picker
                    @change="checkstartendtime"
                    :clearable="false"
                    v-model="startdate"
                    :disabled="issueState!==0&&issueState!==1"
                    type="date"
                    placeholder="选择日期"
                    :picker-options="pickoptionstart"
                    value-format="timestamp">
                </el-date-picker>
                <el-select class="choosetime"
                           clearable
                           filterable
                           :disabled="issueState!==0&&issueState!==1"
                           v-model="starthour"
                           @change="checkstartendtime"
                           placeholder="">
                    <el-option
                        v-for="item in 24"
                        :key="addzero(item-1)"
                        :label="addzero(item-1)"
                        :value="addzero(item-1)">
                    </el-option>
                </el-select>
                <span>时</span>
                <el-select
                    class="choosetime"
                    clearable
                    filterable
                    :disabled="issueState!==0&&issueState!==1"
                    v-model="startmin"
                    @change="checkstartendtime"
                    placeholder="">
                    <el-option key="00" label="00" value="00"></el-option>
                    <el-option key="30" label="30" value="30"></el-option>
                </el-select>
                <span>分</span>
            </el-form-item>
            <el-form-item label="预售结束时间：" prop="planEndTime">
                <el-date-picker
                    @change="checkstartendtime"
                    :clearable="false"
                    v-model="enddate"
                    :disabled="issueState!==0&&issueState!==1"
                    type="date"
                    placeholder="选择日期"
                    :picker-options="pickoptionend"
                    value-format="timestamp">
                </el-date-picker>
                <el-select
                    class="choosetime"
                    clearable
                    filterable
                    :disabled="issueState!==0&&issueState!==1"
                    v-model="endhour"
                    @change="checkstartendtime"
                    placeholder="">
                    <el-option
                        v-for="item in 24"
                        :key="addzero(item-1)"
                        :label="addzero(item-1)"
                        :value="addzero(item-1)">
                    </el-option>
                </el-select>
                <span>时</span>
                <el-select
                    class="choosetime"
                    clearable
                    filterable
                    :disabled="issueState!==0&&issueState!==1"
                    v-model="endmin"
                    @change="checkstartendtime"
                    placeholder="">
                    <el-option key="00" label="00" value="00"></el-option>
                    <el-option key="30" label="30" value="30"></el-option>
                </el-select>
                <span>分</span>
            </el-form-item>
            <div class="bottom-btn-box">
                <el-button v-if="issueState===0" size="small" @click="nextpage5('projectDist', false)">暂&emsp;存
                </el-button>
                <el-button size="small" type="primary" @click="nextpage5('projectDist', false, 'pre')">上一步</el-button>
                <el-button size="small" type="primary" @click="nextpage5('projectDist', true, 'next')">下一步</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
    import {
        saveDist,
        tempDist,
        saveDistUpdate,
        tempDistUpdate,
        getMaterial,
        getDist,
        getPaycurr,
        getAllcurr,
        getLegalcurr
    } from '@/api/pass-issued/new-release'
    import {fractionalformat} from '@/utils/validate'
    import Tinymce from '@/components/Tinymce'
    import {getFullNum, getZoneTimeTamp, getfloat, getCurLeng} from '@/utils/filters'

    // 发行内容
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
            // 预售开始时间
            const checkstart = (rule, value, callback) => {
                if (this.issueState !== 0 && this.issueState !== 1) {
                    return callback()
                } else {
                    let starttime = this.startdate + this.starthour * 60 * 60 * 1000 + this.startmin * 60 * 1000
                    let endtime = this.enddate + this.endhour * 60 * 60 * 1000 + this.endmin * 60 * 1000
                    let planmintime = this.projectDist.planMinTime * 24 * 60 * 60 * 1000
                    let planmaxtime = this.projectDist.planMaxTime * 24 * 60 * 60 * 1000
                    if (this.projectDist.planMinTime === '' || this.projectDist.planMaxTime === '') {
                        return callback(new Error('请先填写预售最小时间和预售最大时间'))
                    } else if (starttime < Date.now() && this.startdate !== '') {
                        return callback(new Error('开始时间与当前时间过于接近，请重新选择'))
                    } else if (endtime - starttime < planmintime && this.enddate !== '') {
                        return callback(new Error('预售持续时间应大于' + this.projectDist.planMinTime + '天'))
                    } else if (endtime - starttime > planmaxtime && this.startdate !== '') {
                        return callback(new Error('预售持续时间应小于' + this.projectDist.planMaxTime + '天'))
                    } else {
                        return callback()
                    }
                }
            }
            // 预售结束时间
            const checkend = (rule, value, callback) => {
                if (this.issueState !== 0 && this.issueState !== 1) {
                    return callback()
                } else {
                    let starttime = this.startdate + this.starthour * 60 * 60 * 1000 + this.startmin * 60 * 1000
                    let endtime = this.enddate + this.endhour * 60 * 60 * 1000 + this.endmin * 60 * 1000
                    let planmintime = this.projectDist.planMinTime * 24 * 60 * 60 * 1000
                    let planmaxtime = this.projectDist.planMaxTime * 24 * 60 * 60 * 1000
                    if (this.projectDist.planMinTime === '' || this.projectDist.planMaxTime === '') {
                        return callback(new Error('请先填写预售最小时间和预售最大时间'))
                    } else if (endtime - starttime < planmintime && this.enddate !== '') {
                        return callback(new Error('预售持续时间应大于' + this.projectDist.planMinTime + '天'))
                    } else if (endtime - starttime > planmaxtime && this.startdate !== '') {
                        return callback(new Error('预售持续时间应小于' + this.projectDist.planMaxTime + '天'))
                    } else {
                        return callback()
                    }
                }
            }
            // 期望预售销售比例校验
            const keeptwo = (rule, value, callback) => {
                if (value === '') {
                    return callback()
                } else if (value !== '') {
                    if (!fractionalformat(value)) {
                        return callback(new Error('请填写正确格式'))
                    } else if (value !== '') {
                        this.projectDist.planSalesRatio = getfloat(value)
                        return callback()
                    }
                }
            }
            const checkcurr = (rule, value, callback) => {
                if (this.projectDist.totalPrice === '') {
                    return callback(new Error('请填写房产总价'))
                } else if (!(/^-?[1-9]+(\.\d+)?$|^-?0(\.\d+)?$|^-?[1-9]+[0-9]*(\.\d+)?$/.test(this.projectDist.totalPrice))) {
                    return callback(new Error('请输入正确格式'))
                } else if (!fractionalformat(this.projectDist.totalPrice)) {
                    return callback(new Error('请填写正确格式'))
                } else if (this.projectDist.priceCurId === '') {
                    return callback(new Error('请选择币种'))
                } else {
                    this.projectDist.totalPrice = getCurLeng(this.projectDist.totalPrice, this.curLeng)
                    return callback()
                }
            }
            return {
                // 项目id
                projectId: -1,
                // 页面id
                examineId: '',
                /**
                 * 发行内容
                 */
                projectDist: {
                    // 发行内容id
                    distId: '',
                    // pt币种
                    ptCurId: '',
                    // pt币种符号
                    ptCurCode: '',
                    // 支付币种id
                    curId: 3,
                    // 支付币种符号
                    curCode: 'FST',
                    // 期望预售销售比例
                    planSalesRatio: '',
                    // 项目总价(法币)币种
                    priceCurId: '',
                    // 项目总价(法币)符号
                    priceCurCode: '',
                    // 项目总价(法币)
                    totalPrice: '',
                    // 租金收益
                    prospectiveYield: '',
                    // 预售最小时间
                    planMinTime: '3',
                    // 预售最大时间
                    planMaxTime: '14',
                    // 预售开始时间
                    planStartTime: '',
                    // 预售结束时间
                    planEndTime: ''
                },
                // 是否显示USDT
                isUSDT: false,
                // 通证数量
                ptAmount: '',
                // 通证价格
                ptPrice: '',
                // 开始日期
                startdate: '',
                // 开始时
                starthour: '00',
                // 开始分
                startmin: '00',
                // 结束日期
                enddate: '',
                // 结束时
                endhour: '00',
                // 结束分
                endmin: '00',
                // 法币列表
                legalcurrlist: [],
                // 所有币种
                allcurrlist: [],
                // 支付币种
                paycurrlist: [],
                // USDT值
                exchangePrice: '',
                // 面积
                measure: '',
                // 是否获取过信息，初始化，校验表单是否修改
                getinfo: false,
                // 表单验证
                projectDistrules: {
                    ptCurId: [
                        {required: true, message: '请选择币种', trigger: 'change'}
                    ],
                    planSalesRatio: [
                        {required: false, validator: keeptwo, trigger: 'blur'}
                    ],
                    curId: [
                        {required: true, message: '请选择支付币种', trigger: 'change'}
                    ],
                    totalPrice: [
                        {required: true, validator: checkcurr, trigger: 'blur'}
                    ],
                    prospectiveYield: [
                        {required: true, message: '请填写租金收益，如：50000THB 或 6.7%', trigger: 'blur'}
                    ],
                    planMinTime: [
                        {required: true, message: '请填写预售最小时间', trigger: 'blur'}
                    ],
                    planMaxTime: [
                        {required: true, message: '请填写预售最大时间', trigger: 'blur'}
                    ],
                    planStartTime: [
                        {required: true, validator: checkstart, trigger: 'change'}
                    ],
                    planEndTime: [
                        {required: true, validator: checkend, trigger: 'change'}
                    ]
                },
                // 日期选择器范围
                pickoptionstart: {
                    disabledDate: (time) => {
                        if (this.enddate !== '') {
                            return time.getTime() < (Date.now() - 24 * 60 * 60 * 1000) || time.getTime() > this.enddate
                        } else {
                            return time.getTime() < (Date.now() - 24 * 60 * 60 * 1000)
                        }
                    }
                },
                // 日期选择器范围
                pickoptionend: {
                    disabledDate: (time) => {
                        if (this.startdate !== '') {
                            return time.getTime() < this.startdate
                        } else {
                            return time.getTime() < this.startdate || time.getTime() < (Date.now() - 24 * 60 * 60 * 1000)
                        }
                    }
                },
                // 当前中介评估价格精度
                curLeng: 2
            }
        },
        mounted () {
            if (this.projectIdf) {
                this.projectId = this.projectIdf
            }
            // 获取法币
            this.getlegalcurr()
            // 获取支付币种
            this.getpaycurr()
            // 获取所有币种
            this.getallcurr()
        },
        watch: {
            projectDist: {
                handler () {
                    if (this.getinfo) {
                        this.getinfo = false
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
             *  获取所有币种
             */
            getallcurr () {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        pageSize: 0
                    }
                }
                getAllcurr(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.allcurrlist = res.data.list
                    }
                    // 获取发行内容
                    this.getprojectDist()
                }).catch(() => {
                    // 获取发行内容
                    this.getprojectDist()
                })
            },
            /**
             *  获取法币
             */
            getlegalcurr () {
                let params = {
                    traceId: Math.random().toString(36).substr(2)
                }
                getLegalcurr(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.legalcurrlist = res.data
                    }
                }).catch(() => {
                })
            },
            /**
             *  小时数值个位补零
             *  @param n 0-23小时
             */
            addzero (n) {
                n = n.toString()
                if (n !== '24') {
                    return n < 10 ? '0' + n : n
                } else {
                    return '00'
                }
            },
            /**
             *  获取所有币种code
             */
            checkptCur (value) {
                let _this = this
                this.allcurrlist.find((item) => {
                    if (value === item.curId) {
                        _this.projectDist.ptCurCode = item.code
                    }
                })
            },
            /**
             *  获取支付币种code
             */
            checkCur (value) {
                let _this = this
                this.paycurrlist.find((item) => {
                    if (value === item.curId) {
                        _this.projectDist.curCode = item.code
                    }
                })
            },
            /**
             *  获取法币币种code
             */
            checkpriceCur (value) {
                let _this = this
                this.legalcurrlist.find((item) => {
                    if (value === item.id) {
                        _this.projectDist.priceCurCode = item.code
                        _this.curLeng = item.curLeng
                    }
                })
                this.$refs.projectDist.validateField('totalPrice')
                this.keyup()
            },
            /**
             *  设置预售开始结束时间（初始没有值）
             */
            setstartendtime () {
                // 获取小时，分钟
                let myDate = new Date(this.getZoneTime())
                let years = myDate.getFullYear()
                let month = myDate.getMonth() + 1
                let date = myDate.getDate()
                let hours = myDate.getHours()
                let minutes = myDate.getMinutes()
                // 获取当前时间戳
                let datetamp = getZoneTimeTamp(years + '-' + month + '-' + date + ' 00:00:00') * 1000
                // 取最近半小时时间
                if (minutes < 30) {
                    this.startmin = '30'
                    this.endmin = '30'
                    this.endhour = this.addzero(hours)
                    this.starthour = this.addzero(hours)
                    this.startdate = datetamp
                    this.enddate = datetamp + parseInt(this.projectDist.planMaxTime) * 24 * 3600 * 1000
                } else {
                    this.startmin = '00'
                    this.endmin = '00'
                    this.endhour = this.addzero(hours + 1)
                    this.starthour = this.addzero(hours + 1)
                    if (hours === 23) {
                        datetamp += 24 * 3600 * 1000
                    }
                    this.startdate = datetamp
                    this.enddate = datetamp + parseInt(this.projectDist.planMaxTime) * 24 * 3600 * 1000
                }
            },
            /**
             *  获取预售开始结束时间（有值）
             */
            gettstartendtime () {
                if (this.projectDist.planStartTime) {
                    let starttime = this.getZoneTime(this.projectDist.planStartTime)
                    let st = starttime.substring(0, 10) + ' 00:00:00'
                    this.startdate = getZoneTimeTamp(st) * 1000
                    this.starthour = starttime.substring(11, 13)
                    this.startmin = starttime.substring(14, 16)
                } else {
                    this.startdate = ''
                    this.starthour = '00'
                    this.startmin = '00'
                }
                if (this.projectDist.planEndTime) {
                    let endtime = this.getZoneTime(this.projectDist.planEndTime)
                    let et = endtime.substring(0, 10) + ' 00:00:00'
                    this.enddate = getZoneTimeTamp(et) * 1000
                    this.endhour = endtime.substring(11, 13)
                    this.endmin = endtime.substring(14, 16)
                } else {
                    this.enddate = ''
                    this.endhour = '00'
                    this.endmin = '00'
                }
                this.$refs.projectDist.validateField('planStartTime')
                this.$refs.projectDist.validateField('planEndTime')
            },
            /**
             *  通证价格计算
             */
            keyup () {
                if (this.measure && this.measure !== '' && this.projectDist.totalPrice !== '') {
                    let totalPrice = Number(this.projectDist.totalPrice) / Number(this.measure * 10000)
                    this.ptPrice = getfloat(totalPrice, this.curLeng, true)
                    this.ptPrice = getFullNum(this.ptPrice) + ' ' + this.projectDist.priceCurCode
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
                                for (let key in this.projectDist) {
                                    if (res.data[key] || res.data[key] === 0) {
                                        this.projectDist[key] = res.data[key]
                                    }
                                }
                                this.projectDist.planMinTime = this.projectDist.planMinTime / 60 / 60 / 24
                                this.projectDist.planMaxTime = this.projectDist.planMaxTime / 60 / 60 / 24
                                // 预售开始结束时间
                                if (!this.projectDist.planEndTime && !this.projectDist.planStartTime) {
                                    this.setstartendtime()
                                } else {
                                    this.gettstartendtime()
                                }
                                if (this.projectDist.priceCurId) {
                                    let _this = this
                                    this.legalcurrlist.find((item) => {
                                        if (this.projectDist.priceCurId === item.id) {
                                            _this.projectDist.priceCurCode = item.code
                                            _this.curLeng = item.curLeng
                                        }
                                    })
                                }
                            } else {
                                this.setstartendtime()
                            }
                            // 获取面积
                            this.getprojectMaterial()
                        } else {
                            this.$message.error(res.msg)
                        }
                    }).catch(() => {
                        // 获取面积
                        this.getprojectMaterial()
                    })
                } else {
                    // 预售开始结束时间
                    this.setstartendtime()
                    // 获取面积
                    this.getprojectMaterial()
                }
            },
            /**
             *  发行内容 暂存/上一步/下一步/保存事件
             *  @param formname 表单名称
             *  @param bool 是否校验格式
             *  @param direction pre上一步，next下一步
             */
            nextpage5 (formname, bool, direction) {
                this.$emit('opencloseloading', 1)
                let projectDist = JSON.parse(JSON.stringify(this.projectDist))
                projectDist.planStartTime = this.getZoneTime((this.startdate + this.starthour * 60 * 60 * 1000 + this.startmin * 60 * 1000) / 1000)
                projectDist.planEndTime = this.getZoneTime((this.enddate + this.endhour * 60 * 60 * 1000 + this.endmin * 60 * 1000) / 1000)
                projectDist.planMinTime = projectDist.planMinTime * 24 * 60 * 60
                projectDist.planMaxTime = projectDist.planMaxTime * 24 * 60 * 60
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: projectDist
                }
                if (this.projectId !== -1) {
                    params.data.projectId = this.projectId
                } else {
                    params.data.projectId = null
                }
                if (bool) {
                    this.$refs[formname].validate((valid) => {
                        if (valid) {
                            if (this.projectId !== -1) {
                                saveDistUpdate(params).then(res => {
                                    this.$emit('opencloseloading', 0)
                                    if (res.code.toString() === '0') {
                                        this.handleReqSucc(res)
                                        // 切换标签页
                                        this.$emit('nextpage', 'projectDistSetting')
                                    } else {
                                        this.$message.error(res.msg)
                                    }
                                }).catch(() => {
                                    this.$emit('opencloseloading', 0)
                                })
                            } else {
                                saveDist(params).then(res => {
                                    this.$emit('opencloseloading', 0)
                                    if (res.code.toString() === '0') {
                                        this.handleReqSucc(res)
                                        // 切换标签页
                                        this.$emit('nextpage', 'projectDistSetting')
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
                    if (this.issueState !== 0) {
                        this.$refs[formname].validate((valid) => {
                            if (valid) {
                                if (this.projectId !== -1) {
                                    saveDistUpdate(params).then(res => {
                                        this.$emit('opencloseloading', 0)
                                        if (res.code.toString() === '0') {
                                            this.handleReqSucc(res)
                                            // 切换标签页
                                            this.$emit('prepage', 'projectExamine')
                                        } else {
                                            this.$message.error(res.msg)
                                        }
                                    }).catch(() => {
                                        this.$emit('opencloseloading', 0)
                                    })
                                } else {
                                    saveDist(params).then(res => {
                                        this.$emit('opencloseloading', 0)
                                        if (res.code.toString() === '0') {
                                            this.handleReqSucc(res)
                                            // 切换标签页
                                            this.$emit('prepage', 'projectExamine')
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
                        if (!this.startdate || this.startdate === '') {
                            params.data.planStartTime = null
                        }
                        if (!this.enddate || this.enddate === '') {
                            params.data.planEndTime = null
                        }
                        if (this.projectId !== -1) {
                            tempDistUpdate(params).then(res => {
                                this.$emit('opencloseloading', 0)
                                if (res.code.toString() === '0') {
                                    this.handleReqSucc(res)
                                    this.$message.success('草稿已保存')
                                    if (direction === 'pre') {
                                        // 切换标签页
                                        this.$emit('prepage', 'projectExamine')
                                    }
                                } else {
                                    this.$message.error(res.msg)
                                }
                            }).catch(() => {
                                this.$emit('opencloseloading', 0)
                            })
                        } else {
                            tempDist(params).then(res => {
                                this.$emit('opencloseloading', 0)
                                if (res.code.toString() === '0') {
                                    this.handleReqSucc(res)
                                    this.$message.success('草稿已保存')
                                    if (direction === 'pre') {
                                        // 切换标签页
                                        this.$emit('prepage', 'projectExamine')
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
             *  获取项目资料面积
             */
            getprojectMaterial () {
                // 判断是否为第一次新增
                if (this.projectId !== -1) {
                    let params = {
                        traceId: Math.random().toString(36).substr(2),
                        data: {
                            projectId: this.projectId
                        }
                    }
                    getMaterial(params).then(res => {
                        if (res.code.toString() === '0') {
                            if (res.data) {
                                this.measure = res.data.measure
                                if (this.measure !== '') {
                                    this.ptAmount = parseInt(Number(this.measure) * 10000)
                                }
                                this.keyup()
                            }
                        } else {
                            this.$message.error(res.msg)
                        }
                    }).catch(() => {
                    })
                }
            },
            /**
             *  选择预售开始结束时间小时分钟
             */
            checkstartendtime () {
                if (this.getinfo) {
                    this.getinfo = false
                } else {
                    this.$emit('tabschange', 1)
                }
                this.$refs.projectDist.validateField('planStartTime')
                this.$refs.projectDist.validateField('planEndTime')
            },
            /**
             *  填写预售最大最小时间
             */
            changeplantime () {
                this.$refs.projectDist.validateField('planStartTime')
                this.$refs.projectDist.validateField('planEndTime')
            }
        },
        components: {
            Tinymce
        }
    }
</script>
<style scoped>
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

    .usdt-text {
        position: absolute;
        top: 4px;
        margin-left: 5px;
        font-size: 16px;
    }

    .input-with-select {
        max-width: 375px;
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

    /deep/ .el-input-group__append {
        background: transparent;
    }
</style>
