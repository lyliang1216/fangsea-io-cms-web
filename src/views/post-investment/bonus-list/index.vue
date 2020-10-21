<template>
    <div class="app-container">
        <el-form :inline="true" :model="searchFormData" class="demo-form-inline" ref="releaseSearch">
            <el-form-item label="账户类型" prop="accountType">
                <el-select v-model="searchFormData.accountType" clearable filterable size="small" placeholder="类型">
                    <template v-for="item in projectList">
                        <el-option :label="item.name" :value="item.projectAccountId"></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item label="类型" prop="type">
                <el-select v-model="searchFormData.type" clearable filterable size="small" placeholder="类型">
                    <el-option label="通证分红" value="CMS_PTO_DIVIDEND"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="uid" prop="uid">
                <el-input v-model="searchFormData.uid" size="small" placeholder="uid"></el-input>
            </el-form-item>
            <el-form-item label="赠币日期" prop="bonusDate">
                <el-date-picker
                    v-model="searchFormData.bonusDate"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                    size="small"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="small" @click="getListData">搜索</el-button>
                <el-button size="small" @click="resetSearchForm">重置</el-button>
            </el-form-item>
        </el-form>
        <el-table
            stripe
            :data="recordList"
            style="width: 100%">
            <el-table-column
                label="分红时间"
                prop="createTime">
                <template slot-scope="props">
                    {{ props.row.createTime | getZoneTime }}
                </template>
            </el-table-column>
            <el-table-column
                label="类型">
                <template slot-scope="props">
                    {{ matchType(props.row.presentType) }}
                </template>
            </el-table-column>
            <el-table-column
                label="uid"
                prop="userId">
            </el-table-column>
            <el-table-column
                label="分红数量"
                prop="amount">
            </el-table-column>
            <el-table-column
                label="分红币种"
                prop="currency">
            </el-table-column>
            <el-table-column
                label="操作人">
                <template slot-scope="props">
                    {{props.row.operationRole}}<span v-if="props.row.operatorName">({{props.row.operatorName}})</span>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="pageNum" :limit.sync="pageSize"
                    @pagination="getRecord"/>
    </div>
</template>

<script>
    import {getCoinList, getProjectList} from '@/api/post-investment/bonus-list'
    import Pagination from '@/components/Pagination'

    export default {
        data () {
            return {
                // 查询条件
                searchFormData: {
                    accountType: '',
                    type: '',
                    uid: '',
                    bonusDate: null
                },
                // 搜索使用
                searchFormDataFilter: {
                    accountType: '',
                    type: '',
                    uid: '',
                    bonusDate: null
                },
                // 项目列表
                projectList: [],
                // 赠币列表
                recordList: [],
                total: 0,
                pageNum: 1,
                pageSize: 20
            }
        },
        created () {
            // 初始化数据
            this.getRecord()
            this.getProjectList()
        },
        methods: {
            // 点搜索
            getListData () {
                this.pageNum = 1
                this.searchFormDataFilter = JSON.parse(JSON.stringify(this.searchFormData))
                this.getRecord()
            },
            // 获取赠币记录列表
            getRecord () {
                let formData = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                        filter: {
                            bizType: '1',
                            bizAccountId: this.searchFormDataFilter.accountType,
                            presentType: this.searchFormDataFilter.type,
                            userId: this.searchFormDataFilter.uid
                        }
                    }
                }
                formData.data.filter['startTime'] = ''
                formData.data.filter['endTime'] = ''
                if (this.searchFormDataFilter.bonusDate) {
                    formData.data.filter['startTime'] = this.searchFormDataFilter.bonusDate[0]
                    formData.data.filter['endTime'] = this.searchFormDataFilter.bonusDate[1]
                }
                formData.data.filter.userId = this.removeSpaces(formData.data.filter.userId)
                this.searchFormData.uid = this.removeSpaces(this.searchFormData.uid)
                getCoinList(formData).then(res => {
                    if (res.code.toString() === '0') {
                        this.total = res.data.total
                        this.pageNum = res.data.pageNum
                        this.pageSize = res.data.pageSize
                        this.recordList = res.data.list
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            },
            // 获取项目列表
            getProjectList () {
                let formData = {
                    traceId: Math.random().toString(36).substr(2)
                }
                getProjectList(formData).then(res => {
                    this.projectList = res.data
                })
            },
            // 重置搜索
            resetSearchForm () {
                this.$refs.releaseSearch.resetFields()
                this.getListData()
            },
            // 类型
            matchType (state) {
                switch (state) {
                case 'CMS_PTO_DIVIDEND':
                    return '通证分红'
                default:
                    break
                }
            }
        },
        components: {
            Pagination
        }
    }
</script>
