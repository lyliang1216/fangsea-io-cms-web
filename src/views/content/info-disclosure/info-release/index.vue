<template>
    <div class="app-container">
        <el-tabs v-model="activeName" type="card" :before-leave="beforeleave">
            <el-tab-pane name="zh_CN" v-if="hasLocales.includes('zh_CN')">
                <span slot="label"><i class="el-icon-circle-check"></i>简体中文</span>
            </el-tab-pane>
            <el-tab-pane name="zh_CN" label="简体中文" v-else></el-tab-pane>
            <el-tab-pane name="zh_TW" v-if="hasLocales.includes('zh_TW')">
                <span slot="label"><i class="el-icon-circle-check"></i>繁体中文</span>
            </el-tab-pane>
            <el-tab-pane name="zh_TW" label="繁体中文" v-else></el-tab-pane>
            <el-tab-pane name="en_US" v-if="hasLocales.includes('en_US')">
                <span slot="label"><i class="el-icon-circle-check"></i>English</span>
            </el-tab-pane>
            <el-tab-pane name="en_US" label="English" v-else></el-tab-pane>
        </el-tabs>
        <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="article-form">
            <el-form-item label="分类号" prop="categoryNum">
                <el-input v-model="form.categoryNum" size="small" placeholder="请输入分类号"></el-input>
            </el-form-item>
            <el-form-item label="所属类别" prop="categoryId">
                <el-select class="category-input" v-model="form.categoryId" clearable filterable size="small" @change="checkCategory"
                           placeholder="请选择所属类别">
                    <el-option
                        v-for="item in categoryList"
                        :key="item.id"
                        :label="item.categoryName"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="关联项目(PT)" prop="projectIdList">
                <el-select class="associated-project" v-model="form.projectIdList" ref="projectIdList" multiple clearable filterable size="small" placeholder="请选择关联项目(PT)">
                    <el-option
                        v-for="item in ptProjectList"
                        :key="item.projectId"
                        :label="item.ptCurCode"
                        :value="item.projectId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="标题" prop="title">
                <el-input v-model="form.title" size="small" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="正文" prop="content">
                <div class="tinymce-box">
                    <div class="tinymce">
                        <tinymce ref="editerZh" v-model="form.content" :height="300"/>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="附件">
                <div class="file-upload-checkbox">
                    <upload-file
                        :drag="true"
                        :noPrompt="true"
                        :accept="'*'"
                        :fileList="comparisonForm.allFileList"
                        @inUploading="canSubmit"
                        @uploadSuccess="fileSuccess"
                        @removeFile="fileRemove">
                    </upload-file>
                    <span class="attachment-label" v-if="allFileList.length > 0">游客访问</span>
                    <div class="upload-check-box">
                        <el-checkbox-group v-model="checkList">
                            <el-checkbox v-for="item in allFileList"
                                         :label="item.fileId"
                                         :key="item.fileId"
                            ></el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="预约发布" prop="appointmentTime">
                <el-date-picker
                    popper-class="appointment-time"
                    v-model="form.appointmentTime"
                    size="small"
                    type="datetime"
                    align="right"
                    placeholder="选择时间"
                    format="yyyy-MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm:00"
                    :picker-options="pickerOptions">
                </el-date-picker>
            </el-form-item>
            <div class="btn">
                <el-checkbox v-model="toNext" v-if="hasLocales.length < 2">切换语言，多语言发布</el-checkbox>
                <el-button type="primary" size="small" @click="previewContent">预 览</el-button>
                <el-button size="small" @click="checkProject">发 布</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
    import {getTree, getArticle, saveArticle, updateArticle, getProject} from '@/api/content/info-release'
    import {getZoneTimeTamp} from '@/utils/filters'
    import uploadFile from '@/components/Upload'
    import Tinymce from '@/components/Tinymce'

    export default {
        data () {
            const infoContent = (rule, value, callback) => {
                if (this.form.content === '') {
                    return callback(new Error('请填写正文'))
                } else {
                    return callback()
                }
            }
            return {
                // 当前语言
                activeName: 'zh_CN',
                // 语言列表
                locales: ['zh_CN', 'zh_TW', 'en_US'],
                hasLocales: [],
                // 类别列表
                categoryList: [],
                // 类别列表简体翻译英语
                category: {
                    zh_CN: [],
                    zh_TW: [],
                    en_US: []
                },
                // 关联项目列表
                ptProjectList: [],
                // 所有上传文件
                allFileList: [],
                // 发布后是否跳转下一个未编辑语种
                toNext: true,
                // 正在上传的文件（判断是否能提交）
                uploadfilelist: [],
                // 是否能提交(true是能，false不能)
                flagSubmit: true,
                // 选中游客访问文件
                checkList: [],
                // 初始化数据，用于判断是否能离开页面
                defaultform: '',
                // 表单内容
                form: {
                    // 项目id
                    id: '',
                    // 分类号
                    categoryNum: '',
                    // 所属类别ID
                    categoryId: '',
                    // 所属类别名称
                    categoryName: '',
                    // 关联PT项目ID
                    projectIdList: [],
                    // 标题
                    title: '',
                    // 正文
                    content: '',
                    // 游客访问附件(字符串)
                    attachment: [],
                    // 需登录访问附件(字符串)
                    attachmentLogin: [],
                    // 预发布时间
                    appointmentTime: ''
                },
                // 比较表单内容
                comparisonForm: {
                    // 分类号
                    categoryNum: '',
                    // 所属类别ID
                    categoryId: '',
                    // 关联PT项目ID
                    projectIdList: [],
                    // 标题
                    title: '',
                    // 正文
                    content: '',
                    // 所有文件
                    allFileList: [],
                    // 预发布时间
                    appointmentTime: '',
                    // 选中的文件
                    checkList: []
                },
                rules: {
                    categoryNum: [
                        {required: false, max: 18, message: '最多可输入18个字符', trigger: 'blur'}
                    ],
                    categoryId: [
                        {required: true, message: '请选择所属类别', trigger: 'blur'}
                    ],
                    title: [
                        {required: true, max: 80, message: '请输入80个字符以内的披露信息标题', trigger: 'blur'}
                    ],
                    content: [
                        {required: true, validator: infoContent}
                    ]
                },
                pickerOptions: {
                    shortcuts: [{
                        text: '此刻',
                        onClick (picker) {
                            picker.$emit('pick', new Date(this.getZoneTime()))
                        }
                    }],
                    disabledDate: (time) => {
                        return time.getTime() < Date.now() - 24 * 3600 * 1000
                    }
                }
            }
        },
        mounted () {
            this.getCategory()
            this.getProjectList()
            this.getArticleForm()
        },
        methods: {
            /**
             * 初始化预约发布时间
             */
            setAppointmentTime () {
                this.form.appointmentTime = this.getZoneTime(parseInt(new Date(this.parseTime(parseInt(new Date() / 1000), '{y}/{m}/{d} {h}:{i}') + ':00') / 1000) + 7 * 24 * 3600)
                this.comparisonForm.appointmentTime = this.getZoneTime(parseInt(new Date(this.parseTime(parseInt(new Date() / 1000), '{y}/{m}/{d} {h}:{i}') + ':00') / 1000) + 7 * 24 * 3600)
            },
            /**
             * 获取类别列表
             */
            getCategory () {
                let params = {
                    traceId: Math.random().toString(36).substr(2)
                }
                getTree(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.category = {
                            zh_CN: res.data.zh_CN,
                            zh_TW: res.data.zh_TW,
                            en_US: res.data.en_US
                        }
                        this.categoryList = this.category.zh_CN
                    }
                })
            },
            /**
             * 获取项目PT列表
             */
            getProjectList () {
                let params = {
                    traceId: Math.random().toString(36).substr(2)
                }
                getProject(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.ptProjectList = res.data
                    }
                })
            },
            /**
             * 选择类别获取categoryName
             * @param value 选中的id
             */
            checkCategory (value) {
                let _this = this
                this.categoryList.find((item) => {
                    if (value === item.id) {
                        _this.form.categoryName = item.categoryName
                    }
                })
            },
            /**
             *  去除table外层div
             *  @param str 富文本字符串
             */
            removeDiv (str) {
                let introduce = str
                // 去除table外层div
                introduce = introduce.replace(new RegExp('<div data-onlytablewidth="840" style="max-width: 840px;overflow-x: auto;">', 'g'), '')
                introduce = introduce.replace(/<\/table><\/div>/g, '</table>')
                // 优化a标签字体蓝色
                introduce = introduce.replace(/<a style="color: #2ea9df" href=/g, '<a href=')
                // 优化图片路径
                introduce = introduce.replace(/src="\/public/g, 'src="public')
                this.form.content = introduce
                this.comparisonForm.content = introduce
                if (this.$refs['editerZh']) {
                    this.$refs['editerZh'].setContent('')
                    this.$refs['editerZh'].setContent(introduce)
                }
            },
            /**
             * 查询已编辑信息
             */
            getArticleForm () {
                if (this.$route.query.id !== undefined) {
                    let params = {
                        traceId: Math.random().toString(36).substr(2),
                        locale: this.activeName,
                        data: this.$route.query.id
                    }
                    getArticle(params).then(res => {
                        if (res.code.toString() === '0') {
                            if (res.data.title !== null || res.data.categoryId !== null) {
                                let data = res.data
                                this.form.id = data.id
                                this.form.categoryNum = data.categoryNum
                                this.form.categoryId = data.categoryId
                                this.form.categoryName = data.categoryName
                                this.form.projectIdList = data.projectIdList
                                this.form.title = data.title
                                // 比较使用
                                this.comparisonForm.categoryNum = data.categoryNum
                                this.comparisonForm.categoryId = data.categoryId
                                this.comparisonForm.projectIdList = data.projectIdList
                                this.comparisonForm.title = data.title
                                this.form.appointmentTime = this.getZoneTime(parseInt(new Date(this.parseTime(data.appointmentTime, '{y}/{m}/{d} {h}:{i}') + ':00') / 1000))
                                this.allFileList = JSON.parse(data.attachmentLogin).concat(JSON.parse(data.attachment))
                                this.comparisonForm.allFileList = JSON.parse(data.attachmentLogin).concat(JSON.parse(data.attachment))
                                this.comparisonForm.appointmentTime = JSON.parse(JSON.stringify(this.form.appointmentTime))
                                let attachment = JSON.parse(data.attachment)
                                for (let i in attachment) {
                                    this.checkList.push(attachment[i].fileId)
                                    this.comparisonForm.checkList.push(attachment[i].fileId)
                                }
                                if (data.locales) {
                                    this.hasLocales = data.locales
                                    this.toNext = this.hasLocales.length < 2
                                }
                                this.form.attachmentLogin = []
                                this.form.attachment = []
                                if (data.content) {
                                    this.removeDiv(data.content)
                                }
                            }
                        }
                    })
                } else {
                    this.setAppointmentTime()
                }
            },
            /**
             * 保存表单
             */
            saveForm () {
                this.form.attachmentLogin = JSON.parse(JSON.stringify(this.allFileList))
                let check = this.checkList
                for (let i in check) {
                    for (let j in this.form.attachmentLogin) {
                        if (check[i] === this.form.attachmentLogin[j].fileId) {
                            this.form.attachment.push(this.form.attachmentLogin[j])
                            this.form.attachmentLogin.splice(j, 1)
                        }
                    }
                }
                this.form.attachmentLogin = JSON.stringify(this.form.attachmentLogin)
                this.form.attachment = JSON.stringify(this.form.attachment)
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    locale: this.activeName,
                    data: JSON.parse(JSON.stringify(this.form))
                }
                if (params.data.appointmentTime === null || getZoneTimeTamp(params.data.appointmentTime) < parseInt(new Date() / 1000)) {
                    params.data.appointmentTime = this.getZoneTime(parseInt(new Date(this.parseTime(parseInt(new Date() / 1000), '{y}/{m}/{d} {h}:{i}') + ':00') / 1000))
                } else {
                    params.data.appointmentTime = params.data.appointmentTime.substring(0, 16) + ':00'
                }
                // 优化图片路径
                params.data.content = params.data.content.replace(new RegExp('src="public', 'g'), 'src="/public')
                let width = 840
                // 优化复制的表格没有边框
                params.data.content = params.data.content.replace(/<table>/g, '<table style="border-collapse: collapse; width: 100%;" border="1">')
                // 优化表格超宽处理
                params.data.content = params.data.content.replace(/<table/g, '<div data-onlytablewidth="' + width + '" style="max-width: ' + width + 'px;overflow-x: auto;"><table')
                params.data.content = params.data.content.replace(/<\/table>/g, '</table></div>')
                // 优化a标签字体蓝色
                params.data.content = params.data.content.replace(/<a href=/g, '<a style="color: #2ea9df" href=')
                if (params.data.id === '') {
                    saveArticle(params).then(res => {
                        this.afterSaveArticle(res)
                    }).catch(err => {
                        this.form.attachmentLogin = []
                        this.form.attachment = []
                        this.$message.error(err.msg)
                    })
                } else {
                    updateArticle(params).then(res => {
                        this.afterSaveArticle(res)
                    }).catch(err => {
                        this.form.attachmentLogin = []
                        this.form.attachment = []
                        this.$message.error(err.msg)
                    })
                }
            },
            /**
             * 保存成功后的操作
             * @param res 返回值
             */
            afterSaveArticle (res) {
                this.form.attachmentLogin = []
                this.form.attachment = []
                if (res.code.toString() === '0') {
                    this.form.id = res.data.id
                    this.$route.query.id = res.data.id
                    this.comparisonForm = {
                        categoryNum: res.data.categoryNum,
                        categoryId: res.data.categoryId,
                        projectIdList: res.data.projectIdList,
                        title: res.data.title,
                        content: res.data.content,
                        allFileList: this.allFileList,
                        appointmentTime: res.data.appointmentTime,
                        checkList: this.checkList
                    }
                    if (this.toNext) {
                        this.toNextLanguage()
                        if (!this.hasLocales.includes(this.activeName)) {
                            this.hasLocales.push(this.activeName)
                        }
                    } else {
                        this.$router.push({path: '/contentmanage/infodisclosure/infomanagement'})
                    }
                } else {
                    this.$message.error(res.msg)
                }
            },
            /**
             *  判断pt项目是否存在
             */
            checkProject () {
                // 文件是否上传完成
                if (this.flagSubmit) {
                    this.$refs.form.validate((valid) => {
                        if (valid) {
                            let params = {
                                traceId: Math.random().toString(36).substr(2)
                            }
                            getProject(params).then(res => {
                                if (res.code.toString() === '0') {
                                    this.ptProjectList = res.data
                                    let flag = false
                                    for (let i in this.form.projectIdList) {
                                        for (let j in this.ptProjectList) {
                                            if (this.form.projectIdList[i] === this.ptProjectList[j].projectId) {
                                                flag = true
                                                break
                                            }
                                        }
                                    }
                                    if (this.form.projectIdList.length === 0 || this.form.projectIdList === null) {
                                        this.saveForm()
                                    } else if (flag) {
                                        this.saveForm()
                                    } else {
                                        this.$refs.projectIdList.focus()
                                        this.$message.error('项目或PT不存在，请重新选择')
                                    }
                                }
                            })
                        }
                    })
                } else {
                    this.$message.warning('请等待文件上传完成')
                }
            },
            /**
             * 编辑下一个未编辑的页面
             */
            toNextLanguage () {
                let index = this.locales.indexOf(this.activeName)
                let activeName = ''
                if (index === 0) {
                    if (!this.hasLocales.includes('zh_TW')) {
                        activeName = 'zh_TW'
                    } else if (!this.hasLocales.includes('en_US')) {
                        activeName = 'en_US'
                    } else {
                        activeName = 'zh_TW'
                    }
                } else if (index === 1) {
                    if (!this.hasLocales.includes('en_US')) {
                        activeName = 'en_US'
                    } else if (!this.hasLocales.includes('zh_CN')) {
                        activeName = 'zh_CN'
                    } else {
                        activeName = 'en_US'
                    }
                } else {
                    if (!this.hasLocales.includes('zh_CN')) {
                        activeName = 'zh_CN'
                    } else if (!this.hasLocales.includes('zh_TW')) {
                        activeName = 'zh_TW'
                    } else {
                        activeName = 'zh_CN'
                    }
                }
                this.activeName = activeName
                this.categoryList = this.category[activeName]
                this.resetForm()
                this.getArticleForm()
            },
            /**
             * 预览业务端效果
             */
            previewContent () {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        let data = {
                            title: this.form.title,
                            content: this.form.content,
                            time: this.form.appointmentTime,
                            check: this.checkList,
                            files: this.allFileList
                        }
                        localStorage.setItem('previewContent', JSON.stringify(data))
                        let url = this.$router.resolve({path: '/preview'})
                        window.open(url.href, '_blank')
                    }
                })
            },
            /**
             * 切换语言前
             *  @param activeName 选中的标签页name
             *  @param oldActiveName 现在的标签页name
             */
            beforeleave (activeName, oldActiveName) {
                if (this.hasModify()) {
                    return this.$confirm('当前页面还未保存，如果离开，更改的内容将会丢失。', '确认信息', {
                        confirmButtonText: '离开',
                        cancelButtonText: '留下',
                        type: 'warning'
                    })
                        .then(() => {
                            this.activeName = activeName
                            this.categoryList = this.category[activeName]
                            this.resetForm()
                            this.getArticleForm()
                        })
                        .catch()
                } else {
                    this.activeName = activeName
                    this.categoryList = this.category[activeName]
                    this.resetForm()
                    this.getArticleForm()
                }
            },
            /**
             * 重置表单
             */
            resetForm () {
                this.$refs.form.resetFields()
                if (this.$refs['editerZh']) {
                    this.$refs['editerZh'].setContent('')
                }
                this.comparisonForm = {
                    categoryNum: '',
                    categoryId: '',
                    projectIdList: [],
                    title: '',
                    content: '',
                    allFileList: [],
                    appointmentTime: '',
                    checkList: []
                }
                this.checkList = []
                this.allFileList = []
            },
            /**
             * 判断是否修改
             */
            hasModify () {
                if (this.comparisonForm.categoryNum !== this.form.categoryNum) {
                    return true
                }
                if (this.comparisonForm.categoryId !== this.form.categoryId) {
                    return true
                }
                if (this.comparisonForm.title !== this.form.title) {
                    return true
                }
                if (this.comparisonForm.content !== this.form.content) {
                    return true
                }
                let projectFlag = false
                if (this.form.projectIdList.length === this.comparisonForm.projectIdList.length) {
                    if (this.form.projectIdList.length !== 0) {
                        for (let i in this.form.projectIdList) {
                            for (let j in this.comparisonForm.projectIdList) {
                                if (this.form.projectIdList[i] === this.comparisonForm.projectIdList[j]) {
                                    projectFlag = true
                                    break
                                } else {
                                    projectFlag = false
                                }
                            }
                        }
                    } else {
                        projectFlag = true
                    }
                }
                if (!projectFlag) {
                    return true
                }
                let flag = false
                if (this.allFileList.length === this.comparisonForm.allFileList.length) {
                    if (this.allFileList.length !== 0) {
                        for (let i in this.allFileList) {
                            for (let j in this.comparisonForm.allFileList) {
                                if (this.allFileList[i].fileId === this.comparisonForm.allFileList[j].fileId) {
                                    flag = true
                                    break
                                } else {
                                    flag = false
                                }
                            }
                        }
                    } else {
                        flag = true
                    }
                }
                if (!flag) {
                    return true
                }
                let flagCheck = false
                if (this.checkList.length === this.comparisonForm.checkList.length) {
                    if (this.checkList.length !== 0) {
                        for (let i in this.checkList) {
                            for (let j in this.comparisonForm.checkList) {
                                if (this.checkList[i] === this.comparisonForm.checkList[j]) {
                                    flagCheck = true
                                    break
                                } else {
                                    flagCheck = false
                                }
                            }
                        }
                    } else {
                        flagCheck = true
                    }
                }
                if (!flagCheck) {
                    return true
                }
                if (this.comparisonForm.appointmentTime !== this.form.appointmentTime) {
                    return true
                }
                return false
            },
            /**
             * 文件上传成功
             * @param data 上传成功的文件
             */
            fileSuccess (data) {
                this.allFileList.push(data)
            },
            /**
             * 删除文件
             * @param data 要删除的文件
             */
            fileRemove (data) {
                let id = data.fileId ? data.fileId : data.response.fileId
                this.allFileList.forEach((item, index) => {
                    if (item.fileId === id) {
                        this.allFileList.splice(index, 1)
                    }
                })
                this.checkList.forEach((item, index) => {
                    if (item.fileId === id) {
                        this.checkList.splice(index, 1)
                    }
                })
            },
            /**
             * 是否允许发布（有文件正在上传）data.state=true是不能
             */
            canSubmit (data) {
                if (data.state) {
                    if (!this.uploadfilelist.includes(data.uid)) {
                        this.uploadfilelist.push(data.uid)
                        this.flagSubmit = false
                    }
                } else {
                    this.uploadfilelist.splice(this.uploadfilelist.indexOf(data.uid), 1)
                    if (this.uploadfilelist.length === 0) {
                        this.flagSubmit = true
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

<style lang="scss" scoped>
    .el-icon-circle-check {
        margin-right: 5px;
        color: #67C23A;
    }

    .el-tabs__item.is-active .el-icon-circle-check {
        color: #2EA9DF;
    }

    .article-form {
        max-width: 942px;
        .tinymce-box {
            width: 100%;
            overflow-x: auto;
            .tinymce {
                width: 840px;
            }
        }
        .category-input {
            width: 400px;
        }
        .associated-project {
            width: 400px;
            /deep/ .el-select__tags {
                display: flex;
                flex-wrap: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                & > span {
                    display: flex;
                    flex-wrap: nowrap;
                }
            }
            /deep/ .el-input--small .el-input__inner {
                height: 32px !important;
            }
        }
        .btn {
            text-align: right;
            padding-bottom: 30px;
            label {
                margin-right: 50px;
            }
            button {
                margin-left: 14px;
                &:last-child {
                    color: #2EA9DF;
                }
            }
        }
    }
</style>
<style lang="scss">
    .file-upload-checkbox {
        position: relative;
        .el-upload-list {
            padding-left: 22px;
        }
        .attachment-label {
            position: absolute;
            top: 197px;
            left: -100px;
            padding-right: 12px;
            font-size: 14px;
            color: #606266;
            font-weight: 700;
            width: 100px;
            text-align: right;
        }
        .upload-check-box {
            position: absolute;
            top: 197px;
            left: 0;
            .el-checkbox-group {
                .el-checkbox {
                    display: block;
                    height: 30px;
                    .el-checkbox__label {
                        display: none;
                    }
                }
            }
        }
    }

    .appointment-time {
        .el-button.el-picker-panel__link-btn.el-button--text.el-button--mini {
            display: none;
        }
    }
</style>
