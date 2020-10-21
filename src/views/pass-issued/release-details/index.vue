<template>
    <div class="app-container">
        <el-tabs type="border-card">
            <el-tab-pane label="基本资料">
                <table>
                    <tr>
                        <td>选择语言：</td>
                        <td>
                            <el-select v-model="languagevalue1" @change="selectlanguage1">
                                <el-option value="zh_CN" label="简体中文"></el-option>
                                <el-option value="zh_TW" label="繁體中文"></el-option>
                                <el-option value="en_US" label="English"></el-option>
                            </el-select>
                        </td>
                    </tr>
                    <tr>
                        <td>房产所在地：</td>
                        <td>{{projectBase.regionsName | tonull}}</td>
                    </tr>
                    <tr>
                        <td>房产类型：</td>
                        <td>{{projectBase.projectTypeName | tonull}}</td>
                    </tr>
                    <tr>
                        <td>房产属性：</td>
                        <td>{{projectBase.projectNatureName | tonull}}</td>
                    </tr>
                </table>
            </el-tab-pane>
            <el-tab-pane label="发行人资料">
                <table>
                    <tr>
                        <td>选择语言：</td>
                        <td>
                            <el-select v-model="languagevalue2" @change="selectlanguage2">
                                <el-option value="zh_CN" label="简体中文"></el-option>
                                <el-option value="zh_TW" label="繁體中文"></el-option>
                                <el-option value="en_US" label="English"></el-option>
                            </el-select>
                        </td>
                    </tr>
                    <tr>
                        <td>发行人：</td>
                        <td>公司</td>
                    </tr>
                    <tr>
                        <td>发行人名称：</td>
                        <td>{{projectIssuer.issuerName | tonull}}</td>
                    </tr>
                    <tr>
                        <td>法人姓氏：</td>
                        <td>{{projectIssuer.legalPersonSurname | tonull}}</td>
                    </tr>
                    <tr>
                        <td>法人名字：</td>
                        <td>{{projectIssuer.legalPersonName | tonull}}</td>
                    </tr>
                    <tr>
                        <td>负责人姓氏：</td>
                        <td>{{projectIssuer.chargePersonSurname | tonull}}</td>
                    </tr>
                    <tr>
                        <td>负责人名字：</td>
                        <td>{{projectIssuer.chargePersonName | tonull}}</td>
                    </tr>
                    <tr>
                        <td>营业执照：</td>
                        <td class="filebox">
                            <p v-for="item in projectIssuer.licenseImg">
                                <span @click="handlePreview(item)">{{item.name}}</span>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td>联系电话：</td>
                        <td><span v-if="projectIssuer.tel">+{{projectIssuer.telAreaCode | tonull}} {{projectIssuer.tel | tonull}}</span>
                        </td>
                    </tr>
                    <tr>
                        <td>联系邮箱：</td>
                        <td>{{projectIssuer.email | tonull}}</td>
                    </tr>
                    <tr>
                        <td>公司地址：</td>
                        <td>{{projectIssuer.address | tonull}}</td>
                    </tr>
                </table>
            </el-tab-pane>
            <el-tab-pane label="项目资料">
                <table>
                    <tr>
                        <td>选择语言：</td>
                        <td>
                            <el-select v-model="languagevalue3" @change="selectlanguage3">
                                <el-option value="zh_CN" label="简体中文"></el-option>
                                <el-option value="zh_TW" label="繁體中文"></el-option>
                                <el-option value="en_US" label="English"></el-option>
                            </el-select>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" class="mergeclass firstmerge">基本资料</td>
                    </tr>
                    <tr>
                        <td>图片：</td>
                        <td class="filebox">
                            <p v-for="item in projectMaterial.imgs">
                                <span @click="handlePreview(item)">{{item.name}}</span>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td>视频：</td>
                        <td class="filebox">
                            <p v-for="item in projectMaterial.video">
                                <span @click="handlePreview(item)">{{item.name}}</span>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td>视频封面图片：</td>
                        <td class="filebox">
                            <p v-for="item in projectMaterial.videoImg">
                                <span @click="handlePreview(item)">{{item.name}}</span>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td>项目名称：</td>
                        <td>{{projectMaterial.name | tonull}}</td>
                    </tr>
                    <tr>
                        <td>房产详细地址：</td>
                        <td>{{projectMaterial.address | tonull}}</td>
                    </tr>
                    <tr>
                        <td>面积：</td>
                        <td>{{projectMaterial.measure | tonull}}<span
                            v-if="projectMaterial.measure"> m<sup>2</sup></span></td>
                    </tr>
                    <tr>
                        <td>竣工时间：</td>
                        <td>{{projectMaterial.completionDate | parseTime('{y}')}}<span
                            v-if="projectMaterial.completionDate">年</span></td>
                    </tr>
                    <tr>
                        <td>户型：</td>
                        <td>{{projectMaterial.apartment | tonull}}</td>
                    </tr>
                    <tr>
                        <td>产权：</td>
                        <td>{{projectMaterial.propertyRight | tonull}}</td>
                    </tr>
                    <tr>
                        <td>标签：</td>
                        <td>
                            <el-tag type="info" :key="index" v-for="(tag, index) in projectMaterial.projectLabel">
                                {{tag}}
                            </el-tag>
                        </td>
                    </tr>
                    <tr>
                        <td>房产简介：</td>
                        <td>{{projectMaterial.description | tonull}}</td>
                    </tr>
                    <tr>
                        <td>房产描述：</td>
                        <td>
                            <div class="tinymce-box">
                                <tinymce ref="editerZh" v-model="projectMaterial.introduce" :height="300"/>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" class="mergeclass">房产证明</td>
                    </tr>
                    <tr>
                        <td>房产证：</td>
                        <td class="filebox">
                            <p v-for="item in projectMaterial.houseCertificateImg">
                                <span @click="handlePreview(item)">{{item.name}}</span>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td>EIA：</td>
                        <td class="filebox">
                            <p v-for="item in projectMaterial.eiaImg">
                                <span @click="handlePreview(item)">{{item.name}}</span>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td>建筑许可证：</td>
                        <td class="filebox">
                            <p v-for="item in projectMaterial.buildingPermitsImg">
                                <span @click="handlePreview(item)">{{item.name}}</span>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" class="mergeclass">土地证明</td>
                    </tr>
                    <tr>
                        <td>土地证：</td>
                        <td class="filebox">
                            <p v-for="item in projectMaterial.landCertificateImg">
                                <span @click="handlePreview(item)">{{item.name}}</span>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td>土地购买合同：</td>
                        <td class="filebox">
                            <p v-for="item in projectMaterial.landContractImg">
                                <span @click="handlePreview(item)">{{item.name}}</span>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td>土地地主资料：</td>
                        <td class="filebox">
                            <p v-for="item in projectMaterial.landMasterImg">
                                <span @click="handlePreview(item)">{{item.name}}</span>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td>分期付款资料：</td>
                        <td class="filebox">
                            <p v-for="item in projectMaterial.installmentImg">
                                <span @click="handlePreview(item)">{{item.name}}</span>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" class="mergeclass">物业资料</td>
                    </tr>
                    <tr>
                        <td>物业管理公司：</td>
                        <td>{{projectMaterial.propertyName | tonull}}</td>
                    </tr>
                    <tr>
                        <td>物业运营商执照：</td>
                        <td class="filebox">
                            <p v-for="item in projectMaterial.propertyCertificateImg">
                                <span @click="handlePreview(item)">{{item.name}}</span>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td>负责人姓氏：</td>
                        <td>{{projectMaterial.propertyPersonSurname | tonull}}</td>
                    </tr>
                    <tr>
                        <td>负责人名字：</td>
                        <td>{{projectMaterial.propertyPersonName | tonull}}</td>
                    </tr>
                    <tr>
                        <td>联系电话：</td>
                        <td><span v-if="projectMaterial.propertyTel">+{{projectMaterial.telAreaCode | tonull}} {{projectMaterial.propertyTel | tonull}}</span>
                        </td>
                    </tr>
                </table>
            </el-tab-pane>
            <el-tab-pane label="发行资料">
                <table>
                    <tr>
                        <td>律所调查报告：</td>
                        <td class="filebox">
                            <p v-for="item in projectExamine.lawFirmSurveyImg	">
                                <span @click="handlePreview(item)">{{item.name}}</span>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td>市场评估报告：</td>
                        <td class="filebox">
                            <p v-for="item in projectExamine.intermediarySurveyImg">
                                <span @click="handlePreview(item)">{{item.name}}</span>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td>房产通证发行协议：</td>
                        <td class="filebox">
                            <p v-for="item in projectExamine.agreementImg">
                                <span @click="handlePreview(item)">{{item.name}}</span>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td>其他：</td>
                        <td class="filebox">
                            <p v-for="item in projectExamine.otherFile">
                                <span @click="handlePreview(item)">{{item.name}}</span>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td>中介机构评估价格：</td>
                        <td><span v-if="projectExamine.intermediaryPrice||projectExamine.intermediaryPrice===0">{{projectExamine.intermediaryPrice | tonull}} {{projectExamine.intermediaryCurCode |
                            tonull}}</span>
                        </td>
                        <!--                        <td> ≈ </td>-->
                        <!--                        <td style="padding-left: 0px;">{{projectExamine.changeCurPrice}} {{projectExamine.changeCurCode}}</td>-->
                    </tr>
                    <tr>
                        <td>产品风险评估：</td>
                        <td>
                            <span>{{projectExamine.ventureCapitalLevel | getVentureCapitalLevel}}</span>
                        </td>
                    </tr>
                </table>
            </el-tab-pane>
            <el-tab-pane label="发行内容">
                <table>
                    <tr>
                        <td>币种：</td>
                        <td>{{projectDist.ptCurCode | tonull}}</td>
                    </tr>
                    <tr>
                        <td>期望预售销售比例：</td>
                        <td>{{projectDist.planSalesRatio | tonull}} <span
                            v-if="projectDist.planSalesRatio || projectDist.planSalesRatio === 0">%</span></td>
                    </tr>
                    <tr>
                        <td>设置支付币种：</td>
                        <td>{{projectDist.curCode | tonull}}</td>
                    </tr>
                    <tr>
                        <td>总价：</td>
                        <td>{{projectDist.totalPrice | tonull}} {{projectDist.priceCurCode | tonull}}</td>
                        <!--                        <td> ≈ </td>-->
                        <!--                        <td>{{projectDist.changeCurPrice}} {{projectDist.changeCurCode}}</td>-->
                    </tr>
                    <tr>
                        <td>通证数量：</td>
                        <td>{{projectDist.totalAmount | tonull}} 计算单位：<span
                            v-if="projectDist.ptUnit">m<sup>2</sup></span><span v-else>cm<sup>2</sup></span></td>
                    </tr>
                    <tr>
                        <td>通证价格：</td>
                        <td><span v-if="projectDist.ptPrice||projectDist.ptPrice===0">{{projectDist.ptPrice | tonull}} {{projectDist.priceCurCode | tonull}}</span>
                        </td>
                    </tr>
                    <tr>
                        <td>租金收益：</td>
                        <td>{{projectDist.prospectiveYield | tonull}}</td>
                    </tr>
                    <tr>
                        <td>预售最小时间：</td>
                        <td>{{projectDist.planMinTime | tonull | today}}</td>
                    </tr>
                    <tr>
                        <td>预售最大时间：</td>
                        <td>{{projectDist.planMaxTime | tonull | today}}</td>
                    </tr>
                    <tr>
                        <td>预售开始时间：</td>
                        <td>{{projectDist.planStartTime | getZoneTime}}</td>
                    </tr>
                    <tr>
                        <td>预售结束时间：</td>
                        <td>{{projectDist.planEndTime | getZoneTime}}</td>
                    </tr>
                </table>
            </el-tab-pane>
            <el-tab-pane label="发行设置">
                <table>
                    <tr>
                        <td>发行方：</td>
                        <td>{{projectDistSetting.issueUserCode | tonull}}</td>
                    </tr>
                    <tr>
                        <td>发行方自持数量：</td>
                        <td>{{projectDistSetting.selfAmount | tonull}}</td>
                    </tr>
                    <tr>
                        <td>项目最低认购数量：</td>
                        <td>{{projectDistSetting.minimumBuyAmount | tonull}}</td>
                    </tr>
                    <tr>
                        <td>项目最低认购人数：</td>
                        <td>{{projectDistSetting.minimumPeopleAmount | tonull}}</td>
                    </tr>
                    <tr>
                        <td>单人最低认购数量：</td>
                        <td>{{projectDistSetting.userMinAmount | tonull}}</td>
                    </tr>
                    <tr>
                        <td>单人最高认购数量：</td>
                        <td>{{projectDistSetting.userMaxAmount | tonull}}</td>
                    </tr>
                    <tr>
                        <td>即将售罄提示百分比：</td>
                        <td>{{projectDistSetting.sellOutRatio | tonull}}<span
                            v-if="projectDistSetting.sellOutRatio || projectDistSetting.sellOutRatio === 0">%</span>
                        </td>
                    </tr>
                    <tr>
                        <td>保证金及币种：</td>
                        <td>{{projectDistSetting.depositPrice | tonull}} {{projectDistSetting.depositCurCode |
                            tonull}}
                        </td>
                    </tr>
                    <tr>
                        <td>上市费用及币种：</td>
                        <td>{{projectDistSetting.paymentPrice | tonull}} {{projectDistSetting.paymentCurCode |
                            tonull}}
                        </td>
                    </tr>
                    <tr>
                        <td>发行单价：</td>
                        <td>
                            <span v-show="projectDistSetting.ptRateAuto">自动设置</span>
                            <span v-show="!projectDistSetting.ptRateAuto">手动设置</span>&emsp;
                            {{projectDistSetting.ptExchangeRate | tozero}}&nbsp;<span v-if="projectDist.curCode">PT/{{projectDist.curCode}}</span>
                        </td>
                    </tr>
                    <tr>
                        <td>价格锁定时间：</td>
                        <td>{{projectDistSetting.priceLockTime | tonull}} <span
                            v-if="projectDistSetting.priceLockTime||projectDistSetting.priceLockTime===0">秒</span></td>
                    </tr>
                </table>
            </el-tab-pane>
        </el-tabs>
        <el-dialog
            title="预览"
            :visible.sync="dialogVisible"
            width="50%">
            <img v-if="previecontent==='img'" :src="previewurl" class="previewimg" alt="">
            <audio v-if="previecontent==='mp4'" :src="previewurl" class="previewimg" controls></audio>
        </el-dialog>
    </div>
</template>

<script>
    import {getAllproject, getBase, getIssuer, getMaterial, getUsercode} from '@/api/pass-issued/release-details'
    import Tinymce from '@/components/Tinymce'
    import {getFullNum} from '@/utils/filters'

    export default {
        name: 'index',
        data () {
            return {
                // 项目id
                projectId: this.$route.query.projectId,
                // 预览弹窗
                dialogVisible: false,
                // 预览图片路径
                previewurl: '',
                // 预览文件类型 img/mp4
                previecontent: '',
                // 基本信息
                projectBase: {},
                projectBase_cn: {},
                projectBase_tw: {},
                projectBase_en: {},
                // 发行方资料
                projectIssuer: {},
                projectIssuer_cn: {},
                projectIssuer_tw: {},
                projectIssuer_en: {},
                // 项目资料
                projectMaterial: {},
                projectMaterial_cn: {},
                projectMaterial_tw: {},
                projectMaterial_en: {},
                // 发行资料
                projectExamine: {},
                // 发行内容
                projectDist: {},
                // 发行设置
                projectDistSetting: {},
                languagevalue1: 'zh_CN',
                languagevalue2: 'zh_CN',
                languagevalue3: 'zh_CN'
            }
        },
        mounted () {
            if (this.$route.query.projectId) {
                this.projectId = Number(this.$route.query.projectId)
                this.getall()
            } else {
                this.$router.push({path: '/passissued/releaselist'})
            }
            this.getglobalization()
        },
        methods: {
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
                    document.querySelector('.tinymce-box').style.maxWidth = dataonlytablewidth + 'px'
                    introduce = introduce.replace(new RegExp('<div data-onlytablewidth="' + dataonlytablewidth + '" style="max-width: ' + dataonlytablewidth + 'px;overflow-x: auto;">', 'g'), '')
                    introduce = introduce.replace(/<\/table><\/div>/g, '</table>')
                }
                return introduce
            },
            /**
             *  获取所有信息
             */
            getall () {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    locale: 'zh_CN',
                    data: {
                        projectId: this.projectId
                    }
                }
                getAllproject(params).then(res => {
                    if (res.code.toString() === '0') {
                        if (res.data.projectBase) {
                            this.projectBase = res.data.projectBase
                            this.projectBase_cn = res.data.projectBase
                        }
                        if (res.data.projectIssuer) {
                            this.projectIssuer = res.data.projectIssuer
                            this.projectIssuer_cn = res.data.projectIssuer
                        }
                        if (res.data.projectMaterial) {
                            let data = res.data.projectMaterial
                            data.projectLabel = data.projectLabel ? data.projectLabel.split(',') : []
                            this.projectMaterial = data
                            this.projectMaterial.introduce = this.removeDiv(data.introduce)
                            this.projectMaterial_cn = data
                            this.projectMaterial_cn.introduce = this.projectMaterial.introduce
                        }
                        if (res.data.projectExamine) {
                            this.projectExamine = res.data.projectExamine
                        }
                        if (res.data.projectDist) {
                            this.projectDist = res.data.projectDist
                        }
                        if (res.data.projectDistSetting) {
                            this.projectDistSetting = res.data.projectDistSetting
                            this.setExchangeRate(res.data.projectDistSetting.ptExchangeRate)
                            this.getissueusercode(this.projectDistSetting.issueUserId)
                        }
                    } else {
                        this.$message.error(res.msg)
                    }
                }).catch()
            },
            /**
             *  设置单价
             *  @param data 获取到的单价
             */
            setExchangeRate (data) {
                if (data === null) {
                    this.projectDistSetting.ptExchangeRate = 0
                } else if (data.toString().indexOf('e') !== -1) {
                    this.projectDistSetting.ptExchangeRate = getFullNum(data)
                } else {
                    this.projectDistSetting.ptExchangeRate = data
                }
            },
            /**
             *  获取国际化
             */
            getglobalization () {
                this.getProjectBaseTW()
                this.getProjectBaseEN()
                this.getProjectIssuerTW()
                this.getProjectIssuerEN()
                this.getProjectMaterialTW()
                this.getProjectMaterialEN()
            },
            /**
             *  获取基础繁体
             */
            getProjectBaseTW () {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    locale: 'zh_TW',
                    data: {
                        projectId: this.projectId
                    }
                }
                getBase(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.projectBase_tw = res.data
                    }
                })
            },
            /**
             *  获取基础英语
             */
            getProjectBaseEN () {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    locale: 'en_US',
                    data: {
                        projectId: this.projectId
                    }
                }
                getBase(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.projectBase_en = res.data
                    }
                })
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
                getIssuer(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.projectIssuer_tw = res.data
                    }
                })
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
                getIssuer(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.projectIssuer_en = res.data
                    }
                })
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
                getMaterial(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.projectMaterial_tw = res.data
                        this.projectMaterial_tw.projectLabel = this.projectMaterial_tw.projectLabel ? this.projectMaterial_tw.projectLabel.split(',') : []
                    }
                })
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
                getMaterial(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.projectMaterial_en = res.data
                        this.projectMaterial_en.projectLabel = this.projectMaterial_en.projectLabel ? this.projectMaterial_en.projectLabel.split(',') : []
                    }
                })
            },
            /**
             *  预览图片
             *  @param item 已上传的文件
             */
            handlePreview (item) {
                if (item.type === 0) {
                    this.previewurl = item.largeUrl
                    this.dialogVisible = true
                    this.previecontent = 'img'
                } else if (item.type === 1) {
                    if (item.fileUrl.indexOf('pdf') !== -1) {
                        window.open(item.fileUrl)
                    } else {
                        this.previewurl = item.fileUrl
                        this.dialogVisible = true
                        this.previecontent = 'mp4'
                    }
                }
            },
            /**
             *  语言内容切换
             */
            selectlanguage1 () {
                switch (this.languagevalue1) {
                case 'zh_CN':
                    this.projectBase = JSON.parse(JSON.stringify(this.projectBase_cn))
                    break
                case 'zh_TW':
                    this.projectBase = JSON.parse(JSON.stringify(this.projectBase_tw))
                    break
                case 'en_US':
                    this.projectBase = JSON.parse(JSON.stringify(this.projectBase_en))
                    break
                }
            },
            selectlanguage2 () {
                switch (this.languagevalue2) {
                case 'zh_CN':
                    this.projectIssuer = JSON.parse(JSON.stringify(this.projectIssuer_cn))
                    break
                case 'zh_TW':
                    this.projectIssuer = JSON.parse(JSON.stringify(this.projectIssuer_tw))
                    break
                case 'en_US':
                    this.projectIssuer = JSON.parse(JSON.stringify(this.projectIssuer_en))
                    break
                }
            },
            selectlanguage3 () {
                switch (this.languagevalue3) {
                case 'zh_CN':
                    this.projectMaterial = JSON.parse(JSON.stringify(this.projectMaterial_cn))
                    this.projectMaterial_cn.introduce = this.removeDiv(this.projectMaterial_cn.introduce)
                    this.$refs['editerZh'].setContent('')
                    this.$refs['editerZh'].setContent(this.projectMaterial_cn.introduce)
                    break
                case 'zh_TW':
                    this.projectMaterial = JSON.parse(JSON.stringify(this.projectMaterial_tw))
                    this.projectMaterial_tw.introduce = this.removeDiv(this.projectMaterial_tw.introduce)
                    this.$refs['editerZh'].setContent('')
                    this.$refs['editerZh'].setContent(this.projectMaterial_tw.introduce)
                    break
                case 'en_US':
                    this.projectMaterial = JSON.parse(JSON.stringify(this.projectMaterial_en))
                    this.projectMaterial_en.introduce = this.removeDiv(this.projectMaterial_en.introduce)
                    this.$refs['editerZh'].setContent('')
                    this.$refs['editerZh'].setContent(this.projectMaterial_en.introduce)
                    break
                }
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
                    if (res.code.toString() === '0') {
                        this.projectDistSetting.issueUserCode = res.data.userCode
                    } else {
                        this.$message.error(res.msg)
                    }
                }).catch(() => {
                })
            }
        },
        components: {
            Tinymce
        },
        filters: {
            today (value) {
                if (value || value === 0) {
                    return value / 60 / 60 / 24 + ' 天'
                } else {
                    return ''
                }
            },
            tonull (value) {
                if (value || value === 0) {
                    return value
                } else {
                    return ''
                }
            },
            tozero (value) {
                if (value === null || value === undefined) {
                    return 0
                } else {
                    return value
                }
            },
            getVentureCapitalLevel (val) {
                switch (val) {
                case 'S1' :
                    return 'S1 保本型'
                case 'S2' :
                    return 'S2 稳健型'
                case 'S3' :
                    return 'S3 成长型'
                case 'S4' :
                    return 'S4 积极型'
                }
            }
        }
    }
</script>

<style scoped>
    table td {
        line-height: 48px;
        vertical-align: top;
        word-break: break-all;
    }

    table td:first-child {
        text-align: right;
        min-width: 130px;
    }

    table td:last-child {
        padding-left: 10px;
        max-width: 900px;
    }

    .mergeclass {
        text-align: left !important;
        font-size: 16px;
        font-weight: 600;
        padding-top: 20px;
    }

    .firstmerge {
        padding-top: 0;
    }

    .filebox p {
        margin-bottom: 0;
        margin-top: 0;
    }

    .filebox p span {
        color: #2EA9DF;
        cursor: pointer;
    }

    .previewimg {
        display: block;
        width: 100%;
    }

    .tinymce-box {
        max-width: 800px;
    }

    .el-tag + .el-tag {
        margin-left: 10px;
    }
</style>
