<template>
    <div>
        <el-form ref="projectExamine" :rules="projectExaminerules" :model="projectExamine" label-width="150px">
            <el-form-item label="律所调查报告：" prop="lawFirmSurveyImg">
                <upload-file
                    :accept="'.jpg, .png, .pdf'"
                    :fileList="projectExamine.lawFirmSurveyImg"
                    :limit="10"
                    @inUploading="cantsubmit"
                    @uploadSuccess="saveImgSucc($event, 'lawFirmSurveyImg')"
                    @removeFile="removeFile($event, 'lawFirmSurveyImg')">
                </upload-file>
            </el-form-item>
            <el-form-item label="市场评估报告：" prop="intermediarySurveyImg">
                <upload-file
                    :accept="'.jpg, .png, .pdf'"
                    :fileList="projectExamine.intermediarySurveyImg"
                    :limit="10"
                    @inUploading="cantsubmit"
                    @uploadSuccess="saveImgSucc($event, 'intermediarySurveyImg')"
                    @removeFile="removeFile($event, 'intermediarySurveyImg')">
                </upload-file>
            </el-form-item>
            <el-form-item label="房产通证发行协议：" prop="agreementImg">
                <upload-file
                    :accept="'.jpg, .png, .pdf'"
                    :fileList="projectExamine.agreementImg"
                    :limit="10"
                    @inUploading="cantsubmit"
                    @uploadSuccess="saveImgSucc($event, 'agreementImg')"
                    @removeFile="removeFile($event, 'agreementImg')">
                </upload-file>
            </el-form-item>
            <el-form-item label="其他：" prop="otherFile">
                <upload-file
                    :accept="'.jpg, .png, .pdf'"
                    :fileList="projectExamine.otherFile"
                    :limit="10"
                    @inUploading="cantsubmit"
                    @uploadSuccess="saveImgSucc($event, 'otherFile')"
                    @removeFile="removeFile($event, 'otherFile')">
                </upload-file>
            </el-form-item>
            <el-form-item label="中介机构评估价格：" prop="intermediaryPrice">
                <el-input placeholder="请填写中介机构评估价格"
                          v-model="projectExamine.intermediaryPrice"
                          class="input-with-select">
                    <el-select class="telareacode" v-model="projectExamine.intermediaryCurId" slot="append"
                               placeholder="请选择"
                               @change="checkintermediaryCur" clearable filterable>
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
            <el-form-item label="产品风险评估：" prop="ventureCapitalLevel">
                <el-select class="product-type" v-model="projectExamine.ventureCapitalLevel" placeholder="请选择"
                           clearable filterable @change="checkProductType">
                    <el-option
                        v-for="item in ventureCapitalLevel"
                        :key="item.id"
                        :label="item.type"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <div class="bottom-btn-box">
                <el-button v-if="issueState===0" size="small" @click="nextpage4('projectExamine', false)">暂&emsp;存
                </el-button>
                <el-button size="small" type="primary" @click="nextpage4('projectExamine', false, 'pre')">上一步
                </el-button>
                <el-button size="small" type="primary" @click="nextpage4('projectExamine', true, 'next')">下一步
                </el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
    import {
        saveExamine,
        tempExamine,
        saveExamineUpdate,
        tempExamineUpdate,
        getExamine,
        getLegalcurr
    } from '@/api/pass-issued/new-release'
    import {fractionalformat} from '@/utils/validate'
    import {getfloat, getFileId, resetFileList, upSetFileList} from '@/utils/filters'
    import uploadFile from '@/components/Upload'
    import Tinymce from '@/components/Tinymce'

    // 发行资料
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
            const checkcurr = (rule, value, callback) => {
                if (this.projectExamine.intermediaryPrice === '') {
                    return callback(new Error('请填写中介机构评估价格'))
                } else if (!(/^-?[1-9]+(\.\d+)?$|^-?0(\.\d+)?$|^-?[1-9]+[0-9]*(\.\d+)?$/.test(this.projectExamine.intermediaryPrice))) {
                    return callback(new Error('请输入正确格式'))
                } else if (!fractionalformat(this.projectExamine.intermediaryPrice)) {
                    return callback(new Error('请填写正确格式'))
                } else if (this.projectExamine.intermediaryCurId === '') {
                    this.projectExamine.intermediaryPrice = getfloat(this.projectExamine.intermediaryPrice, this.curLeng)
                    return callback(new Error('请选择币种'))
                } else {
                    this.projectExamine.intermediaryPrice = getfloat(this.projectExamine.intermediaryPrice, this.curLeng)
                    return callback()
                }
            }
            const checkProductType = (rule, value, callback) => {
                if (this.projectExamine.ventureCapitalLevel === '') {
                    return callback(new Error('产品风险评估'))
                } else {
                    return callback()
                }
            }
            return {
                // 项目id
                projectId: -1,
                // 页面id
                examineId: '',
                jibenoptions2: [],
                // 法币列表
                legalcurrlist: [],
                // 风险评估
                ventureCapitalLevel: [{
                    id: 'S1',
                    type: 'S1 保本型'
                },
                {
                    id: 'S2',
                    type: 'S2 稳健型'
                }, {
                    id: 'S3',
                    type: 'S3 成长型'
                }, {
                    id: 'S4',
                    type: 'S4 积极型'
                }],
                // USDT值
                exchangePrice: '',
                // 是否显示USDT
                isUSDT: false,
                /**
                 * 发行资料
                 */
                projectExamine: {
                    // 发行资料id
                    examineId: '',
                    // 律所调查报告图
                    lawFirmSurveyImg: [],
                    // 市场评估报告图
                    intermediarySurveyImg: [],
                    // 房产通证发行协议
                    agreementImg: [],
                    // 其他文件
                    otherFile: [],
                    // 中介评估币种id
                    intermediaryCurId: '',
                    // 中介评估币种名称
                    intermediaryCurCode: '',
                    // 中介评估价格
                    intermediaryPrice: '',
                    // 产品风险评估
                    ventureCapitalLevel: ''
                },
                // 是否获取过信息，初始化，校验表单是否修改
                getinfo: false,
                // 文件是否未上传完成
                cantsub: false,
                // 上传中的文件
                uploadfilelist: [],
                // 表单验证
                projectExaminerules: {
                    intermediaryPrice: [
                        {required: true, validator: checkcurr, trigger: 'blur'}
                    ],
                    ventureCapitalLevel: [
                        {required: true, validator: checkProductType, trigger: 'blur'}
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
            // 获取法币
            this.getlegalcurr()
            // 获取发行资料
            this.getprojectExamine()
        },
        watch: {
            projectExamine: {
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
             *  获取法币
             */
            getlegalcurr () {
                let params = {
                    traceId: Math.random().toString(36).substr(2)
                }
                getLegalcurr(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.legalcurrlist = res.data
                    } else {
                        this.$message.error(res.msg)
                    }
                }).catch(() => {
                })
            },
            /**
             *  获取中介机构评估价格币种code
             */
            checkintermediaryCur (value) {
                let _this = this
                this.legalcurrlist.find((item) => {
                    if (value === item.id) {
                        _this.projectExamine.intermediaryCurCode = item.code
                        _this.curLeng = item.curLeng
                    }
                })
                this.$refs.projectExamine.validateField('intermediaryPrice')
            },
            /**
             *  校验产品风险评估
             */
            checkProductType (value) {
                this.$refs.projectExamine.validateField('ventureCapitalLevel')
            },
            /**
             *  获取发行资料
             */
            getprojectExamine () {
                // 判断是否为第一次新增
                if (this.projectId !== -1) {
                    let params = {
                        traceId: Math.random().toString(36).substr(2),
                        data: {
                            projectId: this.projectId
                        }
                    }
                    getExamine(params).then(res => {
                        if (res.code.toString() === '0') {
                            this.getinfo = true
                            if (res.data) {
                                for (let key in this.projectExamine) {
                                    if (res.data[key] || res.data[key] === 0) {
                                        this.projectExamine[key] = res.data[key]
                                    }
                                }
                                this.projectExamine.lawFirmSurveyImg = resetFileList(this.projectExamine.lawFirmSurveyImg)
                                this.projectExamine.intermediarySurveyImg = resetFileList(this.projectExamine.intermediarySurveyImg)
                                this.projectExamine.agreementImg = resetFileList(this.projectExamine.agreementImg)
                                this.projectExamine.otherFile = resetFileList(this.projectExamine.otherFile)
                            }
                        } else {
                            this.$message.error(res.msg)
                        }
                    }).catch(() => {
                    })
                }
            },
            /**
             *  发行资料 暂存/上一步/下一步/保存事件
             *  @param formname 表单名称
             *  @param bool 是否校验格式
             *  @param direction pre上一步，next下一步
             */
            nextpage4 (formname, bool, direction) {
                this.$emit('opencloseloading', 1)
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: JSON.parse(JSON.stringify(this.projectExamine))
                }
                if (this.projectId !== -1) {
                    params.data.projectId = this.projectId
                } else {
                    params.data.projectId = null
                }
                if (this.cantsub) {
                    this.$message.warning('请等待文件上传完成')
                    this.$emit('opencloseloading', 0)
                } else {
                    params.data.lawFirmSurveyImg = upSetFileList(params.data.lawFirmSurveyImg)
                    params.data.intermediarySurveyImg = upSetFileList(params.data.intermediarySurveyImg)
                    params.data.agreementImg = upSetFileList(params.data.agreementImg)
                    params.data.otherFile = upSetFileList(params.data.otherFile)
                    if (bool) {
                        this.$refs[formname].validate((valid) => {
                            if (valid) {
                                if (this.projectId !== -1) {
                                    saveExamineUpdate(params).then(res => {
                                        this.$emit('opencloseloading', 0)
                                        if (res.code.toString() === '0') {
                                            this.handleReqSucc(res)
                                            // 切换标签页
                                            this.$emit('nextpage', 'projectDist')
                                        } else {
                                            this.$message.error(res.msg)
                                        }
                                    }).catch(() => {
                                        this.$emit('opencloseloading', 0)
                                    })
                                } else {
                                    saveExamine(params).then(res => {
                                        this.$emit('opencloseloading', 0)
                                        if (res.code.toString() === '0') {
                                            this.handleReqSucc(res)
                                            // 切换标签页
                                            this.$emit('nextpage', 'projectDist')
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
                                        saveExamineUpdate(params).then(res => {
                                            this.$emit('opencloseloading', 0)
                                            if (res.code.toString() === '0') {
                                                this.handleReqSucc(res)
                                                // 切换标签页
                                                this.$emit('prepage', 'projectMaterial')
                                            } else {
                                                this.$message.error(res.msg)
                                            }
                                        }).catch(() => {
                                            this.$emit('opencloseloading', 0)
                                        })
                                    } else {
                                        saveExamine(params).then(res => {
                                            this.$emit('opencloseloading', 0)
                                            if (res.code.toString() === '0') {
                                                this.handleReqSucc(res)
                                                // 切换标签页
                                                this.$emit('prepage', 'projectMaterial')
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
                                tempExamineUpdate(params).then(res => {
                                    this.$emit('opencloseloading', 0)
                                    if (res.code.toString() === '0') {
                                        this.handleReqSucc(res)
                                        this.$message.success('草稿已保存')
                                        if (direction === 'pre') {
                                            // 切换标签页
                                            this.$emit('prepage', 'projectMaterial')
                                        }
                                    } else {
                                        this.$message.error(res.msg)
                                    }
                                }).catch(() => {
                                    this.$emit('opencloseloading', 0)
                                })
                            } else {
                                tempExamine(params).then(res => {
                                    this.$emit('opencloseloading', 0)
                                    if (res.code.toString() === '0') {
                                        this.handleReqSucc(res)
                                        this.$message.success('草稿已保存')
                                        if (direction === 'pre') {
                                            // 切换标签页
                                            this.$emit('prepage', 'projectMaterial')
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
             *  上传成功处理
             *  @param data 上传文件id
             *  @param name 组件对应name
             */
            saveImgSucc (data, name) {
                this.projectExamine[name].push(data)
                this.$refs.projectExamine.validateField(name)
            },
            /**
             *  删除文件
             *  @param data 上传文件id
             *  @param name 组件对应name
             */
            removeFile (data, name) {
                this.deluploading(data)
                let id = getFileId(data)
                for (let i = 0; i < this.projectExamine[name].length; i++) {
                    if (this.projectExamine[name][i].fileId === id || this.projectExamine[name][i].uid === id) {
                        this.projectExamine[name].splice(i, 1)
                        break
                    }
                }
            },
            /**
             *  删除上传中文件后清除上传列表中的uid
             */
            deluploading (data) {
                if (data.status === 'uploading' || data.status === 'ready') {
                    this.cantsubmit({
                        state: false,
                        uid: data.uid
                    })
                }
            },
            /**
             *  有文件上传能否保存
             *  @param data 参数，是否正在上传，uid
             */
            cantsubmit (data) {
                if (data.state) {
                    this.cantsub = true
                    if (this.uploadfilelist.indexOf(data.uid) === -1) {
                        this.uploadfilelist.push(data.uid)
                        this.$emit('uploadingimg', 1)
                    }
                } else {
                    this.cantsub = false
                    this.uploadfilelist.splice(this.uploadfilelist.indexOf(data.uid), 1)
                    if (this.uploadfilelist.length === 0) {
                        this.$emit('uploadingimg', 0)
                    }
                }
            }
        },
        components: {
            Tinymce,
            uploadFile
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

    .usdt-text {
        position: absolute;
        top: 4px;
        margin-left: 5px;
        font-size: 16px;
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

    .telareacode {
        width: 140px;
        height: 40px;
        background: #fff;
        border: 1px solid #DCDFE6;
        border-left: 0;
        box-sizing: border-box;
    }

    .product-type {
        width: 235px;
        height: 40px;
        background: #fff;
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
</style>

