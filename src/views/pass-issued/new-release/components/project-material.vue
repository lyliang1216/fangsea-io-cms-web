<template>
    <div>
        <el-form ref="projectMaterial" :rules="projectMaterialrules" :model="projectMaterial"
                 label-width="130px">
            <el-form-item label="选择语言：">
                <el-select v-model="languagevalue" @change="selectlanguage" filterable>
                    <el-option value="zh_CN" label="简体中文"></el-option>
                    <el-option value="zh_TW" label="繁體中文"></el-option>
                    <el-option value="en_US" label="English"></el-option>
                </el-select>
            </el-form-item>
            <p class="form-item-group">基本资料</p>
            <el-form-item label="图片：" prop="imgs">
                <upload-file
                    :accept="'.jpg, .png'"
                    :fileList="projectMaterial.imgs"
                    :limit="10"
                    @inUploading="cantsubmit"
                    @uploadSuccess="saveImgSucc($event, 'imgs')"
                    @removeFile="removeFile($event, 'imgs')">
                </upload-file>
            </el-form-item>
            <el-form-item label="视频：" prop="video">
                <upload-file
                    :accept="'.mp4'"
                    :fileList="projectMaterial.video"
                    :limit="1"
                    @inUploading="cantsubmit"
                    @uploadSuccess="saveImgSucc($event, 'video')"
                    @removeFile="removeFile($event, 'video')">
                </upload-file>
            </el-form-item>
            <el-form-item label="视频封面图片：" prop="videoImg">
                <upload-file
                    :accept="'.jpg, .png'"
                    :fileList="projectMaterial.videoImg"
                    :limit="1"
                    @inUploading="cantsubmit"
                    @uploadSuccess="saveImgSucc($event, 'videoImg')"
                    @removeFile="removeFile($event, 'videoImg')">
                </upload-file>
            </el-form-item>
            <el-form-item label="项目名称：" prop="name">
                <el-input v-model="projectMaterial.name"
                          @keyup.native="keyuplong('name', 100)"
                          placeholder="项目名称建议包含小区名称和项目标识，如：VIP Mercury水星之城S1704"></el-input>
            </el-form-item>
            <el-form-item label="房产详细地址：" prop="address">
                <el-input
                    rows="3"
                    type="textarea"
                    @keyup.native="keyuplong('address', 500)"
                    v-model="projectMaterial.address"
                    placeholder="请填写房产详细地址"
                    maxlength="500"
                    show-word-limit>
                </el-input>
            </el-form-item>
            <el-form-item label="面积：" prop="measure">
                <el-input style="width: 220px;"
                          oninput="value=value.replace(/[^\d.]/g,'')"
                          v-model="projectMaterial.measure"
                          :disabled="issueState!==0&&issueState!==1"
                          placeholder="请填写面积">
                    <template slot="append">m<sup>2</sup></template>
                </el-input>
            </el-form-item>
            <el-form-item label="竣工时间：" prop="completionDate">
                <el-date-picker
                    v-model="projectMaterial.completionDate"
                    type="year"
                    :picker-options="pickoption"
                    value-format="timestamp"
                    placeholder="选择年">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="户型：" prop="apartment">
                <el-input v-model="projectMaterial.apartment"
                          @keyup.native="keyuplong('apartment', 10)"
                          placeholder="请填写户型"></el-input>
            </el-form-item>
            <el-form-item label="产权：" prop="propertyRight">
                <el-input v-model="projectMaterial.propertyRight" maxlength="50"
                          @keyup.native="keyuplong('propertyRight', 50)"
                          placeholder="请填写产权信息"></el-input>
            </el-form-item>
            <el-form-item label="标签：" prop="projectLabel">
                <el-tag
                    :key="tag"
                    type="info"
                    v-for="tag in projectMaterial.projectLabel"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(tag)">
                    {{tag}}
                </el-tag>
                <el-input
                    class="input-new-tag"
                    v-if="inputTagVisible"
                    v-model="inputTagValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加标签</el-button>
            </el-form-item>
            <el-form-item label="房产简介：" prop="description">
                <el-input
                    rows="3"
                    type="textarea"
                    v-model="projectMaterial.description"
                    @keyup.native="keyuplong('description', 500)"
                    placeholder="请填写房产简介"
                    maxlength="500"
                    show-word-limit>
                </el-input>
            </el-form-item>
            <el-form-item label="房产描述：">
                <!--富文本-->
                <div class="tinymce-box">
                    <!--<el-input class="input-with-select" v-model="tinymcewidth" oninput="value=value.replace(/[^\d]/g,'')">-->
                    <!--<el-button size="small" slot="append" type="primary" @click="trueWidth(tinymcewidth)">修改-->
                    <!--</el-button>-->
                    <!--</el-input>-->
                    <tinymce ref="editerZh" v-model="projectMaterial.introduce" :height="300"/>
                </div>
            </el-form-item>
            <p class="form-item-group">房产证明</p>
            <el-form-item label="房产证：" prop="houseCertificateImg">
                <upload-file
                    :accept="'.jpg, .png, .pdf'"
                    :fileList="projectMaterial.houseCertificateImg"
                    :limit="5"
                    @inUploading="cantsubmit"
                    @uploadSuccess="saveImgSucc($event, 'houseCertificateImg')"
                    @removeFile="removeFile($event, 'houseCertificateImg')">
                </upload-file>
            </el-form-item>
            <el-form-item label="EIA：" prop="eiaImg">
                <upload-file
                    :accept="'.jpg, .png, .pdf'"
                    :fileList="projectMaterial.eiaImg"
                    :limit="5"
                    @inUploading="cantsubmit"
                    @uploadSuccess="saveImgSucc($event, 'eiaImg')"
                    @removeFile="removeFile($event, 'eiaImg')">
                </upload-file>
            </el-form-item>
            <el-form-item label="建筑许可证：" prop="buildingPermitsImg">
                <upload-file
                    :accept="'.jpg, .png, .pdf'"
                    :fileList="projectMaterial.buildingPermitsImg"
                    :limit="5"
                    @inUploading="cantsubmit"
                    @uploadSuccess="saveImgSucc($event, 'buildingPermitsImg')"
                    @removeFile="removeFile($event, 'buildingPermitsImg')">
                </upload-file>
            </el-form-item>
            <p class="form-item-group">土地证明</p>
            <el-form-item label="土地证：" prop="landCertificateImg">
                <upload-file
                    :accept="'.jpg, .png, .pdf'"
                    :fileList="projectMaterial.landCertificateImg"
                    :limit="5"
                    @inUploading="cantsubmit"
                    @uploadSuccess="saveImgSucc($event, 'landCertificateImg')"
                    @removeFile="removeFile($event, 'landCertificateImg')">
                </upload-file>
            </el-form-item>
            <el-form-item label="土地购买合同：" prop="landContractImg">
                <upload-file
                    :accept="'.jpg, .png, .pdf'"
                    :fileList="projectMaterial.landContractImg"
                    :limit="5"
                    @inUploading="cantsubmit"
                    @uploadSuccess="saveImgSucc($event, 'landContractImg')"
                    @removeFile="removeFile($event, 'landContractImg')">
                </upload-file>
            </el-form-item>
            <el-form-item label="土地地主资料：" prop="landMasterImg">
                <upload-file
                    :accept="'.jpg, .png, .pdf'"
                    :fileList="projectMaterial.landMasterImg"
                    :limit="5"
                    @inUploading="cantsubmit"
                    @uploadSuccess="saveImgSucc($event, 'landMasterImg')"
                    @removeFile="removeFile($event, 'landMasterImg')">
                </upload-file>
            </el-form-item>
            <el-form-item label="分期付款资料："  prop="installmentImg">
                <upload-file
                    :accept="'.jpg, .png, .pdf'"
                    :fileList="projectMaterial.installmentImg"
                    :limit="5"
                    @inUploading="cantsubmit"
                    @uploadSuccess="saveImgSucc($event, 'installmentImg')"
                    @removeFile="removeFile($event, 'installmentImg')">
                </upload-file>
            </el-form-item>
            <p class="form-item-group">物业资料</p>
            <el-form-item label="物业管理公司：" prop="propertyName">
                <el-input v-model="projectMaterial.propertyName" placeholder="请填写公司名称"
                          @keyup.native="keyuplong('propertyName', 500)"></el-input>
            </el-form-item>
            <el-form-item label="物业运营商执照："  prop="propertyCertificateImg">
                <upload-file
                    :accept="'.jpg, .png, .pdf'"
                    :fileList="projectMaterial.propertyCertificateImg"
                    :limit="5"
                    @inUploading="cantsubmit"
                    @uploadSuccess="saveImgSucc($event, 'propertyCertificateImg')"
                    @removeFile="removeFile($event, 'propertyCertificateImg')">
                </upload-file>
            </el-form-item>
            <el-form-item label="负责人姓氏：" prop="propertyPersonSurname">
                <el-input v-model="projectMaterial.propertyPersonSurname" placeholder="请填写物业负责人姓氏"
                          @keyup.native="keyuplong('propertyPersonSurname', 50)"></el-input>
            </el-form-item>
            <el-form-item label="负责人名字：" prop="propertyPersonName">
                <el-input v-model="projectMaterial.propertyPersonName" placeholder="请填写物业负责人名字"
                          @keyup.native="keyuplong('propertyPersonName', 50)"></el-input>
            </el-form-item>
            <el-form-item label="联系电话：" prop="propertyTel">
                <el-input placeholder="请填写联系电话"
                          v-model="projectMaterial.propertyTel" class="input-with-select">
                    <el-select class="telareacode" v-model="projectMaterial.telAreaCode" slot="prepend"
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
            <div class="bottom-btn-box">
                <el-button v-if="issueState===0" size="small" @click="nextpage3('projectMaterial', false)">暂&emsp;存
                </el-button>
                <el-button size="small" type="primary" @click="nextpage3('projectMaterial', false, 'pre')">上一步
                </el-button>
                <el-button size="small" type="primary" @click="nextpage3('projectMaterial', true, 'next')">下一步
                </el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
    import {
        saveMaterial,
        tempMaterial,
        saveMaterialUpdate,
        tempMaterialUpdate,
        getMaterial,
        getAreacode
    } from '@/api/pass-issued/new-release'
    import {fractionalformat} from '@/utils/validate'
    import {getfloat, getCurLeng, getFileId, resetFileList, upSetFileList} from '@/utils/filters'
    import uploadFile from '@/components/Upload'
    import Tinymce from '@/components/Tinymce'

    // 项目资料
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
                if (this.projectMaterial.propertyTel !== '' && this.projectMaterial.telAreaCode === '') {
                    return callback(new Error('请选择区号'))
                } else if (this.projectMaterial.propertyTel === '' && this.projectMaterial.telAreaCode !== '') {
                    return callback(new Error('请填写联系电话'))
                } else if (this.projectMaterial.propertyTel !== '' && !(/^[0-9]+$/.test(this.projectMaterial.propertyTel))) {
                    return callback(new Error('请输入正确格式'))
                } else {
                    return callback()
                }
            }
            const inputmeasure = (rule, value, callback) => {
                if (this.projectMaterial.measure === '') {
                    return callback(new Error('请填写面积'))
                } else if (!fractionalformat(this.projectMaterial.measure)) {
                    return callback(new Error('请填写正确格式'))
                } else {
                    this.projectMaterial.measure = getCurLeng(this.projectMaterial.measure, 4)
                    return callback()
                }
            }
            const videoandimg1 = (rule, value, callback) => {
                if (this.projectMaterial.video.length === 0 && this.projectMaterial.videoImg.length !== 0) {
                    return callback(new Error('请上传视频'))
                } else {
                    return callback()
                }
            }
            const videoandimg2 = (rule, value, callback) => {
                if (this.projectMaterial.video.length !== 0 && this.projectMaterial.videoImg.length === 0) {
                    return callback(new Error('请上传视频封面图片'))
                } else {
                    return callback()
                }
            }
            const checkProjectLabel = (rule, value, callback) => {
                let lang = this.nowlanguage
                if (this.projectMaterial.projectLabel.indexOf(this.inputTagValue) !== -1) {
                    return callback(new Error('重复标签'))
                } else if (lang === 'en_US') {
                    if (this.inputTagValue.length > 26) {
                        return callback(new Error('单个标签最大长度为26个英文字符'))
                    }
                } else {
                    if (this.inputTagValue.length > 10) {
                        return callback(new Error('单个标签最大长度为10个汉字'))
                    }
                }
                for (let i in this.projectMaterial.projectLabel) {
                    if (lang !== 'en_US' && this.projectMaterial.projectLabel[i].length > 10) {
                        return callback(new Error('单个标签最大长度为10个汉字'))
                    } else if (lang === 'en_US' && this.projectMaterial.projectLabel[i].length > 26) {
                        return callback(new Error('单个标签最大长度为26个英文字符'))
                    }
                }
                return callback()
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
                 * 项目资料
                 */
                projectMaterial: {
                    // 项目名称
                    name: '',
                    // 面积
                    measure: '',
                    // 项目图片
                    imgs: [],
                    // 视频
                    video: [],
                    // 视频封面图片
                    videoImg: [],
                    // 地址
                    address: '',
                    // 竣工日期
                    completionDate: '',
                    // 户型
                    apartment: '',
                    // 产权
                    propertyRight: '',
                    // 标签
                    projectLabel: [],
                    // 描述
                    description: '',
                    // 介绍(富文本)
                    introduce: '',
                    // 物业公司名称
                    propertyName: '',
                    // 物业负责人姓氏
                    propertyPersonSurname: '',
                    // 物业负责人名称
                    propertyPersonName: '',
                    // 物业电话
                    propertyTel: '',
                    // 区号
                    telAreaCode: '',
                    // 房产证图
                    houseCertificateImg: [],
                    // EIA图
                    eiaImg: [],
                    // 建筑许可证图
                    buildingPermitsImg: [],
                    // 土地证图
                    landCertificateImg: [],
                    // 土地购买合同图
                    landContractImg: [],
                    // 土地地主资料图
                    landMasterImg: [],
                    // 分期付款资料图
                    installmentImg: [],
                    // 物业运营商执照
                    propertyCertificateImg: []
                },
                // 是否获取过信息，初始化，校验表单是否修改
                getinfo: false,
                // 文件是否未上传完成
                cantsub: false,
                // 上传中的文件
                uploadfilelist: [],
                // 区号列表
                areaCodelist: [],
                // 富文本宽度
                tinymcewidth: 800,
                // 添加标签
                inputTagValue: '',
                // 标签输入框显示
                inputTagVisible: false,
                // 表单验证
                projectMaterialrules: {
                    imgs: [
                        {required: true, message: '请上传图片'}
                    ],
                    video: [
                        {required: false, validator: videoandimg1}
                    ],
                    videoImg: [
                        {required: false, validator: videoandimg2}
                    ],
                    name: [
                        {required: true, message: '请填写项目名称', trigger: 'blur'}
                    ],
                    address: [
                        {required: true, message: '请填写房产详细地址', trigger: 'blur'}
                    ],
                    measure: [
                        {required: true, validator: inputmeasure, trigger: 'blur'}
                    ],
                    completionDate: [
                        {required: false, message: '请选择竣工时间', trigger: 'blur'}
                    ],
                    apartment: [
                        {required: false, message: '请填写户型', trigger: 'blur'}
                    ],
                    propertyRight: [
                        {required: true, message: '请填写产权信息', trigger: 'blur'}
                    ],
                    projectLabel: [
                        {required: false, validator: checkProjectLabel, trigger: 'blur'}
                    ],
                    description: [
                        {required: true, message: '请填写房产简介', trigger: 'blur'}
                    ],
                    propertyName: [
                        {required: true, message: '请填写物业公司名称', trigger: 'blur'}
                    ],
                    propertyPersonSurname: [
                        {required: true, message: '请填写物业负责人姓氏', trigger: 'blur'}
                    ],
                    propertyPersonName: [
                        {required: true, message: '请填写物业负责人名字', trigger: 'blur'}
                    ],
                    propertyTel: [
                        {required: true, validator: checkareacode, trigger: 'blur'}
                    ]
                },
                pickoption: {
                    disabledDate: (time) => {
                        // 最大2038年
                        return time.getTime() > 2145888000000
                    }
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
            // 获取项目资料
            this.getprojectMaterial()
        },
        watch: {
            projectMaterial: {
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
             *  修改富文本宽度
             */
            trueWidth (width) {
                let content = this.projectMaterial.introduce
                this.$refs['editerZh'].setContent('')
                document.querySelector('.tinymce-box').style.maxWidth = width + 'px'
                this.$refs['editerZh'].setContent(content)
            },
            /**
             *  去除table外层div
             *  @param str 富文本字符串
             */
            removeDiv (str) {
                let introduce = str
                // 去除table外层div
                let rule = /data-onlytablewidth="(.*?)"/g
                let res = rule.exec(introduce)
                if (res) {
                    let dataonlytablewidth = res[1]
                    this.tinymcewidth = dataonlytablewidth
                    introduce = introduce.replace(new RegExp('<div data-onlytablewidth="' + dataonlytablewidth + '" style="max-width: ' + dataonlytablewidth + 'px;overflow-x: auto;">', 'g'), '')
                    introduce = introduce.replace(/<\/table><\/div>/g, '</table>')
                }
                this.getinfo = true
                this.projectMaterial.introduce = introduce
                this.$refs['editerZh'].setContent('')
                this.$refs['editerZh'].setContent(introduce)
            },
            /**
             *  获取项目资料
             */
            getprojectMaterial () {
                // 判断是否为第一次新增
                if (this.projectId !== -1) {
                    let params = {
                        traceId: Math.random().toString(36).substr(2),
                        locale: this.languagevalue,
                        data: {
                            projectId: this.projectId
                        }
                    }
                    getMaterial(params).then(res => {
                        if (res.code.toString() === '0') {
                            this.getinfo = true
                            if (res.data) {
                                for (let key in this.projectMaterial) {
                                    if (res.data[key] || res.data[key] === 0) {
                                        if (key === 'projectLabel') {
                                            this.projectMaterial[key] = res.data[key].split(',')
                                        } else {
                                            this.projectMaterial[key] = res.data[key]
                                        }
                                    }
                                }
                                this.projectMaterial.imgs = resetFileList(this.projectMaterial.imgs)
                                this.projectMaterial.video = resetFileList(this.projectMaterial.video)
                                this.projectMaterial.videoImg = resetFileList(this.projectMaterial.videoImg)
                                this.projectMaterial.houseCertificateImg = resetFileList(this.projectMaterial.houseCertificateImg)
                                this.projectMaterial.eiaImg = resetFileList(this.projectMaterial.eiaImg)
                                this.projectMaterial.buildingPermitsImg = resetFileList(this.projectMaterial.buildingPermitsImg)
                                this.projectMaterial.landCertificateImg = resetFileList(this.projectMaterial.landCertificateImg)
                                this.projectMaterial.landContractImg = resetFileList(this.projectMaterial.landContractImg)
                                this.projectMaterial.landMasterImg = resetFileList(this.projectMaterial.landMasterImg)
                                this.projectMaterial.installmentImg = resetFileList(this.projectMaterial.installmentImg)
                                this.projectMaterial.propertyCertificateImg = resetFileList(this.projectMaterial.propertyCertificateImg)
                                this.projectMaterial.completionDate = this.projectMaterial.completionDate ? this.projectMaterial.completionDate * 1000 : ''
                                this.removeDiv(res.data.introduce)
                            }
                        } else {
                            this.$message.error(res.msg)
                        }
                    }).catch(() => {
                    })
                }
            },
            /**
             * 删除标签页
             * @param tag 标签内容
             */
            handleClose (tag) {
                this.projectMaterial.projectLabel.splice(this.projectMaterial.projectLabel.indexOf(tag), 1)
            },
            /**
             * 显示添加标签
             */
            showInput () {
                this.inputTagVisible = true
                this.$nextTick(() => {
                    this.$refs.saveTagInput.$refs.input.focus()
                })
            },
            /**
             * 添加标签内容
             */
            handleInputConfirm () {
                let flag = true
                if (this.projectMaterial.projectLabel.indexOf(this.inputTagValue) !== -1) {
                    flag = false
                    this.$refs.projectMaterial.validateField('checkProjectLabel')
                } else if (this.nowlanguage === 'en_US') {
                    if (this.inputTagValue.length > 26) {
                        flag = false
                        this.$refs.projectMaterial.validateField('checkProjectLabel')
                    }
                } else {
                    if (this.inputTagValue.length > 10) {
                        flag = false
                        this.$refs.projectMaterial.validateField('checkProjectLabel')
                    }
                }
                if (flag && this.inputTagValue !== '') {
                    this.projectMaterial.projectLabel.push(this.inputTagValue)
                    this.inputTagVisible = false
                    this.inputTagValue = ''
                }
                if (this.inputTagValue === '') {
                    this.inputTagVisible = false
                    this.inputTagValue = ''
                }
            },
            /**
             * 标签格式转字符串
             * @param arr 标签内容
             */
            labelToString (arr) {
                return arr.join(',')
            },
            /**
             *  项目资料 暂存/上一步/下一步/保存事件
             *  @param formname 表单名称
             *  @param bool 是否校验格式
             *  @param direction pre上一步，next下一步
             *  @param value 切换语言时语言内容
             */
            nextpage3 (formname, bool, direction, value) {
                this.$emit('opencloseloading', 1)
                let data = JSON.parse(JSON.stringify(this.projectMaterial))
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    locale: this.nowlanguage,
                    data: data
                }
                if (this.projectId !== -1) {
                    params.data.projectId = this.projectId
                } else {
                    params.data.projectId = null
                }
                // 时间戳毫秒转秒
                params.data.completionDate = params.data.completionDate / 1000
                params.data.measure = getfloat(params.data.measure, 4)
                // 富文本图片路径添加'/'
                params.data.introduce = params.data.introduce.replace(new RegExp('src="public', 'g'), 'src="/public')
                // 富文本table添加最大宽度
                let width = this.tinymcewidth !== '' ? this.tinymcewidth : 800
                params.data.introduce = params.data.introduce.replace(/<table/g, '<div data-onlytablewidth="' + width + '" style="max-width: ' + width + 'px;overflow-x: auto;"><table')
                params.data.introduce = params.data.introduce.replace(/<\/table>/g, '</table></div>')
                if (this.cantsub) {
                    this.$message.warning('请等待文件上传完成')
                    this.$emit('opencloseloading', 0)
                } else {
                    this.uploadfilelist = []
                    params.data.imgs = upSetFileList(params.data.imgs)
                    params.data.video = upSetFileList(params.data.video)
                    params.data.videoImg = upSetFileList(params.data.videoImg)
                    params.data.houseCertificateImg = upSetFileList(params.data.houseCertificateImg)
                    params.data.eiaImg = upSetFileList(params.data.eiaImg)
                    params.data.buildingPermitsImg = upSetFileList(params.data.buildingPermitsImg)
                    params.data.landCertificateImg = upSetFileList(params.data.landCertificateImg)
                    params.data.landContractImg = upSetFileList(params.data.landContractImg)
                    params.data.landMasterImg = upSetFileList(params.data.landMasterImg)
                    params.data.installmentImg = upSetFileList(params.data.installmentImg)
                    params.data.propertyCertificateImg = upSetFileList(params.data.propertyCertificateImg)
                    this.$emit('uploadingimg', 0)
                    if (bool) {
                        this.$refs[formname].validate((valid) => {
                            if (valid) {
                                params.data.projectLabel = this.labelToString(params.data.projectLabel)
                                if (this.projectId !== -1) {
                                    saveMaterialUpdate(params).then(res => {
                                        this.$emit('opencloseloading', 0)
                                        if (res.code.toString() === '0') {
                                            this.handleReqSucc(res)
                                            if (value) {
                                                this.handleReqSuccChangeLang(value)
                                            } else {
                                                // 切换标签页
                                                this.$emit('nextpage', 'projectExamine')
                                            }
                                        } else {
                                            this.$message.error(res.msg)
                                        }
                                    }).catch(() => {
                                        this.$emit('opencloseloading', 0)
                                    })
                                } else {
                                    saveMaterial(params).then(res => {
                                        this.$emit('opencloseloading', 0)
                                        if (res.code.toString() === '0') {
                                            this.handleReqSucc(res)
                                            if (value) {
                                                this.handleReqSuccChangeLang(value)
                                            } else {
                                                // 切换标签页
                                                this.$emit('nextpage', 'projectExamine')
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
                                    params.data.projectLabel = this.labelToString(params.data.projectLabel)
                                    if (this.projectId !== -1) {
                                        saveMaterialUpdate(params).then(res => {
                                            this.$emit('opencloseloading', 0)
                                            if (res.code.toString() === '0') {
                                                this.handleReqSucc(res)
                                                if (value) {
                                                    this.handleReqSuccChangeLang(value)
                                                } else {
                                                    // 切换标签页
                                                    this.$emit('prepage', 'projectIssuer')
                                                }
                                            } else {
                                                this.$message.error(res.msg)
                                            }
                                        }).catch(() => {
                                            this.$emit('opencloseloading', 0)
                                        })
                                    } else {
                                        saveMaterial(params).then(res => {
                                            this.$emit('opencloseloading', 0)
                                            if (res.code.toString() === '0') {
                                                this.handleReqSucc(res)
                                                if (value) {
                                                    this.handleReqSuccChangeLang(value)
                                                } else {
                                                    // 切换标签页
                                                    this.$emit('prepage', 'projectIssuer')
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
                            params.data.projectLabel = this.labelToString(params.data.projectLabel)
                            if (this.projectId !== -1) {
                                tempMaterialUpdate(params).then(res => {
                                    this.$emit('opencloseloading', 0)
                                    if (res.code.toString() === '0') {
                                        this.handleReqSucc(res)
                                        this.$message.success('草稿已保存')
                                        if (value) {
                                            this.handleReqSuccChangeLang(value)
                                        }
                                        if (direction === 'pre') {
                                            // 切换标签页
                                            this.$emit('prepage', 'projectIssuer')
                                        }
                                    } else {
                                        this.$message.error(res.msg)
                                    }
                                }).catch(() => {
                                    this.$emit('opencloseloading', 0)
                                })
                            } else {
                                tempMaterial(params).then(res => {
                                    this.$emit('opencloseloading', 0)
                                    if (res.code.toString() === '0') {
                                        this.handleReqSucc(res)
                                        this.$message.success('草稿已保存')
                                        if (value) {
                                            this.handleReqSuccChangeLang(value)
                                        }
                                        if (direction === 'pre') {
                                            // 切换标签页
                                            this.$emit('prepage', 'projectIssuer')
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
             *  处理请求成功数据(若为切换语言后续处理)
             * @param value 切换语言时语言内容
             */
            handleReqSuccChangeLang (value) {
                // 请求前为旧值，成功后改为新值
                this.nowlanguage = value
                this.languagevalue = value
                this.$emit('checklanguagevalue3', value)
                this.getprojectMaterial()
            },
            /**
             *  上传成功处理
             *  @param data 上传文件id
             *  @param name 组件对应name
             */
            saveImgSucc (data, name) {
                this.projectMaterial[name].push(data)
                if (name === 'video' || name === 'videoImg') {
                    this.$refs.projectMaterial.validateField('video')
                    this.$refs.projectMaterial.validateField('videoImg')
                } else {
                    this.$refs.projectMaterial.validateField(name)
                }
            },
            /**
             *  删除文件
             *  @param data 上传文件id
             *  @param name 组件对应name
             */
            removeFile (data, name) {
                this.deluploading(data)
                let id = getFileId(data)
                for (let i = 0; i < this.projectMaterial[name].length; i++) {
                    if (this.projectMaterial[name][i].fileId === id || this.projectMaterial[name][i].uid === id) {
                        this.projectMaterial[name].splice(i, 1)
                        if (name === 'video' || name === 'videoImg') {
                            this.$refs.projectMaterial.validateField('video')
                            this.$refs.projectMaterial.validateField('videoImg')
                        }
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
                        this.$refs['projectMaterial'].validate((valid) => {
                            if (valid) {
                                if (this.issueState === 1) {
                                    this.nextpage3('projectMaterial', true, 'no', value)
                                } else {
                                    this.nextpage3('projectMaterial', false, 'no', value)
                                }
                            } else {
                                this.languagevalue = 'zh_CN'
                                this.$message.error('请先完成简体中文内容填写')
                            }
                        })
                    } else {
                        this.$refs['projectMaterial'].validate((valid) => {
                            if (valid) {
                                if (this.issueState === 1) {
                                    this.nextpage3('projectMaterial', true, 'no', value)
                                } else {
                                    this.nextpage3('projectMaterial', false, 'no', value)
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
                this.$refs.projectMaterial.validateField('propertyTel')
            },
            /**
             *  限制输入框字符长度
             * @param name 参数名
             * @param num 长度
             */
            keyuplong (name, num) {
                if (this.projectMaterial[name].length > num) {
                    this.projectMaterial[name] = this.projectMaterial[name].substring(0, num)
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

    .tinymce-box {
        width: 800px;
    }

    .tinymce-box .input-with-select {
        margin-bottom: 20px;
    }

    .el-tag {
        margin-right: 10px;
    }

    .button-new-tag {
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }

    .input-new-tag {
        width: 220px;
        vertical-align: bottom;
    }
</style>
