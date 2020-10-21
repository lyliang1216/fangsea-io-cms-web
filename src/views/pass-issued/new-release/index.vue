<template>
    <div class="app-container">
        <el-tabs v-model="tabs"
                 type="border-card"
                 tab-position="top"
                 :before-leave="beforeleave"
                 v-loading.fullscreen.lock="fullscreenLoading"
                 element-loading-background="rgba(0, 0, 0, 0.5)">
            <el-tab-pane label="基本资料" name="projectBase">
                <project-base
                    v-if="tabs==='projectBase'"
                    @nextpage="nextpage"
                    @prepage="prepage"
                    @tabschange="tabshavechange"
                    @opencloseloading="opencloseloading"
                    :projectIdf="projectId"
                    :issueState="issueState"
                    :payState="payState"
                    @returnproject="setproject">
                </project-base>
            </el-tab-pane>
            <el-tab-pane label="发行人资料" name="projectIssuer">
                <project-issuer
                    v-if="tabs==='projectIssuer'"
                    @nextpage="nextpage"
                    @prepage="prepage"
                    @tabschange="tabshavechange"
                    @opencloseloading="opencloseloading"
                    @uploadingimg="uploadingimg"
                    :projectIdf="projectId"
                    :issueState="issueState"
                    :payState="payState"
                    @returnproject="setproject"
                    @checklanguagevalue2="checklanguagevalue2"
                    :languagevaluef="languagevalue2">
                </project-issuer>
            </el-tab-pane>
            <el-tab-pane label="项目资料" name="projectMaterial">
                <project-material
                    v-if="tabs==='projectMaterial'"
                    @nextpage="nextpage"
                    @prepage="prepage"
                    @tabschange="tabshavechange"
                    @opencloseloading="opencloseloading"
                    @uploadingimg="uploadingimg"
                    :projectIdf="projectId"
                    :issueState="issueState"
                    :payState="payState"
                    @returnproject="setproject"
                    :languagevaluef="languagevalue3"
                    @checklanguagevalue3="checklanguagevalue3">
                </project-material>
            </el-tab-pane>
            <el-tab-pane label="发行资料" name="projectExamine">
                <project-examine
                    v-if="tabs==='projectExamine'"
                    @nextpage="nextpage"
                    @prepage="prepage"
                    @tabschange="tabshavechange"
                    @opencloseloading="opencloseloading"
                    @uploadingimg="uploadingimg"
                    :projectIdf="projectId"
                    :issueState="issueState"
                    :payState="payState"
                    @returnproject="setproject">
                </project-examine>
            </el-tab-pane>
            <el-tab-pane label="发行内容" name="projectDist">
                <project-dist
                    v-if="tabs==='projectDist'"
                    @nextpage="nextpage"
                    @prepage="prepage"
                    @tabschange="tabshavechange"
                    @opencloseloading="opencloseloading"
                    :projectIdf="projectId"
                    :issueState="issueState"
                    :payState="payState"
                    @returnproject="setproject">
                </project-dist>
            </el-tab-pane>
            <el-tab-pane label="发行设置" name="projectDistSetting">
                <project-dist-setting
                    v-if="tabs==='projectDistSetting'"
                    @nextpage="nextpage"
                    @prepage="prepage"
                    @tabschange="tabshavechange"
                    @opencloseloading="opencloseloading"
                    :projectIdf="projectId"
                    :issueState="issueState"
                    :payState="payState"
                    @returnproject="setproject"
                    @submitall="getglobalization">
                </project-dist-setting>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import projectDistSetting from '@/views/pass-issued/new-release/components/project-dist-setting'
    import projectMaterial from '@/views/pass-issued/new-release/components/project-material'
    import projectExamine from '@/views/pass-issued/new-release/components/project-examine'
    import projectIssuer from '@/views/pass-issued/new-release/components/project-issuer'
    import projectBase from '@/views/pass-issued/new-release/components/project-base'
    import projectDist from '@/views/pass-issued/new-release/components/project-dist'
    import axios from 'axios'

    import {
        getAllproject,
        saveReleaseall,
        getIssuer,
        getMaterial,
        saveMaterial,
        saveIssuer
    } from '@/api/pass-issued/new-release'
    import {judgingempty} from '@/utils/validate'

    export default {
        name: 'index',
        data () {
            return {
                // 项目id
                projectId: -1,
                // 0创建、1未发行、2等待预售、3开始预售、4预售完成、5预售失败、6已发行、7已取消
                issueState: 0,
                // 支付状态，0未支付，1已支付
                payState: 0,
                // 当前标签页
                tabs: '',
                // 页面是否修改过
                tabschange: false,
                // 加载中覆盖
                fullscreenLoading: false,
                // 有文件正在上传
                isuploading: false,
                // 所有表单
                allformcontent: {},
                // 基本信息
                projectBase: {},
                // 发行方资料
                projectIssuer: {},
                // 项目资料
                projectMaterial: {},
                // 发行资料
                projectExamine: {},
                // 发行内容
                projectDist: {},
                // 发行设置
                projectDistSetting: {},
                // 需校验字段
                checkformtxt: {
                    // 基本资料
                    projectBase: ['country', 'projectType', 'projectNature'],
                    // 发行人资料
                    projectIssuer: ['issuerName', 'legalPersonSurname', 'legalPersonName', 'chargePersonSurname',
                        'chargePersonName', 'tel', 'telAreaCode', 'email', 'address', 'licenseImg'],
                    // 项目资料
                    projectMaterial: ['name', 'measure', 'imgs', 'address', 'completionDate', 'propertyRight', 'description'],
                    // 发行资料
                    projectExamine: ['intermediaryCurId', 'intermediaryCurCode', 'intermediaryPrice'],
                    // 发行内容
                    projectDist: ['ptCurId', 'ptCurCode', 'curId', 'curCode', 'priceCurId', 'priceCurCode',
                        'totalPrice', 'planMinTime', 'planMaxTime', 'planStartTime', 'planEndTime']
                },
                // 发行人资料繁体
                projectIssuer_tw: {},
                // 发行人资料英文
                projectIssuer_en: {},
                // 项目资料繁体
                projectMaterial_tw: {},
                // 项目资料英文
                projectMaterial_en: {},
                // 发行人资料语言状态
                languagevalue2: 'zh_CN',
                // 发行内容语言状态
                languagevalue3: 'zh_CN'
            }
        },
        created () {
            if (JSON.stringify(this.$route.query) === '{}') {
                this.$route.query.projectId = -1
                this.$route.query.issueState = 0
                this.$route.query.payState = 0
            }
        },
        mounted () {
            if (this.$route.query.projectId) {
                this.projectId = Number(this.$route.query.projectId)
            } else {
                this.$router.push({path: '/passissued/releaselist'})
            }
            if (this.$route.query.issueState) {
                this.issueState = Number(this.$route.query.issueState)
            }
            if (this.$route.query.payState) {
                this.payState = Number(this.$route.query.payState)
            }
            this.tabs = 'projectBase'
        },
        methods: {
            /**
             *  开启关闭加载遮罩
             */
            opencloseloading (s) {
                s ? this.fullscreenLoading = true : this.fullscreenLoading = false
            },
            /**
             *  设置项目id
             *  @param id 子组件中获取到的项目id
             */
            setproject (id) {
                this.projectId = Number(id)
                this.$route.query.projectId = Number(id)
                this.$route.query.issueState = this.issueState
                this.$route.query.payState = this.payState
            },
            // 下一页
            nextpage (index) {
                this.tabs = index
            },
            // 上一页
            prepage (index) {
                this.tabs = index
            },
            // 页面是否被修改 0否1是
            tabshavechange (data) {
                data === 0 ? this.tabschange = false : this.tabschange = true
            },
            /**
             *  有图片正在上传
             */
            uploadingimg (data) {
                data === 1 ? this.isuploading = true : this.isuploading = false
            },
            /**
             *  切换标签页前触发
             *  @param activeName 选中的标签页name
             *  @param oldActiveName 现在的标签页name
             */
            beforeleave (activeName, oldActiveName) {
                if (this.tabschange || this.isuploading) {
                    let _this = this
                    let flag = new Promise((resolve, reject) => {
                        this.$confirm('当前页面还未保存，是否离开？', '确认信息', {
                            distinguishCancelAndClose: true,
                            confirmButtonText: '离开',
                            cancelButtonText: '留下',
                            type: 'warning'
                        })
                            .then(() => {
                                _this.tabschange = false
                                _this.isuploading = false
                                resolve()
                            })
                            .catch((action, err) => {
                                if (action === 'cancel') {
                                    reject(err)
                                } else {
                                    reject(err)
                                }
                            })
                    })
                    return flag
                }
            },
            /**
             *  提交全部
             */
            submitall (data) {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        projectId: this.projectId
                    }
                }
                getAllproject(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.allformcontent = res.data
                        this.projectBase = this.allformcontent.projectBase
                        this.projectIssuer = this.allformcontent.projectIssuer
                        this.projectMaterial = this.allformcontent.projectMaterial
                        this.projectExamine = this.allformcontent.projectExamine
                        this.projectDist = this.allformcontent.projectDist
                        this.projectDistSetting = data.data
                        this.projectBase.projectId = this.projectId
                        if (this.validateallform()) {
                            this.projectDist.planStartTime = this.getZoneTime(this.projectDist.planStartTime)
                            this.projectDist.planEndTime = this.getZoneTime(this.projectDist.planEndTime)
                            let params = {
                                traceId: Math.random().toString(36).substr(2),
                                data: {
                                    projectBase: this.projectBase,
                                    projectIssuer: this.projectIssuer,
                                    projectMaterial: this.projectMaterial,
                                    projectExamine: this.projectExamine,
                                    projectDist: this.projectDist,
                                    projectDistSetting: this.projectDistSetting
                                }
                            }
                            saveReleaseall(params).then(res => {
                                this.fullscreenLoading = false
                                if (res.code.toString() === '0') {
                                    this.$message.success('保存成功')
                                    this.$router.push({path: '/passissued/releaselist'})
                                } else {
                                    this.$message.error(res.msg)
                                }
                            }).catch(err => {
                                this.fullscreenLoading = false
                                this.$message.error(err.msg)
                            })
                        }
                    } else {
                        this.fullscreenLoading = false
                        this.$message.error(res.msg)
                    }
                }).catch(() => {
                    this.fullscreenLoading = false
                })
            },
            /**
             *  验证所有表单数据
             */
            validateallform () {
                return this.checkprojectBase()
            },
            checkprojectBase () {
                let flag = true
                if (this.projectBase) {
                    for (let key in this.projectBase) {
                        if (!judgingempty(this.projectBase[key])) {
                            if (this.checkformtxt.projectBase.indexOf(key) !== -1) {
                                flag = false
                                this.validateallformerror('projectBase')
                                break
                            }
                        }
                    }
                } else {
                    flag = false
                    this.validateallformerror('projectBase')
                }
                return flag ? this.checkprojectIssuer() : false
            },
            checkprojectIssuer () {
                let flag = true
                if (this.projectIssuer) {
                    for (let key in this.projectIssuer) {
                        if (!judgingempty(this.projectIssuer[key])) {
                            if (this.checkformtxt.projectIssuer.indexOf(key) !== -1) {
                                flag = false
                                this.validateallformerror('projectIssuer')
                                break
                            }
                        }
                    }
                } else {
                    flag = false
                    this.validateallformerror('projectIssuer')
                }
                return flag ? this.checkprojectMaterial() : false
            },
            checkprojectMaterial () {
                let flag = true
                if (this.projectMaterial) {
                    for (let key in this.projectMaterial) {
                        if (!judgingempty(this.projectMaterial[key])) {
                            if (this.checkformtxt.projectMaterial.indexOf(key) !== -1) {
                                flag = false
                                this.validateallformerror('projectMaterial')
                                break
                            }
                        } else if (key === 'video' || key === 'videoImg') {
                            if (this.projectMaterial.video.length === 1 && this.projectMaterial.videoImg.length === 0) {
                                flag = false
                                this.fullscreenLoading = false
                                this.$message.error('请上传视频封面图片')
                                this.tabschange = false
                                this.tabs = 'projectMaterial'
                                break
                            } else if (this.projectMaterial.video.length === 0 && this.projectMaterial.videoImg.length === 1) {
                                flag = false
                                this.fullscreenLoading = false
                                this.$message.error('请上传视频')
                                this.tabschange = false
                                this.tabs = 'projectMaterial'
                                break
                            }
                        }
                    }
                } else {
                    flag = false
                    this.validateallformerror('projectIssuer')
                }
                return flag ? this.checkprojectExamine() : false
            },
            checkprojectExamine () {
                let flag = true
                if (this.projectExamine) {
                    for (let key in this.projectExamine) {
                        if (!judgingempty(this.projectExamine[key])) {
                            if (this.checkformtxt.projectExamine.indexOf(key) !== -1) {
                                flag = false
                                this.validateallformerror('projectExamine')
                                break
                            }
                        }
                    }
                } else {
                    flag = false
                    this.validateallformerror('projectMaterial')
                }
                return flag ? this.checkprojectDist() : false
            },
            checkprojectDist () {
                let flag = true
                if (this.projectDist) {
                    for (let key in this.projectDist) {
                        if (!judgingempty(this.projectDist[key])) {
                            if (this.checkformtxt.projectDist.indexOf(key) !== -1) {
                                flag = false
                                this.validateallformerror('projectDist')
                                break
                            }
                        }
                    }
                } else {
                    flag = false
                    this.validateallformerror('projectDist')
                }
                return flag
            },
            /**
             *  数据校验失败后
             *  @param tabs 要跳转的页面
             */
            validateallformerror (tabs) {
                this.fullscreenLoading = false
                this.$message.error('请填写正确的参数')
                this.tabschange = false
                this.tabs = tabs
            },
            /**
             *  获取保存国际化内容
             */
            getglobalization (data) {
                let allrequest = [this.getProjectIssuerTW(), this.getProjectIssuerEN(), this.getProjectMaterialTW(), this.getProjectMaterialEN()]
                let _this = this
                axios.all(allrequest).then(axios.spread((res1, res2, res3, res4) => {
                    if (res1.code.toString() === '0') {
                        if (res1.data) {
                            _this.projectIssuer_tw = res1.data
                        } else {
                            this.fullscreenLoading = false
                            this.validateallformerror('projectIssuer')
                        }
                    }
                    if (res2.code.toString() === '0') {
                        if (res2.data) {
                            _this.projectIssuer_en = res2.data
                        } else {
                            this.fullscreenLoading = false
                            this.validateallformerror('projectIssuer')
                        }
                    }
                    if (res3.code.toString() === '0') {
                        if (res3.data) {
                            _this.projectMaterial_tw = res3.data
                        } else {
                            this.fullscreenLoading = false
                            this.validateallformerror('projectMaterial')
                        }
                    }
                    if (res4.code.toString() === '0') {
                        if (res4.data) {
                            _this.projectMaterial_en = res4.data
                        } else {
                            this.fullscreenLoading = false
                            this.validateallformerror('projectMaterial')
                        }
                    }
                    let allrequest2 = [_this.saveProjectIssuerTW(), _this.saveProjectIssuerEN(), _this.saveProjectMaterialTW(), _this.saveProjectMaterialEN()]
                    axios.all(allrequest2).then(axios.spread((res5, res6, res7, res8) => {
                        if (res5.code.toString() === '0' && res6.code.toString() === '0' && res7.code.toString() === '0' && res8.code.toString() === '0') {
                            // 保存主数据
                            _this.submitall(data)
                        } else if (res5.code.toString() !== '0') {
                            _this.fullscreenLoading = false
                            _this.$message.error(res5.msg)
                        } else if (res6.code.toString() !== '0') {
                            _this.fullscreenLoading = false
                            _this.$message.error(res6.msg)
                        } else if (res7.code.toString() !== '0') {
                            _this.fullscreenLoading = false
                            _this.$message.error(res7.msg)
                        } else if (res8.code.toString() !== '0') {
                            _this.fullscreenLoading = false
                            _this.$message.error(res8.msg)
                        }
                    })).catch(() => {
                        _this.fullscreenLoading = false
                    })
                }))
            },
            /**
             *  获取发行人繁体
             */
            getProjectIssuerTW () {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    locale: 'zh_TW',
                    data: {
                        projectId: this.projectId
                    }
                }
                return getIssuer(params)
            },
            /**
             *  获取发行人英语
             */
            getProjectIssuerEN () {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    locale: 'en_US',
                    data: {
                        projectId: this.projectId
                    }
                }
                return getIssuer(params)
            },
            /**
             *  获取项目繁体
             */
            getProjectMaterialTW () {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    locale: 'zh_TW',
                    data: {
                        projectId: this.projectId
                    }
                }
                return getMaterial(params)
            },
            /**
             *  获取项目英语
             */
            getProjectMaterialEN () {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    locale: 'en_US',
                    data: {
                        projectId: this.projectId
                    }
                }
                return getMaterial(params)
            },
            /**
             *  提交发行人繁体
             */
            saveProjectIssuerTW () {
                this.projectIssuer.projectId = this.projectId
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    locale: 'zh_TW',
                    data: this.projectIssuer_tw
                }
                this.projectIssuer_tw.projectId = this.projectId
                return saveIssuer(params)
            },
            /**
             *  提交发行人英语
             */
            saveProjectIssuerEN () {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    locale: 'en_US',
                    data: this.projectIssuer_en
                }
                this.projectIssuer_en.projectId = this.projectId
                return saveIssuer(params)
            },
            /**
             *  提交项目繁体
             */
            saveProjectMaterialTW () {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    locale: 'zh_TW',
                    data: this.projectMaterial_tw
                }
                this.projectMaterial_tw.projectId = this.projectId
                return saveMaterial(params)
            },
            /**
             *  提交项目英语
             */
            saveProjectMaterialEN () {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    locale: 'en_US',
                    data: this.projectMaterial_en
                }
                this.projectMaterial_en.projectId = this.projectId
                return saveMaterial(params)
            },
            /**
             *  发行人资料页面离开时的语言状态
             *  @param data
             */
            checklanguagevalue2 (data) {
                this.languagevalue2 = data
            },
            /**
             *  项目资料页面离开时的语言状态
             *  @param data
             */
            checklanguagevalue3 (data) {
                this.languagevalue3 = data
            }
        },
        components: {
            projectBase,
            projectIssuer,
            projectMaterial,
            projectExamine,
            projectDist,
            projectDistSetting
        }
    }
</script>
