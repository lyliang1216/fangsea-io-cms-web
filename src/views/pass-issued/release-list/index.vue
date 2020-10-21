<template>
    <div class="app-container">
        <el-form :inline="true" :model="searchFormData" class="demo-form-inline" ref="releaseSearch">
            <el-form-item label="编号" prop="number">
                <el-input v-model="searchFormData.number" size="small" placeholder="编号"></el-input>
            </el-form-item>
            <el-form-item label="ticker" prop="ticker">
                <el-input v-model="searchFormData.ticker" size="small" placeholder="ticker"></el-input>
            </el-form-item>
            <!--<el-form-item label="Token Name" prop="tokenName">-->
            <!--<el-input v-model="searchFormData.tokenName" size="small" placeholder="Token Name"></el-input>-->
            <!--</el-form-item>-->
            <el-form-item label="项目名称" prop="projectName">
                <el-input v-model="searchFormData.projectName" size="small" placeholder="Project Name"></el-input>
            </el-form-item>
            <el-form-item label="发行状态" prop="issuedStatus">
                <el-select v-model="searchFormData.issuedStatus" clearable filterable size="small" placeholder="发行状态">
                    <el-option label="创建" value="0"></el-option>
                    <el-option label="未发行" value="1"></el-option>
                    <el-option label="预售中" value="3"></el-option>
                    <el-option label="预售失败" value="5"></el-option>
                    <el-option label="预售完成" value="4"></el-option>
                    <el-option label="已发行" value="6"></el-option>
                    <el-option label="已取消" value="7"></el-option>
                    <!--<el-option label="已删除" value="deleted"></el-option>-->
                </el-select>
            </el-form-item>
            <el-form-item label="支付状态" prop="payStatus">
                <el-select v-model="searchFormData.payStatus" clearable filterable size="small" placeholder="支付状态">
                    <el-option label="未支付" value="0"></el-option>
                    <el-option label="已支付" value="1"></el-option>
                    <el-option label="已退款" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="通证发放状态" prop="provideStatus">
                <el-select v-model="searchFormData.provideStatus" clearable filterable size="small"
                           placeholder="通证发放状态">
                    <el-option label="已发放" value="1"></el-option>
                    <el-option label="未发放" value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" @click="getListData">查询</el-button>
                <el-button size="small" @click="resetSearchForm">重置</el-button>
            </el-form-item>
        </el-form>
        <el-tabs
            @tab-click='getReleaseList'
            v-model="activeTab"
            type="border-card">
            <el-tab-pane label="全部" name="all">
                <release-list-table :releaseList="releaseListData" @getList="getReleaseList"/>
                <pagination v-show="total>0" :total="total" :page.sync="pageNum" :limit.sync="pageSize"
                            @pagination="getReleaseList"/>
            </el-tab-pane>
            <el-tab-pane label="未发行" name="unreleased">
                <release-list-table :releaseList="releaseListData" @getList="getReleaseList"/>
                <pagination v-show="total>0" :total="total" :page.sync="pageNum" :limit.sync="pageSize"
                            @pagination="getReleaseList"/>
            </el-tab-pane>
            <el-tab-pane label="预售中" name="presale">
                <release-list-table :releaseList="releaseListData" @getList="getReleaseList"/>
                <pagination v-show="total>0" :total="total" :page.sync="pageNum" :limit.sync="pageSize"
                            @pagination="getReleaseList"/>
            </el-tab-pane>
            <el-tab-pane label="预售完成" name="presaleSuccess">
                <release-list-table :releaseList="releaseListData" @getList="getReleaseList"/>
                <pagination v-show="total>0" :total="total" :page.sync="pageNum" :limit.sync="pageSize"
                            @pagination="getReleaseList"/>
            </el-tab-pane>
            <el-tab-pane label="已发行" name="issued">
                <release-list-table :releaseList="releaseListData" @getList="getReleaseList"/>
                <pagination v-show="total>0" :total="total" :page.sync="pageNum" :limit.sync="pageSize"
                            @pagination="getReleaseList"/>
            </el-tab-pane>
            <el-tab-pane label="预售失败" name="presaleFail">
                <release-list-table :releaseList="releaseListData" @getList="getReleaseList"/>
                <pagination v-show="total>0" :total="total" :page.sync="pageNum" :limit.sync="pageSize"
                            @pagination="getReleaseList"/>
            </el-tab-pane>
            <el-tab-pane label="创建" name="create">
                <release-list-table :releaseList="releaseListData" @getList="getReleaseList"/>
                <pagination v-show="total>0" :total="total" :page.sync="pageNum" :limit.sync="pageSize"
                            @pagination="getReleaseList"/>
            </el-tab-pane>
            <el-tab-pane label="已取消" name="cancelled">
                <release-list-table :releaseList="releaseListData" @getList="getReleaseList"/>
                <pagination v-show="total>0" :total="total" :page.sync="pageNum" :limit.sync="pageSize"
                            @pagination="getReleaseList"/>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import ReleaseListTable from './components/ReleaseListTable'
    import Pagination from '@/components/Pagination'
    import {getReleaseList} from '@/api/pass-issued/release'

    export default {
        components: {
            ReleaseListTable, Pagination
        },
        data () {
            return {
                // 查询数据集合
                searchFormData: {
                    // 编号
                    number: '',
                    ticker: '',
                    tokenName: '',
                    // 项目名称
                    projectName: '',
                    // 发行状态
                    issuedStatus: '',
                    // 支付状态
                    payStatus: '',
                    // 发放通证状态
                    provideStatus: ''
                },
                // 查询数据集合（搜索）
                searchFormDataFilter: {
                    // 编号
                    number: '',
                    ticker: '',
                    tokenName: '',
                    // 项目名称
                    projectName: '',
                    // 发行状态
                    issuedStatus: '',
                    // 支付状态
                    payStatus: '',
                    // 发放通证状态
                    provideStatus: ''
                },
                // 当前tabs选中
                activeTab: 'all',
                // 当前页
                pageNum: 1,
                // 每页条数
                pageSize: 20,
                // 总条数
                total: 0,
                // 发行列表数据
                releaseListData: []
            }
        },
        created () {
            // 初始化数据
            this.getReleaseList()
        },
        methods: {
            // 点击搜索
            getListData () {
                this.pageNum = 1
                this.searchFormDataFilter = JSON.parse(JSON.stringify(this.searchFormData))
                this.getReleaseList('search')
            },
            // 获取通证发行列表
            getReleaseList (str) {
                if (str !== 'search') {
                    switch (this.activeTab) {
                    case 'all':
                        this.searchFormDataFilter.issuedStatus = ''
                        break
                    case 'unreleased':
                        this.searchFormDataFilter.issuedStatus = '1'
                        break
                    case 'presale':
                        this.searchFormDataFilter.issuedStatus = '3'
                        break
                    case 'presaleSuccess':
                        this.searchFormDataFilter.issuedStatus = '4'
                        break
                    case 'issued':
                        this.searchFormDataFilter.issuedStatus = '6'
                        break
                    case 'presaleFail':
                        this.searchFormDataFilter.issuedStatus = '5'
                        break
                    case 'create':
                        this.searchFormDataFilter.issuedStatus = '0'
                        break
                    case 'cancelled':
                        this.searchFormDataFilter.issuedStatus = '7'
                        break
                    }
                } else {
                    this.checkTabs(this.searchFormData.issuedStatus)
                }
                this.searchFormData = JSON.parse(JSON.stringify(this.searchFormDataFilter))
                let formData = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                        filter: {
                            number: this.searchFormDataFilter.number,
                            ticker: this.searchFormDataFilter.ticker,
                            tokenName: this.searchFormDataFilter.tokenName,
                            name: this.searchFormDataFilter.projectName,
                            issueState: this.searchFormDataFilter.issuedStatus,
                            payState: this.searchFormDataFilter.payStatus,
                            giveState: this.searchFormDataFilter.provideStatus
                        }
                    }
                }
                this.searchFormData = this.removeSpaces(this.searchFormData)
                formData.data.filter = this.removeSpaces(formData.data.filter)
                getReleaseList(formData).then(res => {
                    this.releaseListData = res.data.list
                    this.pageNum = res.data.pageNum
                    this.total = res.data.total
                })
            },
            // 重置搜索表单
            resetSearchForm () {
                this.$refs.releaseSearch.resetFields()
                this.searchFormData.issuedStatus = ''
                this.activeTab = 'all'
                this.getListData()
            },
            // 反向匹配tabs
            checkTabs (state) {
                switch (state) {
                case '':
                    this.activeTab = 'all'
                    break
                case '1':
                    this.activeTab = 'unreleased'
                    break
                case '3':
                    this.activeTab = 'presale'
                    break
                case '4':
                    this.activeTab = 'presaleSuccess'
                    break
                case '6':
                    this.activeTab = 'issued'
                    break
                case '5':
                    this.activeTab = 'presaleFail'
                    break
                case '0':
                    this.activeTab = 'create'
                    break
                case '7':
                    this.activeTab = 'cancelled'
                    break
                }
            }
        }
    }
</script>
