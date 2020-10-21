<template>
    <div>
        <el-form ref="projectBase" :rules="projectBaserules" :model="projectBase" label-width="110px">
            <el-form-item label="房产所在地：" required>
                <el-col class="selectright" :xs="24" :sm="24" :md="8" :lg="3">
                    <el-form-item prop="country">
                        <el-select v-model="projectBase.country" placeholder="请选择国家" filterable
                                   @change="getarea(projectBase.country,1)">
                            <el-option
                                v-for="item in countrylist"
                                :key="item.regionId"
                                :label="item.zh_CN"
                                :value="item.regionId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col class="selectright" v-if="arealist.length > 0" :xs="24" :sm="24" :md="8" :lg="3">
                    <el-form-item prop="province">
                        <el-select v-model="projectBase.province" placeholder="请选择地区" filterable
                                   @change="getarea(projectBase.province,2)">
                            <el-option
                                v-for="item in arealist"
                                :key="item.regionId"
                                :label="item.zh_CN"
                                :value="item.regionId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col class="selectright" v-if="citylist.length > 0" :xs="24" :sm="24" :md="8" :lg="3">
                    <el-form-item prop="city">
                        <el-select v-model="projectBase.city" placeholder="请选择城市" filterable
                                   @change="getarea(projectBase.city,3)">
                            <el-option
                                v-for="item in citylist"
                                :key="item.regionId"
                                :label="item.zh_CN"
                                :value="item.regionId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-form-item>
            <el-form-item label="房产类型：" prop="projectType">
                <el-select v-model="projectBase.projectType" clearable filterable>
                    <el-option
                        v-for="item in projecttypelist"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="房产属性：" prop="projectNature">
                <el-select v-model="projectBase.projectNature" clearable filterable>
                    <el-option
                        v-for="item in projectnaturelist"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <div class="bottom-btn-box">
                <el-button v-if="issueState===0" size="small" @click="nextpage1('projectBase', false)">暂&emsp;存
                </el-button>
                <el-button size="small" type="primary" @click="nextpage1('projectBase', true, 'next')">下一步</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
    import {
        saveBase,
        tempBase,
        saveBaseUpdate,
        tempBaseUpdate,
        getBase,
        getProjectType,
        getProjectNature
    } from '@/api/pass-issued/new-release'
    import regions from '@/assets/regions.json'
    import axios from 'axios'

    // 基础信息
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
            return {
                // 项目id
                projectId: -1,
                // 基本资料
                projectBase: {
                    // 国家 关联id
                    country: '',
                    // 省 关联id
                    province: '',
                    // 市 关联id
                    city: '',
                    // 区域名称(国家，省，市)
                    regionsName: '',
                    // 房产类型
                    projectType: '',
                    // 房产属性
                    projectNature: 6
                },
                // 国家列表
                countrylist: [],
                // 地区列表
                arealist: [],
                // 城市列表
                citylist: [],
                // 显示地区
                showarea: true,
                // 显示城市
                showcity: true,
                // 房产属性
                projectnaturelist: [],
                // 房产类型
                projecttypelist: [],
                // 页面数据是否发生变化
                tabschange: false,
                // 是否获取过信息，初始化，校验表单是否修改
                getinfo: false,
                // 国际化地区名称
                // 繁体国家
                notationsname_tw1: '',
                // 繁体地区
                notationsname_tw2: '',
                // 繁体城市
                notationsname_tw3: '',
                // 英文国家
                notationsname_en1: '',
                // 英文地区
                notationsname_en2: '',
                // 英文城市
                notationsname_en3: '',
                // 表单验证
                projectBaserules: {
                    country: [
                        {required: true, message: '请选择国家', trigger: 'change'}
                    ],
                    province: [
                        {required: true, message: '请选择地区', trigger: 'change'}
                    ],
                    city: [
                        {required: true, message: '请选择城市', trigger: 'change'}
                    ],
                    projectType: [
                        {required: true, message: '请选择房产类型', trigger: 'change'}
                    ],
                    projectNature: [
                        {required: true, message: '请选择房产属性', trigger: 'change'}
                    ]
                }
            }
        },
        mounted () {
            if (this.projectIdf) {
                this.projectId = this.projectIdf
            }
            // 设置国家列表
            this.countrylist = this.getRegionsList()
            // 获取房产属性类型
            this.getprojecttypenature()
            // 获取基础资料
            this.getbasicinfo()
        },
        watch: {
            projectBase: {
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
             * 获取指定地区列表
             * @param id 指定id下的所有地区
             */
            getRegionsList (id) {
                let region = regions.RECORDS
                return region.filter(item => {
                    if (!id) {
                        // 获取国家
                        return item.regionGrade === 1
                    } else {
                        // 获取id的子级
                        return item.pRegionId === id
                    }
                })
            },
            /**
             * 获取地区列表
             * @param id 选中的父级id
             * @param index 下拉框顺序 1国家 2地区 3城市
             */
            getarea (id, index) {
                if (index === 1) {
                    this.arealist = this.getRegionsList(id)
                    this.citylist = []
                    this.projectBase.province = ''
                    this.projectBase.city = ''
                } else if (index === 2) {
                    this.citylist = this.getRegionsList(id)
                    this.projectBase.city = ''
                }
            },
            /**
             * 获取地址字符串
             * @param language 获取的语言
             */
            getRegionsName (language) {
                let country = ''
                let province = ''
                let city = ''
                let regionsName = ''
                let region = regions.RECORDS
                region.filter(item => {
                    if (item.regionId === this.projectBase.country) {
                        country = item[language]
                    }
                    if (item.regionId === this.projectBase.province) {
                        province = item[language]
                    }
                    if (item.regionId === this.projectBase.city) {
                        city = item[language]
                    }
                })
                if (this.projectBase.country) {
                    regionsName += country
                    if (this.projectBase.province) {
                        regionsName += ',' + province
                        if (this.projectBase.city) {
                            regionsName += ',' + city
                        }
                    }
                }
                return regionsName
            },
            /**
             *  获取房产属性类型
             */
            getprojecttypenature () {
                let params = {
                    traceId: Math.random().toString(36).substr(2)
                }
                // 获取房产类型
                getProjectNature(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.projectnaturelist = res.data
                    }
                }).catch()
                // 获取房产属性
                getProjectType(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.projecttypelist = res.data
                    }
                }).catch(() => {
                })
            },
            /**
             *  获取基础信息
             */
            getbasicinfo () {
                // 判断是否为第一次新增
                if (this.projectId !== -1) {
                    let params = {
                        traceId: Math.random().toString(36).substr(2),
                        data: {
                            projectId: this.projectId
                        }
                    }
                    getBase(params).then(res => {
                        if (res.code.toString() === '0') {
                            this.getinfo = true
                            if (res.data) {
                                if (res.data.country) {
                                    this.getarea(res.data.country, 1)
                                }
                                if (res.data.province) {
                                    this.getarea(res.data.province, 2)
                                }
                                for (let key in this.projectBase) {
                                    if (res.data[key] || res.data[key] === 0) {
                                        this.projectBase[key] = res.data[key]
                                    }
                                }
                            }
                        } else {
                            this.$message.error(res.msg)
                        }
                    }).catch(() => {
                    })
                }
            },
            /**
             *  基本资料 暂存/上一步/下一步/保存事件
             *  @param formname 表单名称
             *  @param bool 是否校验格式
             *  @param direction pre上一步，next下一步
             */
            nextpage1 (formname, bool, direction) {
                this.$emit('opencloseloading', 1)
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    locale: 'zh_CN',
                    data: JSON.parse(JSON.stringify(this.projectBase))
                }
                if (this.projectId !== -1) {
                    params.data.projectId = this.projectId
                } else {
                    params.data.projectId = null
                }
                params.data.regionsName = this.getRegionsName('zh_CN')
                if (bool) {
                    this.$refs[formname].validate((valid) => {
                        if (valid) {
                            if (this.projectId !== -1) {
                                saveBaseUpdate(params).then(res => {
                                    this.handleReqSucc(res, 1)
                                }).catch(err => {
                                    this.handleReqErr(err.msg)
                                })
                            } else {
                                saveBase(params).then(res => {
                                    this.handleReqSucc(res, 1)
                                }).catch(err => {
                                    this.handleReqErr(err.msg)
                                })
                            }
                        } else {
                            this.$emit('opencloseloading', 0)
                            return false
                        }
                    })
                } else {
                    if (this.projectId !== -1) {
                        tempBaseUpdate(params).then(res => {
                            this.handleReqSucc(res, 0)
                        }).catch(err => {
                            this.handleReqErr(err.msg)
                        })
                    } else {
                        tempBase(params).then(res => {
                            this.handleReqSucc(res, 0)
                        }).catch(err => {
                            this.handleReqErr(err.msg)
                        })
                    }
                }
            },
            /**
             *  处理请求成功数据
             * @param res 请求的返回数据
             * @param save 暂存还是保存 1保存 0暂存
             */
            handleReqSucc (res, save) {
                this.$emit('opencloseloading', 0)
                if (res.code.toString() === '0') {
                    this.projectId = res.data ? res.data.projectId : ''
                    this.$emit('returnproject', this.projectId)
                    this.tosavenotations(save)
                } else {
                    this.handleReqErr(res.msg)
                }
            },
            /**
             *  请求错误处理
             * @param err 错误信息
             */
            handleReqErr (err) {
                this.$emit('opencloseloading', 0)
                this.$message.error(err)
            },
            /**
             *  保存繁体和英语
             * @param save 暂存还是保存 1保存 0暂存
             */
            tosavenotations (save) {
                let _this = this
                axios.all([_this.saveTwEn(save, 'zh_TW'), _this.saveTwEn(save, 'en_US')]).then(axios.spread((res1, res2) => {
                    _this.$emit('opencloseloading', 0)
                    if (res1.code.toString() === '0' && res2.code.toString() === '0') {
                        // 提交表单内容给父组件
                        _this.getinfo = true
                        _this.$emit('tabschange', 0)
                        if (save) {
                            // 切换标签页
                            _this.$emit('nextpage', 'projectIssuer')
                        } else {
                            _this.$message.success('草稿已保存')
                        }
                    } else if (res1.code.toString() !== '0') {
                        _this.$message.error(res1.msg)
                    } else if (res2.code.toString() !== '0') {
                        _this.$message.error(res2.msg)
                    }
                })).catch(() => {
                    _this.$emit('opencloseloading', 0)
                })
            },
            /**
             * 保存国际化内容
             * @param save 暂存还是保存 1保存 0暂存
             * @param language 语言
             */
            saveTwEn (save, language) {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    locale: language,
                    data: JSON.parse(JSON.stringify(this.projectBase))
                }
                if (this.projectId !== -1) {
                    params.data.projectId = this.projectId
                } else {
                    params.data.projectId = null
                }
                params.data.regionsName = this.getRegionsName(language)
                if (save) {
                    return saveBase(params)
                } else {
                    return tempBase(params)
                }
            }
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
