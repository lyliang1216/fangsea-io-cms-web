<template>
    <div class="app-container">
        <el-form :inline="true" ref="filter" :model="filter" class="filter-form-inline">
            <el-form-item label="UID" prop="userCode">
                <el-input v-model="filter.userCode" size="small" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="姓氏" prop="familyName">
                <el-input v-model="filter.familyName" size="small" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="名字" prop="selfName">
                <el-input v-model="filter.selfName" size="small" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="国籍" prop="nationality">
                <el-select v-model="filter.nationality" clearable filterable size="small" placeholder="">
                    <el-option
                        v-for="item in nationalitylist"
                        :key="item.regionId"
                        :label="item.localName"
                        :value="item.regionId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="护照号" prop="passportNo">
                <el-input v-model="filter.passportNo" size="small" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="Email" prop="email">
                <el-input v-model="filter.email" size="small" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="filter.mobile" size="small" placeholder=""></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getkycData" size="small">搜索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button @click="resetForm" size="small">重置</el-button>
            </el-form-item>
        </el-form>
        <div class="mytabs">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane :label="'未审核('+ tabs1 +')'" name="first-0"></el-tab-pane>
                <el-tab-pane :label="'未通过('+ tabs2 +')'" name="second-1"></el-tab-pane>
                <el-tab-pane :label="'已通过('+ tabs3 +')'" name="third-2"></el-tab-pane>
                <el-tab-pane :label="'全部('+ tabs4 +')'" name="fourth-3"></el-tab-pane>
            </el-tabs>
            <el-button class="deltable" size="small" @click="deltabletr" v-auth="{id: 10100020002}" type="primary">删除
            </el-button>
        </div>
        <el-table
            :data="tableData"
            :row-key='getRowKeys'
            :expand-row-keys="expands"
            @selection-change="selecttr"
            @expand-change="expandchange"
            stripe
            style="width: 100%">
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column type="expand">
                <template slot-scope="props">
                    <!--展开行-->
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="姓氏：">
                            <span>{{props.row.familyName}}</span>
                        </el-form-item>
                        <el-form-item label="名字：">
                            <span>{{props.row.selfName}}</span>
                        </el-form-item>
                        <el-form-item label="性别：">
                            <span>{{props.row.sex }}</span>
                        </el-form-item>
                        <el-form-item label="国籍：">
                            <span>{{props.row.nationalityName}}</span>
                        </el-form-item>
                        <el-form-item label="护照号：">
                            <span>{{props.row.passportNo}}</span>
                        </el-form-item>
                        <el-form-item label="创建时间：">
                            <span>{{props.row.createTime | getZoneTime}}</span>
                        </el-form-item>
                        <el-form-item label="更新时间：">
                            <span>{{props.row.updateTime | getZoneTime}}</span>
                        </el-form-item>
                        <el-form-item label="uid：">
                            <span>{{props.row.userCode}}</span>
                        </el-form-item>
                        <el-form-item label="手机：">
                            <span v-if="props.row.mobile">{{'+' + props.row.areaCode + ' ' + props.row.mobile}}</span>
                        </el-form-item>
                        <el-form-item label="出生日期：">
                            <span>{{props.row.birthday | parseTime('{y}-{m}-{d}')}}</span>
                        </el-form-item>
                        <el-form-item label="邮编：">
                            <span></span>
                        </el-form-item>
                        <el-form-item label="注册时间：">
                            <span v-if="props.row.registerTime">{{props.row.registerTime | getZoneTime}}</span>
                        </el-form-item>
                        <el-form-item label="注册IP：">
                            <span>{{props.row.ip}}</span>
                        </el-form-item>
                        <el-form-item label="护照有效期至：">
                            <span>{{substr(getZoneTime(props.row.passportEndTime))}}</span>
                        </el-form-item>
                        <el-form-item label="审核状态：">
                            <span>{{props.row.auditState | getstate}}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <!--表头-->
            <el-table-column
                label="UID"
                width="80"
                prop="userCode">
            </el-table-column>
            <el-table-column
                width="120"
                label="姓氏"
                prop="familyName">
            </el-table-column>
            <el-table-column
                width="160"
                label="名字"
                prop="selfName">
            </el-table-column>
            <el-table-column
                width="160"
                label="国籍"
                prop="nationalityName">
            </el-table-column>
            <el-table-column
                width="140"
                label="护照号"
                prop="passportNo">
            </el-table-column>
            <el-table-column
                label="Email"
                prop="email">
            </el-table-column>
            <el-table-column
                width="160"
                label="手机号"
                prop="mobile">
                <template slot-scope="props">
                    <p v-if="props.row.mobile">{{'+' + props.row.areaCode + ' ' + props.row.mobile}}</p>
                </template>
            </el-table-column>
            <el-table-column
                label="创建时间"
                width="200px"
                prop="createTime">
                <template slot-scope="props">
                    <p>{{props.row.createTime | getZoneTime}}</p>
                </template>
            </el-table-column>
            <el-table-column
                label="更新时间"
                width="200px"
                prop="updateTime">
                <template slot-scope="props">
                    <p>{{props.row.updateTime | getZoneTime}}</p>
                </template>
            </el-table-column>
            <el-table-column
                width="80px"
                label="操作">
                <template slot-scope="props">
                    <a v-auth="{id: '10100020001'}" class="operate" href="javascript:;"
                       @click="edititem(props.row)">编辑</a>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="currentPage" :limit.sync="pageSize"
                    @pagination="getkyc"/>
        <!--弹框编辑审核-->
        <el-dialog title="编辑" :visible.sync="dialogTableVisible" :close-on-click-modal="false" width="40%">
            <table class="edititem">
                <tr>
                    <td>姓：</td>
                    <td>{{editinfo.familyName}}</td>
                </tr>
                <tr>
                    <td>名：</td>
                    <td>{{editinfo.selfName}}</td>
                </tr>
                <tr>
                    <td>国籍：</td>
                    <td>{{editinfo.nationalityName}}</td>
                </tr>
                <tr>
                    <td>护照号：</td>
                    <td>{{editinfo.passportNo}}</td>
                </tr>
                <tr>
                    <td>Email：</td>
                    <td>{{editinfo.email}}</td>
                </tr>
                <tr>
                    <td>手机号：</td>
                    <td><span v-if="editinfo.mobile">{{'+' + editinfo.areaCode + ' ' + editinfo.mobile}}</span></td>
                </tr>
                <tr>
                    <td>出生日期：</td>
                    <td>{{editinfo.birthday | parseTime('{y}-{m}-{d}')}}</td>
                </tr>
                <tr>
                    <td>护照有效期至：</td>
                    <td>
                        <el-date-picker
                            disabled
                            v-model="passportValidityDate"
                            type="date"
                            @change="checkPassport"
                            placeholder="选择日期"
                            format="yyyy - MM - dd"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                        <p v-if="passportValidityDateErr !== ''" v-html="passportValidityDateErr"></p>
                    </td>
                </tr>
                <tr>
                    <td>护照封面：</td>
                    <td><img :src="editinfo.passportCoverUrl" @click="opennew(editinfo.passportCoverUrl)" alt=""></td>
                </tr>
                <tr>
                    <td>护照个人信息页：</td>
                    <td><img :src="editinfo.passportInfoUrl" @click="opennew(editinfo.passportInfoUrl)" alt=""></td>
                </tr>
                <tr>
                    <td>审核状态：</td>
                    <td>{{editinfo.auditState | getstate}}</td>
                </tr>
                <tr>
                    <td>认证：</td>
                    <td>
                        <el-radio v-model="radio" label="2">通过</el-radio>
                        <el-radio v-model="radio" label="1">不通过</el-radio>
                    </td>
                </tr>
                <tr>
                    <td>审核信息：</td>
                    <td>
                        <el-input
                            type="textarea"
                            :rows="3"
                            :cols="50"
                            placeholder="如果认证不通过，必须填写审核信息"
                            v-model="editinfo.auditRemark">
                        </el-input>
                    </td>
                </tr>
            </table>
            <div class="btn">
                <el-button type="primary" size="small" @click="saveresult">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {getkyclist, delkyc, savekyc, getuserkyc, getuserinfo, getCountry} from '@/api/operation/certification'
    import Pagination from '@/components/Pagination'

    export default {
        data () {
            return {
                //  选项卡切换
                index: '0',
                //  选项卡初始
                activeName: 'first-0',
                tableData: [],
                //  审核编辑内容
                editinfo: [],
                // 弹出框显示
                dialogTableVisible: false,
                // 展开行集合
                expands: [],
                //  审核内容通过不通过
                radio: '',
                // 护照有效期
                passportValidityDate: '',
                // 护照有效期提示
                passportValidityDateErr: '',
                //  当前页
                currentPage: 1,
                //  总条数
                total: 0,
                //  每页显示数量
                pageSize: 10,
                //  要删除的内容
                deleterow: [],
                // 国籍列表
                nationalitylist: [],
                // 标签页上标条数
                tabs1: 0,
                tabs2: 0,
                tabs3: 0,
                tabs4: 0,
                // 编辑查询条件
                filter: {
                    userCode: '',
                    familyName: '',
                    selfName: '',
                    nationality: '',
                    passportNo: '',
                    email: '',
                    mobile: '',
                    auditState: '0',
                    // 排序降序
                    sort: 'desc'
                },
                // 使用的搜索条件
                filterSearch: {
                    userCode: '',
                    familyName: '',
                    selfName: '',
                    nationality: '',
                    passportNo: '',
                    email: '',
                    mobile: '',
                    auditState: '0',
                    // 排序降序
                    sort: 'desc'
                }
            }
        },
        mounted () {
            this.getkyc()
            this.getcountry()
        },
        methods: {
            /**
             * 点搜索
             */
            getkycData () {
                this.currentPage = 1
                this.filterSearch = JSON.parse(JSON.stringify(this.filter))
                this.getkyc()
            },
            /**
             *  切换列表类型
             *  @param tab 点击标签
             *  @param event 点击事件
             */
            handleClick (tab, event) {
                this.currentPage = 1
                this.filter = JSON.parse(JSON.stringify(this.filterSearch))
                this.filter.auditState = tab.index
                this.filterSearch.auditState = tab.index
                this.getkyc()
            },
            /**
             *  编辑审核
             *  @param row 编辑的行
             */
            edititem (row) {
                this.dialogTableVisible = true
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        id: row.id
                    }
                }
                // 获取用户信息
                getuserkyc(params).then(res => {
                    if (res.code.toString() === '0') {
                        let data = res.data
                        this.radio = res.data.auditState.toString()
                        this.editinfo = data
                        this.passportValidityDate = data.passportEndTime ? this.substr(this.getZoneTime(data.passportEndTime - 24 * 3600 + 1)) : ''
                        if (data.passportEndTime) {
                            this.checkPassport((data.passportEndTime - 24 * 3600 + 1) * 1000)
                        } else {
                            this.passportValidityDateErr = ''
                        }
                    }
                })
            },
            /**
             *  保存编辑审核
             */
            saveresult () {
                let data = JSON.parse(JSON.stringify(this.editinfo))
                data.auditState = this.radio
                if (data.auditState.toString() === '1' && data.auditRemark === '') {
                    this.$message.error('认证不通过需要填写审核信息')
                } else {
                    let params = {
                        traceId: Math.random().toString(36).substr(2),
                        data: {
                            id: data.id,
                            auditRemark: data.auditRemark,
                            auditState: data.auditState,
                            passportNo: data.passportNo
                        }
                    }
                    // 保存
                    savekyc(params).then(res => {
                        if (res.code.toString() === '0') {
                            this.radio = ''
                            this.editinfo = []
                            this.dialogTableVisible = false
                            this.$message.success('保存成功')
                            this.getkyc()
                        } else {
                            this.$message.error(res.msg)
                        }
                    }).catch(err => {
                        this.$message.error(err.msg)
                    })
                }
            },
            // 护照有效期剩余过期时间
            checkPassport (val) {
                let passDate = val / 1000 + 24 * 3600 - 1
                let nowDate = Date.parse(new Date()) / 1000
                if (passDate - nowDate < 0) {
                    this.passportValidityDateErr = '<span style="color: red;">此护照已过期</span>'
                } else {
                    this.passportValidityDateErr = '<span>还剩约' + ((passDate - nowDate) / 86400).toFixed(2) + '天过期</span>'
                }
            },
            /**
             *  查询所有信息，获取每个标签页条数
             */
            getlistnum () {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        canPage: false
                    }
                }
                getkyclist(params).then(res => {
                    if (res.code.toString() === '0') {
                        if (res.data) {
                            const data = res.data
                            this.tabs4 = data.total
                            this.getnum(res.data.list)
                        }
                    }
                })
            },
            /**
             *  根据状态获取条数
             *  @data 全部数据
             */
            getnum (data) {
                let s1 = 0
                let s2 = 0
                let s3 = 0
                data.forEach(item => {
                    switch (item.auditState.toString()) {
                    case '0':
                        s1 += 1
                        break
                    case '1':
                        s2 += 1
                        break
                    case '2':
                        s3 += 1
                        break
                    }
                })
                this.tabs1 = s1
                this.tabs2 = s2
                this.tabs3 = s3
            },
            /**
             *  获取国籍列表
             */
            getcountry () {
                let params = {
                    traceId: Math.random().toString(36).substr(2)
                }
                getCountry(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.nationalitylist = res.data
                    }
                })
            },
            /**
             *  审核列表查询
             */
            getkyc () {
                this.getlistnum()
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        pageNum: this.currentPage,
                        pageSize: this.pageSize,
                        filter: JSON.parse(JSON.stringify(this.filterSearch))
                    }
                }
                if (this.filter.auditState.toString() === '3') {
                    // 选择所有状态时不传
                    params.data.filter.canPage = true
                    params.data.filter.auditState = null
                }
                if (this.filter.auditState.toString() === '0') {
                    // 未审核排序为升序
                    params.data.filter.sort = null
                }
                params.data.filter = this.removeSpaces(params.data.filter)
                this.filter = this.removeSpaces(this.filter)
                getkyclist(params).then(res => {
                    if (res.code.toString() === '0') {
                        const data = res.data
                        this.tableData = data.list
                        this.total = data.total
                    }
                })
            },
            /**
             *  删除选中项
             */
            deltabletr () {
                if (this.deleterow.length === 0) {
                    this.$message.error('请先选中要删除的内容')
                } else {
                    this.$confirm('是否删除当前数据', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        // 选中项数组
                        let ids = []
                        this.deleterow.forEach(function (item, index) {
                            ids[index] = item.id
                        })
                        let params = {
                            traceId: Math.random().toString(36).substr(2),
                            data: {
                                ids: ids
                            }
                        }
                        delkyc(params).then(res => {
                            if (res.code.toString() === '0') {
                                this.$message.success('删除成功')
                                this.deleterow = []
                                this.getkyc()
                            }
                        })
                    })
                }
            },
            /**
             *  选中获取
             *  @param row 选中的行
             * */
            selecttr (row) {
                this.deleterow = row
            },
            /**
             * 获取table行key
             */
            getRowKeys (row) {
                return row.id
            },
            /**
             *  展开行时触发，每次只可展开一行
             *  @param row 展开的行
             * */
            expandchange (row, expandedRows) {
                if (expandedRows.length) {
                    this.expands = []
                    if (row) {
                        this.expands.push(row.id)
                        let params = {
                            traceId: Math.random().toString(36).substr(2),
                            data: row.userId
                        }
                        // 获取用户信息，设置展开内容
                        getuserinfo(params).then(res => {
                            if (res.code.toString() === '0') {
                                if (res.data) {
                                    row.ip = res.data.ip
                                    row.registerTime = res.data.registerTime
                                    row.sex = res.data.sex
                                }
                            }
                        })
                    }
                } else {
                    this.expands = []
                }
            },
            /**
             *  新开页查看图片
             */
            opennew (url) {
                window.open(url)
            },
            /**
             *  筛选条件重置
             */
            resetForm () {
                this.$refs.filter.resetFields()
                this.getkycData()
            },
            // 截取时间字符串
            substr (str) {
                let newStr = str.substring(0, 10)
                return newStr
            }
        },
        filters: {
            /**
             *  状态判断
             *  @param val 当前状态值
             */
            getstate (val) {
                switch (val) {
                case 0:
                    return '未审核'
                case 1:
                    return '未通过'
                case 2:
                    return '已通过'
                }
            }
        },
        components: {Pagination}
    }
</script>


<style scoped>
    .demo-table-expand {
        font-size: 0;
        padding-left: 20px;
    }

    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 25%;
    }

    .operate {
        color: #2ea9df;
    }

    .edititem td {
        font-size: 14px;
        color: #333;
    }

    .edititem td:nth-child(1) {
        width: 200px;
        line-height: 30px;
        text-align: right;
        padding-right: 8px;
        vertical-align: top;
    }

    .edititem td img {
        display: block;
        width: 200px;
        cursor: pointer;
    }

    .btn {
        margin-top: 15px;
        border-top: 1px solid #999;
    }

    .btn .el-button {
        display: block;
        margin: 15px auto 0;
        font-size: 14px;
        padding: 0 22px;
        line-height: 28px;
    }

    .pagination {
        margin-top: 30px;
        text-align: center;
    }

    .mytabs {
        position: relative;
    }

    .deltable {
        position: absolute;
        right: 0;
        top: 0;
    }

    .el-form-item__label {
        width: 120px;
        text-align: right;
    }

    .houseaddress {
        width: 80%;
    }

    .form-item-group {
        font-size: 16px;
        color: #46484c;
        line-height: 40px;
        margin: 0;
    }

    /deep/ .el-table td {
        padding: 0 !important;
    }
</style>
