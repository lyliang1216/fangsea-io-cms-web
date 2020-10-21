<template>
    <div>
        <el-form ref="projectIssuer" :rules="projectIssuerrules" :model="projectIssuer" label-width="110px">
            <el-form-item label="选择语言：">
                <el-select v-model="languagevalue" @change="selectlanguage" filterable>
                    <el-option value="zh_CN" label="简体中文"></el-option>
                    <el-option value="zh_TW" label="繁體中文"></el-option>
                    <el-option value="en_US" label="English"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="发行人：">
                <el-radio v-model="projectIssuer.type" :label="0">公司</el-radio>
                <el-radio v-model="projectIssuer.type" disabled :label="1">个人</el-radio>
            </el-form-item>
            <el-form-item label="公司名称：" prop="issuerName">
                <el-input v-model="projectIssuer.issuerName" placeholder="请填写公司名称"
                          @keyup.native="keyuplong('issuerName', 500)"></el-input>
            </el-form-item>
            <el-form-item label="法人姓氏：" prop="legalPersonSurname">
                <el-input v-model="projectIssuer.legalPersonSurname" placeholder="请填写法人姓氏"
                          @keyup.native="keyuplong('legalPersonSurname', 50)"></el-input>
            </el-form-item>
            <el-form-item label="法人名字：" prop="legalPersonName">
                <el-input v-model="projectIssuer.legalPersonName" placeholder="请填写法人名字"
                          @keyup.native="keyuplong('legalPersonName', 50)"></el-input>
            </el-form-item>
            <el-form-item label="负责人姓氏：" prop="chargePersonSurname">
                <el-input v-model="projectIssuer.chargePersonSurname" placeholder="请填写负责人姓氏"
                          @keyup.native="keyuplong('chargePersonSurname', 50)"></el-input>
            </el-form-item>
            <el-form-item label="负责人名字：" prop="chargePersonName">
                <el-input v-model="projectIssuer.chargePersonName" placeholder="请填写负责人名字"
                          @keyup.native="keyuplong('chargePersonName', 50)"></el-input>
            </el-form-item>
            <el-form-item label="营业执照：" prop="licenseImg">
                <upload-file
                    :accept="'.jpg, .png, .pdf'"
                    :fileList="projectIssuer.licenseImg"
                    :limit="5"
                    @inUploading="cantsubmit"
                    @uploadSuccess="savelicenseImg"
                    @removeFile="removelicenseImg">
                </upload-file>
            </el-form-item>
            <el-form-item label="联系电话：" prop="tel">
                <el-input placeholder="请填写联系电话"
                          v-model="projectIssuer.tel" class="input-with-select">
                    <el-select class="telareacode" v-model="projectIssuer.telAreaCode" slot="prepend"
                               @change="changeareacode" placeholder="请选择" clearable filterable>
                        <el-option
                            v-for="item in areaCodelist"
                            :key="item.regionId"
                            :label="`+${item.areaCode} ${item.localName}`"
                            :value="item.areaCode">
                        </el-option>
                    </el-select>
                </el-input>
            </el-form-item>
            <el-form-item label="联系邮箱：" prop="email">
                <el-input v-model="projectIssuer.email" placeholder="请填写联系邮箱"></el-input>
            </el-form-item>
            <el-form-item label="公司地址：" prop="address">
                <el-input
                    rows="3"
                    type="textarea"
                    @keyup.native="keyuplong('address', 500)"
                    v-model="projectIssuer.address"
                    placeholder="请填写公司地址"
                    maxlength="500"
                    show-word-limit>
                </el-input>
            </el-form-item>
            <div class="bottom-btn-box">
                <el-button v-if="issueState===0" size="small" @click="nextpage2('projectIssuer', false)">暂&emsp;存
                </el-button>
                <el-button size="small" type="primary" @click="nextpage2('projectIssuer', false, 'pre')">上一步
                </el-button>
                <el-button size="small" type="primary" @click="nextpage2('projectIssuer', true, 'next')">下一步
                </el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
    import {saveIssuer, tempIssuer, saveIssuerUpdate, tempIssuerUpdate, getIssuer, getAreacode} from '@/api/pass-issued/new-release'
    import {getFileId, resetFileList, upSetFileList} from '@/utils/filters'
    import uploadFile from '@/components/Upload'

    // 发行人资料
    export default {
        name: 'index',
        props: {
            projectIdf: {
                type: Number
            },
            languagevaluef: {
                type: String
            },
            issueState: {
                type: Number
            },
            payState: {
                type: Number
            }
        },
        data () {
            const checkareacode = (rule, value, callback) => {
                if (this.projectIssuer.tel === '') {
                    return callback(new Error('请填写联系电话'))
                } else if (!(/^[0-9]+$/.test(this.projectIssuer.tel))) {
                    return callback(new Error('请输入正确格式'))
                } else if (this.projectIssuer.telAreaCode === '') {
                    return callback(new Error('请选择区号'))
                } else {
                    return callback()
                }
            }
            return {
                // 项目id
                projectId: -1,
                // 页面id
                examineId: '',
                // 当前语言
                nowlanguage: 'zh_CN',
                // 语言
                languagevalue: 'zh_CN',
                /**
                 * 发行方资料
                 */
                projectIssuer: {
                    // 发行人类型
                    type: 0,
                    // 发行人名称
                    issuerName: '',
                    // 法人姓氏
                    legalPersonSurname: '',
                    // 法人名称
                    legalPersonName: '',
                    // 负责人姓氏
                    chargePersonSurname: '',
                    // 负责人名称
                    chargePersonName: '',
                    // 联系电话
                    tel: '',
                    // 区号
                    telAreaCode: '',
                    // 联系邮箱
                    email: '',
                    // 地址
                    address: '',
                    // 营业执照
                    licenseImg: []
                },
                // 是否获取过信息，初始化，校验表单是否修改
                getinfo: false,
                // 文件是否未上传完成
                cantsub: false,
                // 上传中的文件
                uploadfilelist: [],
                // 区号列表
                areaCodelist: [],
                // 表单验证
                projectIssuerrules: {
                    issuerName: [
                        {required: true, message: '请填写公司名称', trigger: 'blur'}
                    ],
                    legalPersonSurname: [
                        {required: true, message: '请填写法人姓氏', trigger: 'blur'}
                    ],
                    legalPersonName: [
                        {required: true, message: '请填写法人名字', trigger: 'blur'}
                    ],
                    chargePersonSurname: [
                        {required: true, message: '请填写负责人姓氏', trigger: 'blur'}
                    ],
                    chargePersonName: [
                        {required: true, message: '请填写负责人名字', trigger: 'blur'}
                    ],
                    licenseImg: [
                        {required: true, message: '请上传图片'}
                    ],
                    tel: [
                        {required: true, validator: checkareacode, trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '请输入邮箱地址', trigger: 'blur'},
                        {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
                    ],
                    address: [
                        {required: true, message: '请填写公司地址', trigger: 'blur'}
                    ]
                }
            }
        },
        mounted () {
            // 父组件保存的离开时语言状态
            this.nowlanguage = this.languagevaluef
            this.languagevalue = this.languagevaluef
            if (this.projectIdf) {
                this.projectId = this.projectIdf
            }
            // 获取区号
            this.getareacode()
            // 获取发行人资料
            this.getIssuerinfo()
        },
        watch: {
            projectIssuer: {
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
             *  获取区号
             */
            getareacode () {
                let params = {
                    traceId: Math.random().toString(36).substr(2)
                }
                getAreacode(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.areaCodelist = res.data
                    } else {
                        this.$message.error(res.msg)
                    }
                }).catch(() => {
                })
            },
            /**
             *  获取发行人资料
             */
            getIssuerinfo () {
                // 判断是否为第一次新增
                if (this.projectId !== -1) {
                    let params = {
                        traceId: Math.random().toString(36).substr(2),
                        locale: this.languagevalue,
                        data: {
                            projectId: this.projectId
                        }
                    }
                    getIssuer(params).then(res => {
                        if (res.code.toString() === '0') {
                            this.getinfo = true
                            if (res.data) {
                                for (let key in this.projectIssuer) {
                                    if (res.data[key] || res.data[key] === 0) {
                                        this.projectIssuer[key] = res.data[key]
                                    }
                                }
                                this.projectIssuer.licenseImg = resetFileList(this.projectIssuer.licenseImg)
                            }
                        } else {
                            this.$message.error(res.msg)
                        }
                    }).catch(() => {
                    })
                }
            },
            /**
             *  发行人资料 暂存/上一步/下一步/保存事件
             *  @param formname 表单名称
             *  @param bool 是否校验格式
             *  @param direction pre上一步，next下一步
             *  @param value 切换语言时语言内容
             */
            nextpage2 (formname, bool, direction, value) {
                this.$emit('opencloseloading', 1)
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    locale: this.nowlanguage,
                    data: JSON.parse(JSON.stringify(this.projectIssuer))
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
                    params.data.licenseImg = upSetFileList(params.data.licenseImg)
                    this.uploadfilelist = []
                    this.$emit('uploadingimg', 0)
                    if (bool) {
                        this.$refs[formname].validate((valid) => {
                            if (valid) {
                                if (this.projectId !== -1) {
                                    saveIssuerUpdate(params).then(res => {
                                        this.$emit('opencloseloading', 0)
                                        if (res.code.toString() === '0') {
                                            this.handleReqSucc(res)
                                            if (value) {
                                                this.handleValue(value)
                                            } else {
                                                // 切换标签页
                                                this.$emit('nextpage', 'projectMaterial')
                                            }
                                        } else {
                                            this.$message.error(res.msg)
                                        }
                                    }).catch(() => {
                                        this.$emit('opencloseloading', 0)
                                    })
                                } else {
                                    saveIssuer(params).then(res => {
                                        this.$emit('opencloseloading', 0)
                                        if (res.code.toString() === '0') {
                                            this.handleReqSucc(res)
                                            if (value) {
                                                this.handleValue(value)
                                            } else {
                                                // 切换标签页
                                                this.$emit('nextpage', 'projectMaterial')
                                            }
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
                                        saveIssuerUpdate(params).then(res => {
                                            this.$emit('opencloseloading', 0)
                                            if (res.code.toString() === '0') {
                                                this.handleReqSucc(res)
                                                if (value) {
                                                    this.handleValue(value)
                                                } else {
                                                    // 切换标签页
                                                    this.$emit('prepage', 'projectBase')
                                                }
                                            } else {
                                                this.$message.error(res.msg)
                                            }
                                        }).catch(() => {
                                            this.$emit('opencloseloading', 0)
                                        })
                                    } else {
                                        saveIssuer(params).then(res => {
                                            this.$emit('opencloseloading', 0)
                                            if (res.code.toString() === '0') {
                                                this.handleReqSucc(res)
                                                if (value) {
                                                    this.handleValue(value)
                                                } else {
                                                    // 切换标签页
                                                    this.$emit('prepage', 'projectBase')
                                                }
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
                                tempIssuerUpdate(params).then(res => {
                                    this.$emit('opencloseloading', 0)
                                    if (res.code.toString() === '0') {
                                        this.handleReqSucc(res)
                                        this.$message.success('草稿已保存')
                                        if (value) {
                                            this.handleValue(value)
                                        }
                                        if (direction === 'pre') {
                                            // 切换标签页
                                            this.$emit('prepage', 'projectBase')
                                        }
                                    } else {
                                        this.$message.error(res.msg)
                                    }
                                }).catch(() => {
                                    this.$emit('opencloseloading', 0)
                                })
                            } else {
                                tempIssuer(params).then(res => {
                                    this.$emit('opencloseloading', 0)
                                    if (res.code.toString() === '0') {
                                        this.handleReqSucc(res)
                                        this.$message.success('草稿已保存')
                                        if (value) {
                                            this.handleValue(value)
                                        }
                                        if (direction === 'pre') {
                                            // 切换标签页
                                            this.$emit('prepage', 'projectBase')
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
             *  处理切换语言时语言内容
             * @param value 切换语言时语言内容
             */
            handleValue (value) {
                // 请求前为旧值，成功后改为新值
                this.nowlanguage = value
                this.languagevalue = value
                this.$emit('checklanguagevalue2', value)
                this.getIssuerinfo()
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
             *  营业执照上传成功
             *  @param data 上传文件id
             */
            savelicenseImg (data) {
                this.projectIssuer.licenseImg.push(data)
                this.$refs.projectIssuer.validateField('licenseImg')
            },
            /**
             *  删除文件
             *  @param data 要删除的文件
             */
            removelicenseImg (data) {
                this.deluploading(data)
                let id = getFileId(data)
                for (let i = 0; i < this.projectIssuer.licenseImg.length; i++) {
                    if (this.projectIssuer.licenseImg[i].fileId === id || this.projectIssuer.licenseImg[i].uid === id) {
                        this.projectIssuer.licenseImg.splice(i, 1)
                        break
                    }
                }
            },
            /**
             *  选择语言
             */
            selectlanguage (value) {
                this.$router.push({
                    query: {
                        'projectId': this.projectId,
                        'issueState': this.issueState,
                        'payState': this.payState
                    }
                })
                // 选择后暂不切换，使用原来值，等暂存请求成功后切换value
                this.languagevalue = this.nowlanguage
                if (!this.cantsub) {
                    if (this.nowlanguage === 'zh_CN') {
                        this.$refs['projectIssuer'].validate((valid) => {
                            if (valid) {
                                if (this.issueState === 1) {
                                    this.nextpage2('projectIssuer', true, 'no', value)
                                } else {
                                    this.nextpage2('projectIssuer', false, 'no', value)
                                }
                            } else {
                                this.languagevalue = 'zh_CN'
                                this.$message.error('请先完成简体中文内容填写')
                            }
                        })
                    } else {
                        this.$refs['projectIssuer'].validate((valid) => {
                            if (valid) {
                                if (this.issueState === 1) {
                                    this.nextpage2('projectIssuer', true, 'no', value)
                                } else {
                                    this.nextpage2('projectIssuer', false, 'no', value)
                                }
                            }
                        })
                    }
                } else {
                    this.$message.warning('请等待文件上传完成')
                    this.$emit('opencloseloading', 0)
                }
            },
            /**
             *  选择区号后
             */
            changeareacode () {
                this.$refs.projectIssuer.validateField('tel')
            },
            /**
             *  限制输入框字符长度
             * @param name 参数名
             * @param num 长度
             */
            keyuplong (name, num) {
                if (this.projectIssuer[name].length > num) {
                    this.projectIssuer[name] = this.projectIssuer[name].substring(0, num)
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
                        this.uploadfilelist = []
                        this.$emit('uploadingimg', 0)
                    }
                }
            }
        },
        components: {
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
        border-right: 0;
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
