<template>
    <div>
        <el-form :model="dataCollectionForm" :rules="dataCollectionFormRules"
                 class="demo-form-inline dataCollectionForm"
                 ref="dataCollectionForm"
                 label-width="200px"
                 label-position="right">
            <el-divider content-position="left">THB/USDT 汇率采集</el-divider>
            <el-form-item label="汇率采集时间：" prop="curRateTime">
                <el-date-picker
                    v-model="dataCollectionForm.curRateTime"
                    type="datetime"
                    :disabled="isDetail"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间"
                    :default-time="time"
                    @change="getProfitRate">
                </el-date-picker>
                <p class="exchangeRate">{{rateText}}</p>
            </el-form-item>
            <el-form-item label="THB/USDT 汇率修正：" prop="exchangeRateCheck">
                <el-input placeholder="请输入汇率修正值" :disabled="isDetail" oninput="value=value.replace(/[^\d.]/g,'')"
                          v-model="dataCollectionForm.exchangeRateCheck" size="small"
                          class="input-with-select totalPrice">
                    <template slot="append">
                        <el-button type="primary" :disabled="isDetail" @click="resetRateCheck">重置</el-button>
                    </template>
                </el-input>
            </el-form-item>
            <el-divider content-position="left">PTEx快照采集</el-divider>
            <el-form-item>
                <div class="uploadLabel" slot="label">
                    <span class="label">PTEx快照：</span><br/>
                    <a href="javascript:;" class="label-href" @click="downloadTemplate">快照模板下载</a>
                </div>
                <el-upload
                    class="upload-demo" :class="isDetail?'is-disabled':''"
                    accept=".xls,.xlsx"
                    ref="upload"
                    :multiple="false"
                    drag
                    action=""
                    :limit='2'
                    :before-upload="beforeUpload"
                    :http-request="uploadSectionFile"
                    :on-remove="removeFile"
                    :disabled="isDetail"
                    :file-list="files"
                    :auto-upload="true"
                    :onSuccess="uploadSuccess"
                    :onError="uploadError">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
            </el-form-item>
            <el-divider content-position="left">PTOHome 账户快照及区块链数据采集</el-divider>
            <el-form-item label="快照时间：" prop="snapshotDate">
                <el-date-picker
                    v-model="dataCollectionForm.snapshotDate"
                    type="datetime"
                    :disabled="isDetail"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间"
                    :default-time="time">
                </el-date-picker>
            </el-form-item>
            <el-form-item size="small" class="btns">
                <el-button type="primary" @click="onNext" v-if="!isDetail">保存并下一步</el-button>
                <el-button type="primary" @click="onNextOnly" v-else>下一步</el-button>
                <el-button @click="onPre">上一步</el-button>
                <el-button size="small" @click="returnList">返回列表</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {
        getDataCollection,
        saveDataCollection,
        getProfitRate,
        accountSnapshotTimeQuery,
        imageUpload
    } from '@/api/post-investment/new-dividends'
    import {judgingempty, fractionalformat} from '@/utils/validate'
    import {getZoneTimeTamp, getCurLeng} from '@/utils/filters'
    import Cookie from 'js-cookie'

    export default {
        name: 'DataCollection',
        data () {
            // 合约回报率校验
            const checkRate = (rule, value, callback) => {
                if (!judgingempty(this.dataCollectionForm.exchangeRateCheck)) {
                    return callback(new Error('请输入汇率修正值'))
                } else if (!fractionalformat(this.dataCollectionForm.exchangeRateCheck)) {
                    return callback(new Error('请输入正确的汇率修正值'))
                } else {
                    this.dataCollectionForm.exchangeRateCheck = parseFloat(getCurLeng(this.dataCollectionForm.exchangeRateCheck, 4))
                    return callback()
                }
            }
            return {
                dataCollectionForm: {
                    // 采集时间
                    curRateTime: '',
                    // 汇率修正值
                    exchangeRateCheck: '',
                    // 快照时间
                    snapshotDate: ''
                },
                rateText: '',
                dataCollectionFormRules: {
                    curRateTime: [
                        {required: true, message: '请选择汇率采集时间', trigger: 'blur'}
                    ],
                    exchangeRateCheck: [
                        {required: true, validator: checkRate, trigger: 'blur'}
                    ],
                    snapshotDate: [
                        {required: true, message: '请选择快照时间', trigger: 'blur'}
                    ]
                },
                // 是否为查看详情
                isDetail: false,
                files: [],
                profitId: '',
                exchangeRateCheck: '',
                // 上传文件自定义请求头
                uploadHeader: {Authorization: 'bearer' + ' ' + Cookie.get('token_cms')},
                // form原始数据
                oldFormData: {},
                // 上传文件数据
                uploadFile: '',
                // 是否有文件上传
                hasPtexSnapshot: false,
                // 是否有初始汇率数据
                hasInitRateData: false,
                // 推荐时间
                time: ''
            }
        },
        created () {
            // 初始化数据
            this.profitId = this.$route.query.profitId
            this.searchDetails()
            if (this.$route.query) {
                if (this.$route.query.details) {
                    this.isDetail = true
                }
            }
            this.accountSnapshotTimeQuery()
        },
        methods: {
            /**
             * 自定义上传文件
             * @param params 上传的文件
             */
            uploadSectionFile (params) {
                const file = params.file
                const form = new FormData()
                form.append('file', file)
                form.append('profitId', this.profitId)
                imageUpload(form).then(res => {
                    if (res.code.toString() === '0') {
                        this.uploadSuccess(res)
                    } else {
                        this.uploadError(res)
                    }
                }).catch(err => {
                    this.uploadError(err)
                })
            },
            /**
             * 查询账户快照生成时间
             */
            accountSnapshotTimeQuery () {
                let data = {
                    traceId: Math.random().toString(36).substr(2)
                }
                accountSnapshotTimeQuery(data).then(res => {
                    if (res.code.toString() === '0') {
                        // 任意+8时间
                        let date = this.parseTime(new Date(), '{y}-{m}-{d}') + ' ' + res.data
                        // 转换指定时区的时间
                        this.time = this.getZoneTime(getZoneTimeTamp(date, 8)).substring(11)
                    }
                })
            },
            // 获取初始数据
            searchDetails () {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        profitId: this.profitId
                    }
                }
                getDataCollection(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.dataCollectionForm.curRateTime = res.data.curRateTime === null ? '' : this.getZoneTime(res.data.curRateTime)
                        if (res.data.curRate) {
                            this.dataCollectionForm.exchangeRateCheck = res.data.curRate
                            this.exchangeRateCheck = res.data.curRate
                            this.hasInitRateData = true
                        }
                        this.dataCollectionForm.snapshotDate = res.data.accountSnapshotTime === null ? '' : this.getZoneTime(res.data.accountSnapshotTime)
                        if (res.data.hasPtexSnapshot) {
                            this.hasPtexSnapshot = true
                            this.files = [{name: 'PTEx快照.xlsx', url: ''}]
                        }
                        this.profitId = res.data.profitId
                        this.oldFormData = JSON.parse(JSON.stringify(this.dataCollectionForm))
                        this.getProfitRate()
                    } else {
                        this.$message.error(res.msg)
                    }
                }).catch(err => {
                    this.$message.error(err.msg)
                })
            },
            // 上传前数据处理
            beforeUpload (file) {
                this.files = []
                this.files.push(file)
                this.uploadFile = file
            },
            // 文件列表移除文件触发事件
            removeFile () {
                this.files = []
                this.uploadFile = ''
                this.hasPtexSnapshot = false
            },
            // 上传快照成功后回调
            uploadSuccess (res) {
                if (res.code.toString() === '0') {
                    this.hasPtexSnapshot = true
                    this.$message.success('导入成功')
                } else {
                    this.hasPtexSnapshot = false
                    this.uploadFile = ''
                    this.files = []
                    this.$message.error(res.msg)
                }
            },
            // 上传快照失败后回调
            uploadError (res) {
                this.hasPtexSnapshot = false
                this.$message.error(res.msg)
                this.uploadFile = ''
                this.files = []
            },
            // 导出
            downloadTemplate () {
                // window.open("/api/v2/cms/wallet/present/export/excel","_blank");
                window.location.href = '/api/v2/cms/profit/snapshot/template/down'
            },
            // 获取汇率
            getProfitRate () {
                if (this.dataCollectionForm.curRateTime) {
                    let params = {
                        traceId: Math.random().toString(36).substr(2),
                        data: {
                            profitBaseId: this.profitId,
                            rateTime: this.dataCollectionForm.curRateTime
                        }
                    }
                    getProfitRate(params).then(res => {
                        if (res.code.toString() === '0') {
                            let res_ = res.data
                            if (res_ !== null) {
                                if (!this.hasInitRateData) {
                                    this.exchangeRateCheck = res_.legalTender2cryptoCurrencyRate
                                    this.dataCollectionForm.exchangeRateCheck = parseFloat(res_.legalTender2cryptoCurrencyRate)
                                }
                                this.rateText = `${res_.cryptoCurrency2legalTenderCode}：${res_.cryptoCurrency2legalTenderRate}；${res_.legalTender2cryptoCurrencyCode}：${res_.legalTender2cryptoCurrencyRate}`
                            } else {
                                if (!this.hasInitRateData) {
                                    this.exchangeRateCheck = '0'
                                    this.dataCollectionForm.exchangeRateCheck = '0'
                                }
                                this.rateText = '暂未获取到汇率'
                            }
                        } else {
                            this.$message.error(res.msg)
                        }
                    })
                } else {
                    this.rateText = ''
                }
            },
            // 重置汇率修正值
            resetRateCheck () {
                this.dataCollectionForm.exchangeRateCheck = this.exchangeRateCheck
            },
            // 下一步
            onNext () {
                this.$refs['dataCollectionForm'].validate((valid) => {
                    if (valid) {
                        // if (this.files.length === 0) {
                        //     this.$message.error('请上传PTEx快照')
                        //     return false
                        // }
                        let formData = new FormData()
                        formData.append('file', this.uploadFile)
                        formData.append('profitId', this.profitId)
                        formData.append('hasPtexSnapshot', this.hasPtexSnapshot)
                        formData.append('curRateTimeStr', this.dataCollectionForm.curRateTime)
                        formData.append('curRate', this.dataCollectionForm.exchangeRateCheck)
                        formData.append('accountSnapshotTimeStr', this.dataCollectionForm.snapshotDate)
                        saveDataCollection(formData).then(res => {
                            if (res.code.toString() === '0') {
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
            // 上一步
            onPre () {
                if (JSON.stringify(this.oldFormData) !== JSON.stringify(this.dataCollectionForm)) {
                    this.$confirm('当前输入内容还未保存，如果取消，输入内容将会丢失。', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$emit('preStep')
                    }).catch(() => {
                    })
                } else {
                    this.$emit('preStep')
                }
            },
            /**
             * 返回列表
             */
            returnList () {
                if (JSON.stringify(this.oldFormData) !== JSON.stringify(this.dataCollectionForm)) {
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
        }
    }
</script>

<style lang="scss" scoped>

    .dataCollectionForm {
        width: 80%;
        margin: 0 auto;
        padding-top: 50px;
        .exchangeRate {
            font-size: 16px;
            line-height: 24px;
            margin: 0;
        }
        .input-with-select {
            width: 300px;
            /deep/ .el-input-group__append {
                background-color: #fff;
                text-align: center;
                width: 50px;
            }
        }
        /deep/ .el-divider__text {
            color: #333333;
        }
        .uploadLabel {
            .label-href {
                color: #2EA9DF;
                font-weight: normal;
            }
        }
        .account-snapshot-tip {
            padding-left: 200px;
            font-size: 12px;
            color: #666666;
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
            .el-input-group__append {
                overflow: hidden;
            }
            button {
                background-color: #fff;
                color: #777;
            }
            .el-upload-dragger {
                cursor: no-drop;
            }
        }
    }
</style>
