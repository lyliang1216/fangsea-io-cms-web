<template>
    <div>
        <el-table stripe
                  :data="releaseList">
            <el-table-column
                width="120"
                label="项目编号"
                prop="number">
            </el-table-column>
            <el-table-column
                width="200"
                label="项目名称"
                prop="name">
            </el-table-column>
            <el-table-column
                width="100"
                label="ticker"
                prop="ticker">
            </el-table-column>
            <!--<el-table-column-->
            <!--label="Token Name"-->
            <!--prop="tokenName"-->
            <!--min-width="120">-->
            <!--</el-table-column>-->
            <el-table-column
                width="90"
                label="面积"
                prop="measure">
            </el-table-column>
            <el-table-column
                width="160"
                label="发行价格">
                <template slot-scope="props">
                    {{props.row.totalPrice}} {{props.row.priceCurCode}}
                </template>
            </el-table-column>
            <el-table-column
                width="160"
                label="租金收益"
                prop="prospectiveYield">
            </el-table-column>
            <el-table-column
                label="自持数量"
                prop="selfAmount">
            </el-table-column>
            <el-table-column
                label="预售数量"
                prop="saleAmount">
            </el-table-column>
            <el-table-column
                label="预售比例"
                prop="saleRatio">
                <template slot-scope="props">
                    {{ props.row.saleRatio === null ? '-' : props.row.saleRatio + '%' }}
                </template>
            </el-table-column>
            <el-table-column
                label="总发行量"
                prop="totalAmount">
            </el-table-column>
            <el-table-column
                label="发行状态">
                <template slot-scope="props">
                    {{ matchIssueState(props.row.issueState) }}
                </template>
            </el-table-column>
            <el-table-column
                label="支付状态">
                <template slot-scope="props">
                    {{ matchPayState(props.row.payState) }}
                </template>
            </el-table-column>
            <el-table-column
                label="通证发放状态"
                width="110">
                <template slot-scope="props">
                    {{ matchGiveState(props.row.giveState) }}
                </template>
            </el-table-column>
            <el-table-column
                label="创建时间"
                width="160">
                <template slot-scope="props">
                    {{ props.row.createTime | getZoneTime }}
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                fixed="right"
                min-width="120">
                <template slot-scope="scope">
                    <el-dropdown trigger="hover" class="editDropdown" @command="handleCommand">
                    <span class="el-dropdown-link">
                        编辑 <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-auth="{id: 10000010001}" :command="{name:'show',data:scope.row}">查看
                            </el-dropdown-item>
                            <el-dropdown-item
                                v-auth="{id: 10000010003}"
                                :disabled="!(scope.row.issueState===4 || scope.row.issueState===5 || scope.row.issueState===6 || scope.row.issueState===7)"
                                :command="{name:'editPublicInfo',data:scope.row}">编辑公示信息
                            </el-dropdown-item>
                            <el-dropdown-item
                                v-auth="{id: 10000010002}"
                                :disabled="!(scope.row.issueState===0 || scope.row.issueState===1 || scope.row.issueState===2 || scope.row.issueState===3 || scope.row.issueState===4)"
                                :command="{name:'edit',data:scope.row}">编辑信息
                            </el-dropdown-item>
                            <el-dropdown-item
                                v-auth="{id: 10000010004}"
                                :disabled="!(scope.row.issueState===0 || scope.row.issueState===1 || scope.row.issueState===2 || scope.row.issueState===3 || scope.row.issueState===4)"
                                :command="{name:'setListingFee',data:scope.row}">
                                设置上市费用
                            </el-dropdown-item>
                            <el-dropdown-item
                                v-auth="{id: 10000010005}"
                                :disabled="!(scope.row.issueState===1 && scope.row.payState===0)"
                                :command="{name:'marginPaid',data:scope.row}">已支付保证金
                            </el-dropdown-item>
                            <el-dropdown-item
                                v-auth="{id: 10000010006}"
                                :disabled="!(scope.row.issueState===1 && scope.row.payState===1)"
                                :command="{name:'startPresale',data:scope.row}">开始预售
                            </el-dropdown-item>
                            <el-dropdown-item
                                v-auth="{id: 10000010007}"
                                :disabled="!(scope.row.issueState===4 && scope.row.payState===1)"
                                :command="{name:'completeRelease',data:scope.row}">完成发行
                            </el-dropdown-item>
                            <el-dropdown-item
                                v-auth="{id: 10000010008}"
                                :disabled="!((scope.row.issueState===1||scope.row.issueState===2||scope.row.issueState===3||scope.row.issueState===4||scope.row.issueState===5) && scope.row.payState===1)"
                                :command="{name:'cancelRelease',data:scope.row}">取消发行
                            </el-dropdown-item>
                            <el-dropdown-item
                                v-auth="{id: 10000010009}"
                                :disabled="!((scope.row.issueState===6||scope.row.issueState===7) && scope.row.payState===1)"
                                :command="{name:'marginRefund',data:scope.row}">保证金退款
                            </el-dropdown-item>
                            <el-dropdown-item
                                v-auth="{id: 10000010010}"
                                :disabled="!(scope.row.issueState===7)"
                                :command="{name:'presaleRefund',data:scope.row}">预售退款
                            </el-dropdown-item>
                            <el-dropdown-item
                                v-auth="{id: 10000010011}"
                                :disabled="!((scope.row.issueState===0&&scope.row.payState===0)||(scope.row.issueState===7&&(scope.row.payState===0||scope.row.payState===2))||(scope.row.issueState===1&&(scope.row.payState===0||scope.row.payState===2)))"
                                :command="{name:'delete',data:scope.row}">删除
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>

        <!-- 编辑公示信息 -->
        <el-dialog class="publicInfo-box" v-el-drag-dialog :visible.sync="dialogeditPublicInfo"
                   :close-on-click-modal="false" :show-close="false" title="编辑公示信息">
            <i class="el-icon-close closePublicInfo" @click="closePublicInfo"></i>
            <!--富文本-->
            <el-tabs v-model="publicInfoLang" type="card" :before-leave="beforeleaveLang">
                <el-tab-pane label="简体中文" name="zh_CN"></el-tab-pane>
                <el-tab-pane label="繁體中文" name="zh_TW"></el-tab-pane>
                <el-tab-pane label="English" name="en_US"></el-tab-pane>
            </el-tabs>
            <div class="tinymce-box">
                <div class="tinymce">
                    <tinymce ref="editerZh" v-model="projectPublicInfo" :height="300"/>
                </div>
            </div>
            <div class="btns">
                <el-button class="publicInfo-save" size="small" type="primary" @click="savePublicInfoData"
                           :loading="subLoading">保&emsp;&nbsp;存
                </el-button>
            </div>
        </el-dialog>
        <el-dialog v-el-drag-dialog :visible.sync="dialogsetListingFeeShow" @close="closeDialog"
                   :close-on-click-modal="false" title="设置上市费用">
            <el-form :inline="true" ref="setListingFee" :rules="setListingFeeRules" :model="setListingFeeData"
                     status-icon label-width="100px">
                <el-form-item label="数量" prop="paymentPrice">
                    <el-input min="0" v-model="setListingFeeData.paymentPrice"/>
                </el-form-item>
                <el-form-item label="币种" prop="paymentCurId">
                    <el-select v-model="setListingFeeData.paymentCurId" placeholder="币种">
                        <el-option
                            v-for="item in currencyList"
                            :key="item.id"
                            :label="item.code"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="width: 100%;text-align: center;">
                    <el-button type="primary" @click="setListingFee" :loading="subLoading">确定</el-button>
                    <!--<el-button @click="closeDialog">取消</el-button>-->
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog v-el-drag-dialog :visible.sync="dialogMarginPaidShow" @close="closeDialog"
                   :close-on-click-modal="false" title="支付保证金">
            <el-form :inline="true" ref="dialogMarginPaid" :rules="dialogMarginPaidRules" :model="marginPaidData"
                     status-icon label-width="100px">
                <el-form-item label="数量" prop="curPrice">
                    <el-input min="0" v-model="marginPaidData.curPrice"/>
                </el-form-item>
                <el-form-item label="币种" prop="curId">
                    <el-select v-model="marginPaidData.curCode" placeholder="币种" @change="getCurrencyBalance">
                        <el-option
                            v-for="item in digitalCurrencyList"
                            :key="item.curId"
                            :label="item.curName"
                            :value="item.curName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="uid" prop="uid">
                    {{operatingData.issueUserCode}}
                </el-form-item>
                <el-form-item label="余额" prop="balance">
                    {{CurrencyBalance}}
                </el-form-item>
                <el-form-item style="width: 100%;text-align: center;">
                    <el-button type="primary" @click="marginPaid" :loading="subLoading">确定</el-button>
                    <!--<el-button @click="closeDialog">取消</el-button>-->
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog v-el-drag-dialog :visible.sync="dialogReleaseShow" @close="closeDialog" :close-on-click-modal="false"
                   :title="releaseTitle">
            <p v-if="releaseTitle === '开始预售'">
                请仔细核对发行内容：项目名称：{{operatingData.name}}。总价：{{operatingData.totalPrice}} {{operatingData.priceCurCode}}。
                租金收益：{{operatingData.prospectiveYield}}。面积：{{operatingData.measure}}。通证数量：{{operatingData.totalAmount}}。
                通证价格：{{operatingData.convertPrice}}
                {{operatingData.curCode}}。预售时间：{{substr(getZoneTime(operatingData.planStartTime))}}
                - {{substr(getZoneTime(operatingData.planEndTime))}}
            </p>
            <p v-if="releaseTitle === '完成发行'">通证将立即发放。其中发行方收到{{releaseTable.receiveAmount}}
                份，投资者共{{releaseTable.investUserAmount}}人，
                一共收到{{releaseTable.saleAmount}} 份。发行方收到{{releaseTable.saleCurPrice}}
                {{releaseTable.saleCurCode}}。是否确定</p>
            <el-table stripe
                      v-if="releaseTitle !== '开始预售'"
                      :data="dialogreleaseListData"
                      height="350"
                      style="width: 100%">
                <el-table-column
                    label="uid"
                    prop="userCode">
                </el-table-column>
                <el-table-column
                    label="认购数量"
                    prop="ptTotalAmount">
                </el-table-column>
                <el-table-column
                    label="支付数量"
                    prop="curAmount">
                </el-table-column>
                <el-table-column
                    label="支付币种"
                    prop="curCode">
                </el-table-column>
                <el-table-column
                    label="状态">
                    <template slot-scope="props">
                        {{ investmentState(props.row.state) }}
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-if="releaseTitle !== '开始预售'" v-show="Releasetotal>0" :total="Releasetotal"
                        :page.sync="ReleasepageNum" :limit.sync="ReleasepageSize"
                        @pagination="completeReleaseTableData"/>
            <div class="btns">
                <el-button size="medium" @click="closeDialog">取消</el-button>
                <el-button size="medium" type="primary" @click="submitRelease" :loading="subLoading">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog v-el-drag-dialog :visible.sync="dialogMarginRefundMsgShow" :close-on-click-modal="false"
                   title="保证金退款">
            <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="UID">
                    <span>{{ MarginRefundMsgData.userCode }}</span>
                </el-form-item>
                <el-form-item label="姓氏">
                    <span>{{ MarginRefundMsgData.familyName?MarginRefundMsgData.familyName:'-' }}</span>
                </el-form-item>
                <el-form-item label="名字">
                    <span>{{ MarginRefundMsgData.selfName?MarginRefundMsgData.selfName:'-' }}</span>
                </el-form-item>
                <el-form-item label="手机号码">
                    <span>{{ MarginRefundMsgData.mobile }}</span>
                </el-form-item>
                <el-form-item label="电子邮箱">
                    <span>{{ MarginRefundMsgData.email }}</span>
                </el-form-item>
                <el-form-item label="钱包地址">
                    <span>{{ MarginRefundMsgData.address }}</span>
                </el-form-item>
                <el-form-item style="width: 100%;text-align: center;">
                    <el-button type="primary" @click="openMarginRefundDialog">下一步</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog v-el-drag-dialog :visible.sync="dialogMarginRefundShow" @close="closeDialog"
                   :close-on-click-modal="false" title="保证金退款">
            <p>退款立即到账，此操作不可撤销，请仔细核对。成功后将通知发行方退款成功</p>
            <el-form ref="dialogMarginRefund" :rules="dialogMarginRefundRules" :model="marginRefundDatainput"
                     status-icon label-width="100px">
                <el-form-item label="已支付" prop="paid">
                    {{marginRefundData.curPrice}} {{marginRefundData.curCode}}
                </el-form-item>
                <el-form-item label="退款" prop="refundPrice">
                    <el-input min="0" v-model="marginRefundDatainput.refundPrice">
                        <template slot="append">{{marginRefundData.curCode}}</template>
                    </el-input>
                </el-form-item>
            </el-form>
            <div class="btns">
                <el-button size="medium" @click="closeDialog">取消</el-button>
                <el-button size="medium" type="primary" @click="marginRefund" :loading="subLoading">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog v-el-drag-dialog :visible.sync="dialogPresaleRefundShow" @close="closeDialog"
                   :close-on-click-modal="false" title="预售退款">
            <el-alert
                type="warning"
                style="margin-bottom: 12px;"
                description="由于程序限制，勾选全部并不会为你展示所有勾选项，但我们会为你展示勾选后的总数，敬请谅解">
            </el-alert>
            <el-checkbox v-model="PresaleRefundCheckAll">全部<span v-if="PresaleRefundCheckAll">(已选中当前项目全部共{{presaleRefundtotal}}条数据)</span>
            </el-checkbox>
            <el-table stripe
                      @selection-change="handleSelectionChange"
                      :data="dialogPresaleRefundData"
                      style="width: 100%"
                      max-height="500">
                <el-table-column
                    type="selection"
                    width="30">
                </el-table-column>
                <el-table-column
                    label="uid"
                    prop="userCode">
                </el-table-column>
                <el-table-column
                    label="认购数量"
                    prop="ptTotalAmount">
                </el-table-column>
                <el-table-column
                    label="支付数量"
                    prop="curAmount">
                </el-table-column>
                <el-table-column
                    label="支付币种"
                    prop="curCode">
                </el-table-column>
                <el-table-column
                    label="状态">
                    <template slot-scope="props">
                        {{ investmentState(props.row.state) }}
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="presaleRefundtotal>0"
                        :total="presaleRefundtotal"
                        :page.sync="presaleRefundpageNum"
                        :limit.sync="presaleRefundpageSize"
                        @pagination="getPresaleRefundData"/>
            <div class="btns">
                <el-button size="medium" @click="closeDialog">取消</el-button>
                <el-button size="medium" type="primary" @click="PresaleRefundSubmint" :loading="subLoading">退款
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        marginPaid,
        getPaymentData,
        postPaymentData,
        getMarginPaidData,
        startPresale,
        completeReleaseTableData,
        completeReleaseStatistics,
        completeRelease,
        cancelRelease,
        getMarginRefundData,
        marginRefund,
        MarginRefundMsg,
        getPresaleRefundData,
        presaleRefundAll,
        presaleRefundSection,
        deleteRelease,
        getCurrencyList,
        getCurrencyBalance,
        getPublicInfo,
        savePublicInfo,
        getWalletCurrency
    } from '@/api/pass-issued/release'
    import elDragDialog from '@/directives/el-dragDialog'
    import {fractionalformat} from '@/utils/validate'
    import Pagination from '@/components/Pagination'
    import Tinymce from '@/components/Tinymce'

    export default {
        directives: {elDragDialog},
        props: {
            // 列表数据
            releaseList: {
                type: Array,
                default: []
            }
        },
        data () {
            const MarginPaidcurPriceRule = (rule, value, callback) => {
                if (value === '') {
                    return callback(new Error('请输入正确的数量'))
                } else if (!(/^-?[1-9]+(\.\d+)?$|^-?0(\.\d+)?$|^-?[1-9]+[0-9]*(\.\d+)?$/.test(value))) {
                    return callback(new Error('请输入正确的数量'))
                } else if (!fractionalformat(value)) {
                    return callback(new Error('请输入正确的数量'))
                } else {
                    return callback()
                }
            }
            return {
                // 列表数据
                listData: this.releaseList,
                // 控制编辑公示信息弹窗显示
                dialogeditPublicInfo: false,
                // 控制设置上市费用弹窗显示
                dialogsetListingFeeShow: false,
                // 控制支付保证金弹窗显示
                dialogMarginPaidShow: false,
                // 控制开始预售、完成发行、取消发行弹框显示
                dialogReleaseShow: false,
                // 控制保证金退款前信息确认弹框显示
                dialogMarginRefundMsgShow: false,
                // 控制保证金退款弹框显示
                dialogMarginRefundShow: false,
                // 控制预售退款弹窗显示
                dialogPresaleRefundShow: false,
                // 弹窗表单提交时等待状态
                subLoading: false,
                // 设置上市费用弹窗数据
                setListingFeeData: {
                    paymentPrice: '',
                    paymentCurId: ''
                },
                // 支付保证金弹窗数据
                marginPaidData: {
                    curPrice: '',
                    curId: '',
                    curCode: ''
                },
                // 单用户单币种余额
                CurrencyBalance: '',
                // 法币币种列表
                currencyList: [],
                // 数字货币币种列表
                digitalCurrencyList: [],
                // 开始预售、完成发行、取消发行弹框title
                releaseTitle: '',
                // 开始预售、完成发行、取消发行弹框表格数据
                dialogreleaseListData: [],
                // 开始预售、完成发行、取消发行弹框表格数据总数
                Releasetotal: 0,
                // 开始预售、完成发行、取消发行弹框表格数据当前页
                ReleasepageNum: 1,
                // 开始预售、完成发行、取消发行弹框表格数据limit
                ReleasepageSize: 10,
                // 完成发行弹框统计数据
                releaseTable: {},
                // 保证金退款前信息确认数据
                MarginRefundMsgData: {
                    userCode: '',
                    familyName: '',
                    selfName: '',
                    mobile: '',
                    email: '',
                    address: ''
                },
                // 保证金退款弹窗数据
                marginRefundData: {},
                // 保证金退款填写数据
                marginRefundDatainput: {
                    refundPrice: ''
                },
                // 预售退款数据
                dialogPresaleRefundData: [],
                // 预售退款分页总条数
                presaleRefundtotal: 1,
                // 预售退款分页页码
                presaleRefundpageNum: 1,
                // 预售退款分页每页条数
                presaleRefundpageSize: 20,
                // 预售退款是否全选
                PresaleRefundCheckAll: false,
                // 预售退款选中项的userID集合
                refundUserIds: [],
                // 预售退款选中项数据集合，用于跳页数据勾选恢复
                refundSelectedItems: [],
                // 当前操作通证条目数据
                operatingData: {},
                // 项目公示信息（富文本）
                projectPublicInfo: '',
                // 项目公示信息，比较使用
                projectPublicInfoBackup: '',
                // 项目公示信息国际化
                publicInfoLang: 'zh_CN',
                // 设置上市费用验证规则
                setListingFeeRules: {
                    paymentPrice: [
                        {validator: MarginPaidcurPriceRule, trigger: ['blur', 'change']}
                    ],
                    paymentCurId: {required: true, message: '请选择币种', trigger: 'change'}
                },
                // 支付保证金验证规则
                dialogMarginPaidRules: {
                    curPrice: [
                        {validator: MarginPaidcurPriceRule, trigger: ['blur', 'change']}
                    ],
                    curId: {required: true, message: '请选择币种', trigger: 'change'}
                },
                // 保证金退款验证规则
                dialogMarginRefundRules: {
                    refundPrice: [
                        {validator: MarginPaidcurPriceRule, trigger: ['blur', 'change']}
                    ]
                }
            }
        },
        methods: {
            /**
             * 编辑下拉框选项对应操作判断
             * @param command 下拉菜单选项对应数据
             */
            handleCommand (command) {
                this.operatingData = command.data
                switch (command.name) {
                // 查看通证详情
                case 'show':
                    this.$router.push({
                        path: '/passissued/releasedetails',
                        query: {projectId: this.operatingData.projectId}
                    })
                    break
                    // 编辑通证详情
                case 'edit':
                    this.$router.push({
                        path: '/passissued/editrelease',
                        query: {
                            projectId: this.operatingData.projectId,
                            issueState: this.operatingData.issueState,
                            payState: this.operatingData.payState
                        }
                    })
                    break
                    // 编辑公示信息
                case 'editPublicInfo':
                    this.dialogeditPublicInfo = true
                    this.getPublicInfoData()
                    break
                    // 设置上市费用
                case 'setListingFee':
                    this.dialogsetListingFeeShow = true
                    this.getPaymentData()
                    break
                    // 已支付保证金
                case 'marginPaid':
                    this.dialogMarginPaidShow = true
                    this.getMarginPaidData()
                    break
                    // 开始预售
                case 'startPresale':
                    this.releaseTitle = '开始预售'
                    this.dialogReleaseShow = true
                    this.completeReleaseTableData()
                    break
                    // 完成发行
                case 'completeRelease':
                    this.releaseTitle = '完成发行'
                    this.dialogReleaseShow = true
                    this.completeReleaseStatistics()
                    break
                    // 取消发行
                case 'cancelRelease':
                    this.releaseTitle = '取消发行'
                    this.dialogReleaseShow = true
                    this.completeReleaseTableData()
                    break
                    // 保证金退款
                case 'marginRefund':
                    this.dialogMarginRefundMsgShow = true
                    this.MarginRefundMsg()
                    break
                    // 预售退款
                case 'presaleRefund':
                    this.dialogPresaleRefundShow = true
                    this.getPresaleRefundData()
                    break
                case 'delete':
                    this.deleteRelease()
                    break
                }
            },
            /**
             *  去除table外层div
             *  @param str 富文本字符串
             */
            removeDiv (str) {
                let introduce = str
                // 去除table外层div
                introduce = introduce.replace(new RegExp('<div data-onlytablewidth="800" style="max-width: 800px;overflow-x: auto;">', 'g'), '')
                introduce = introduce.replace(/<\/table><\/div>/g, '</table>')
                // 优化a标签字体蓝色
                introduce = introduce.replace(/<a style="color: #2ea9df" href=/g, '<a href=')
                // 优化图片路径
                introduce = introduce.replace(/src="\/public/g, 'src="public')
                this.getinfo = true
                this.projectPublicInfo = introduce
                this.projectPublicInfoBackup = introduce
                this.$refs['editerZh'].setContent('')
                this.$refs['editerZh'].setContent(introduce)
            },
            // 获取项目公示信息
            getPublicInfoData () {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    locale: this.publicInfoLang,
                    data: {
                        projectId: this.operatingData.projectId
                    }
                }
                getPublicInfo(params).then(res => {
                    if (res.code.toString() === '0') {
                        if (res.data) {
                            this.removeDiv(res.data.publicContent)
                        }
                    }
                })
            },
            // 保存项目公示信息
            savePublicInfoData () {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    locale: this.publicInfoLang,
                    data: {
                        projectId: this.operatingData.projectId,
                        publicContent: this.projectPublicInfo,
                        updateTime: Math.round(new Date() / 1000),
                        createTime: Math.round(new Date() / 1000)
                    }
                }
                // 优化图片路径
                params.data.publicContent = params.data.publicContent.replace(new RegExp('src="public', 'g'), 'src="/public')
                let width = 800
                // 优化复制的表格没有边框
                params.data.publicContent = params.data.publicContent.replace(/<table>/g, '<table style="border-collapse: collapse; width: 100%;" border="1">')
                // 优化表格超宽处理
                params.data.publicContent = params.data.publicContent.replace(/<table/g, '<div data-onlytablewidth="' + width + '" style="max-width: ' + width + 'px;overflow-x: auto;"><table')
                params.data.publicContent = params.data.publicContent.replace(/<\/table>/g, '</table></div>')
                // 优化a标签字体蓝色
                params.data.publicContent = params.data.publicContent.replace(/<a href=/g, '<a style="color: #2ea9df" href=')
                this.subLoading = true
                savePublicInfo(params).then(res => {
                    this.subLoading = false
                    if (res.code.toString() === '0') {
                        this.projectPublicInfoBackup = this.projectPublicInfo
                        this.$message.success('保存成功')
                    } else {
                        this.$message.error(res.msg)
                    }
                }).catch(() => {
                    this.subLoading = false
                })
            },
            /**
             *  选择项目公示信息语言
             *  @param activeName 选中的标签页name
             *  @param oldActiveName 现在的标签页name
             */
            beforeleaveLang (activeName, oldActiveName) {
                if (this.projectPublicInfo !== this.projectPublicInfoBackup) {
                    return this.$confirm('当前页面还未保存，如果离开，更改的内容将会丢失。', '确认信息', {
                        confirmButtonText: '离开',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                        .then(() => {
                            this.publicInfoLang = activeName
                            this.projectPublicInfo = ''
                            this.projectPublicInfoBackup = ''
                            this.getPublicInfoData()
                        })
                        .catch()
                } else {
                    this.publicInfoLang = activeName
                    this.projectPublicInfo = ''
                    this.projectPublicInfoBackup = ''
                    this.getPublicInfoData()
                }
            },
            // 重置公示信息
            resetpublicInfo () {
                this.publicInfoLang = 'zh_CN'
                this.projectPublicInfo = ''
                this.projectPublicInfoBackup = ''
                if (this.$refs['editerZh']) {
                    this.$refs['editerZh'].setContent('')
                }
            },
            // 关闭公示信息编辑
            closePublicInfo () {
                if (this.projectPublicInfo !== this.projectPublicInfoBackup) {
                    return this.$confirm('当前页面还未保存，如果关闭，更改的内容将会丢失。', '确认信息', {
                        confirmButtonText: '关闭',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                        .then(() => {
                            this.closeDialog()
                        })
                        .catch()
                } else {
                    this.closeDialog()
                }
            },
            // 获取上市费用
            getPaymentData () {
                let formData = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        projectId: this.operatingData.projectId
                    }
                }
                getPaymentData(formData).then(res => {
                    if (res.code.toString() === '0') {
                        this.setListingFeeData = res.data
                        this.getCurrencyList()
                    } else {
                        this.$refs.setListingFee.resetFields()
                        this.getCurrencyList()
                    }
                })
            },
            // 修改上市费用弹框数据提交
            setListingFee () {
                this.$refs['setListingFee'].validate((valid) => {
                    if (valid) {
                        let selCur = {}
                        for (let i = 0; i < this.currencyList.length; i++) {
                            if (this.setListingFeeData.paymentCurId === this.currencyList[i].id) {
                                selCur = this.currencyList[i]
                            }
                        }
                        let formData = {
                            traceId: Math.random().toString(36).substr(2),
                            data: {
                                projectId: this.operatingData.projectId,
                                paymentPrice: this.setListingFeeData.paymentPrice,
                                paymentCurId: this.setListingFeeData.paymentCurId,
                                paymentCurCode: selCur.code
                            }
                        }
                        this.subLoading = true
                        postPaymentData(formData).then(res => {
                            if (res.code.toString() === '0') {
                                this.$message.success('保存成功')
                            } else {
                                this.$message({
                                    message: res.msg,
                                    type: 'error'
                                })
                            }
                            this.subLoading = false
                            this.dialogsetListingFeeShow = false
                        })
                    } else {
                        return false
                    }
                })
            },
            // 获取已支付保证金数据
            getMarginPaidData () {
                let formData = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        projectId: this.operatingData.projectId
                    }
                }
                getMarginPaidData(formData).then(res => {
                    if (res.code.toString() === '0') {
                        this.marginPaidData = res.data
                        this.getCurrencyBalance()
                        this.getDigitalCurrencyList()
                    } else {
                        this.$refs.dialogMarginPaid.resetFields()
                        this.getDigitalCurrencyList()
                    }
                })
            },
            // 获取单用户单币种
            getCurrencyBalance (val) {
                let formData = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        bizAccountId: this.marginPaidData.userAccountId,
                        currency: this.marginPaidData.curCode
                    }
                }
                getCurrencyBalance(formData).then(res => {
                    this.CurrencyBalance = res.data.balance
                })
            },
            // 已支付保证金弹框数据提交
            marginPaid () {
                this.$refs['dialogMarginPaid'].validate((valid) => {
                    if (valid) {
                        let selCur = {}
                        for (let i = 0; i < this.digitalCurrencyList.length; i++) {
                            if (this.marginPaidData.curCode === this.digitalCurrencyList[i].code) {
                                selCur = this.digitalCurrencyList[i]
                            }
                        }
                        let formData = {
                            traceId: Math.random().toString(36).substr(2),
                            data: {
                                projectId: this.operatingData.projectId,
                                curPrice: this.marginPaidData.curPrice,
                                curId: selCur.curId,
                                curCode: this.marginPaidData.curCode
                            }
                        }
                        this.subLoading = true
                        marginPaid(formData).then(res => {
                            if (res.code.toString() === '0') {
                                this.$message.success('保存成功')
                            } else {
                                this.$message.error(res.msg)
                            }
                            this.subLoading = false
                            this.dialogMarginPaidShow = false
                            this.$emit('getList')
                        })
                    } else {
                        return false
                    }
                })
            },
            // 开始、完成、取消发行弹窗提交数据方法
            submitRelease () {
                switch (this.releaseTitle) {
                case '开始预售':
                    this.startPresale()
                    break
                case '完成发行':
                    this.completeRelease()
                    break
                case '取消发行':
                    this.cancelRelease()
                    break
                }
            },
            // 开始、完成、取消发行弹窗获取表格数据方法
            completeReleaseTableData () {
                let formData = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        pageNum: this.ReleasepageNum,
                        pageSize: this.ReleasepageSize,
                        filter: {
                            projectId: this.operatingData.projectId
                        }
                    }
                }
                completeReleaseTableData(formData).then(res => {
                    this.dialogreleaseListData = res.data.list
                    this.ReleasepageNum = res.data.pageNum
                    this.ReleasepageSize = res.data.pageSize
                    this.Releasetotal = res.data.total
                })
            },
            // 开始预售
            startPresale () {
                let formData = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        projectId: this.operatingData.projectId
                    }
                }
                this.subLoading = true
                startPresale(formData).then(res => {
                    if (res.code.toString() === '0') {
                        this.$message.success('保存成功')
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'error'
                        })
                    }
                    this.subLoading = false
                    this.dialogReleaseShow = false
                    this.$emit('getList')
                })
            },
            // 获取完成发行统计信息
            completeReleaseStatistics () {
                let formData = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        projectId: this.operatingData.projectId
                    }
                }
                completeReleaseStatistics(formData).then(res => {
                    this.releaseTable = res.data
                    this.completeReleaseTableData()
                })
            },
            // 完成发行
            completeRelease () {
                let formData = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        projectId: this.operatingData.projectId
                    }
                }
                this.subLoading = true
                completeRelease(formData).then(res => {
                    if (res.code.toString() === '0') {
                        this.$message.success('保存成功')
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'error'
                        })
                    }
                    this.subLoading = false
                    this.dialogReleaseShow = false
                    this.$emit('getList')
                })
            },
            // 取消发行
            cancelRelease () {
                let formData = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        projectId: this.operatingData.projectId
                    }
                }
                this.subLoading = true
                cancelRelease(formData).then(res => {
                    if (res.code.toString() === '0') {
                        this.$message.success('保存成功')
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'error'
                        })
                    }
                    this.subLoading = false
                    this.dialogReleaseShow = false
                    this.$emit('getList')
                })
            },
            // 获取保证金退款用户信息相关数据
            MarginRefundMsg () {
                let formData = {
                    traceId: Math.random().toString(36).substr(2),
                    data: this.operatingData.issueUserId
                }
                MarginRefundMsg(formData).then(res => {
                    this.MarginRefundMsgData = res.data
                })
            },
            // 打开保证金退款弹窗
            openMarginRefundDialog () {
                this.dialogMarginRefundMsgShow = false
                this.dialogMarginRefundShow = true
                this.getMarginRefundData()
            },
            // 获取保证金退款相关数据
            getMarginRefundData () {
                let formData = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        projectId: this.operatingData.projectId
                    }
                }
                getMarginRefundData(formData).then(res => {
                    this.marginRefundData = res.data
                })
            },
            // 保证金退款
            marginRefund () {
                this.$refs['dialogMarginRefund'].validate((valid) => {
                    if (valid) {
                        let formData = {
                            traceId: Math.random().toString(36).substr(2),
                            data: {
                                projectId: this.operatingData.projectId,
                                refundPrice: this.marginRefundDatainput.refundPrice
                            }
                        }
                        this.subLoading = true
                        marginRefund(formData).then(res => {
                            if (res.code.toString() === '0') {
                                this.$message.success('退款成功')
                                this.refundPrice = ''
                            } else {
                                this.$message({
                                    message: res.msg,
                                    type: 'error'
                                })
                            }
                            this.subLoading = false
                            this.marginRefundDatainput.refundPrice = ''
                            this.dialogMarginRefundShow = false
                            this.$emit('getList')
                        })
                    } else {
                        return false
                    }
                })
            },
            // 获取预售退款相关数据
            getPresaleRefundData () {
                let formData = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        pageNum: this.presaleRefundpageNum,
                        pageSize: this.presaleRefundpageSize,
                        filter: {
                            projectId: this.operatingData.projectId
                        }
                    }
                }
                getPresaleRefundData(formData).then(res => {
                    if (res.code.toString() === '0') {
                        this.presaleRefundpageNum = res.data.pageNum
                        this.presaleRefundpageSize = res.data.pageSize
                        this.presaleRefundtotal = res.data.total
                        this.dialogPresaleRefundData = res.data.list
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'error'
                        })
                    }
                })
            },
            /**
             * 获取预售退款弹窗table数据选中变化
             * @param val 勾选项对应数据集合
             */
            handleSelectionChange (val) {
                this.refundSelectedItems[this.presaleRefundpageNum - 1] = val
            },
            // 提交预售退款
            PresaleRefundSubmint () {
                if (this.PresaleRefundCheckAll) {
                    this.presaleRefundAll()
                } else {
                    this.presaleRefundSection()
                }
            },
            // 预售退款-全部
            presaleRefundAll () {
                let formData = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        projectId: this.operatingData.projectId
                    }
                }
                presaleRefundAll(formData).then(res => {
                    if (res.code.toString() === '0') {
                        this.$message.success('保存成功')
                        this.dialogPresaleRefundShow = false
                        this.dialogPresaleRefundData = []
                        this.$emit('getList')
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'error'
                        })
                    }
                })
            },
            // 预售退款-部分
            presaleRefundSection () {
                for (let i = 0; i < this.refundSelectedItems.length; i++) {
                    if (this.refundSelectedItems[i].length) {
                        for (let j = 0; j < this.refundSelectedItems[i].length; j++) {
                            this.refundUserIds.push(this.refundSelectedItems[i][j].userId)
                        }
                    }
                }
                let formData = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        projectId: this.operatingData.projectId,
                        userIds: this.refundUserIds
                    }
                }
                presaleRefundSection(formData).then(res => {
                    if (res.code.toString() === '0') {
                        this.$message.success('退款成功')
                        this.dialogPresaleRefundShow = false
                        this.dialogPresaleRefundData = []
                        this.$emit('getList')
                    } else {
                        if (res.code.toString() === '9994') {
                            this.$message({
                                message: '请选择需退款条目',
                                type: 'error'
                            })
                        } else {
                            this.$message({
                                message: res.msg,
                                type: 'error'
                            })
                        }
                    }
                })
            },
            // 删除通证
            deleteRelease () {
                let formData = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        projectId: this.operatingData.projectId
                    }
                }
                this.$confirm('删除后无法在前台或后台显示，但数据将被保留，是否继续？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteRelease(formData).then(res => {
                        if (res.code.toString() === '0') {
                            if (res.data.success) {
                                this.$message.success('删除成功')
                                this.$emit('getList')
                            } else {
                                this.$message.error('删除需保证发行状态为已取消，支付状态为未支付或已退款且已退还所有投资者认购数量时才能执行，请确认后重试')
                            }
                        } else {
                            this.$message({
                                message: res.msg,
                                type: 'error'
                            })
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            // 关闭弹窗
            closeDialog () {
                this.resetpublicInfo()
                this.dialogeditPublicInfo = false
                this.dialogMarginPaidShow = false
                this.dialogReleaseShow = false
                this.dialogMarginRefundShow = false
                this.dialogPresaleRefundShow = false
                this.subLoading = false
                this.releaseTitle = ''
                if (this.$refs.setListingFee) this.$refs.setListingFee.resetFields()
                if (this.$refs.dialogMarginPaid) this.$refs.dialogMarginPaid.resetFields()
            },
            // 获取数字货币列表
            getDigitalCurrencyList () {
                let formData = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        pageNum: 1,
                        pageSize: 0,
                        filter: {
                            state: '1',
                            neState: '0'
                        }
                    }
                }
                getWalletCurrency(formData).then(res => {
                    this.digitalCurrencyList = res.data.list
                })
            },
            // 获取法币列表
            getCurrencyList () {
                let formData = {
                    traceId: Math.random().toString(36).substr(2)
                }
                getCurrencyList(formData).then(res => {
                    this.currencyList = res.data
                })
            },
            // 判断返回发行状态
            matchIssueState (state) {
                switch (state) {
                case 0:
                    return '创建'
                case 1:
                    return '未发行'
                case 2:
                    return '等待预售'
                case 3:
                    return '开始预售'
                case 4:
                    return '预售完成'
                case 5:
                    return '预售失败'
                case 6:
                    return '已发行'
                case 7:
                    return '已取消'
                default:
                    break
                }
            },
            // 判断返回支付状态
            matchPayState (state) {
                switch (state) {
                case 0:
                    return '未支付'
                case 1:
                    return '已支付'
                case 2:
                    return '已退款'
                default:
                    break
                }
            },
            // 判断返回通证发放状态
            matchGiveState (state) {
                switch (state) {
                case 0:
                    return '未发放'
                case 1:
                    return '已发放'
                default:
                    break
                }
            },
            // 判断投资状态
            investmentState (state) {
                switch (state) {
                case 0:
                    return '投资成功'
                case 1:
                    return '已退款'
                case 2:
                    return '投资完成'
                default:
                    break
                }
            },
            // 截取时间字符串
            substr (str) {
                let newStr = str.substring(0, 16)
                return newStr
            }
        },
        components: {
            Pagination,
            Tinymce
        }
    }
</script>

<style lang="scss" scoped>
    .editDropdown {
        cursor: pointer;
        text-align: center;
    }

    .btns {
        margin-top: 25px;
        text-align: center;
    }

    .pagination-container {
        padding: 8px;
    }

    .publicInfo-box {
        .closePublicInfo {
            position: absolute;
            top: 20px;
            right: 20px;
            color: #909399;
            font-size: 16px;
            cursor: pointer;
            &:hover {
                color: rgb(59, 170, 223);
            }
        }
        .tinymce-box {
            width: 100%;
            overflow-x: auto;
            .tinymce {
                width: 800px;
            }
        }
        .publicInfo-save {
            width: 100px;
        }
    }
</style>
