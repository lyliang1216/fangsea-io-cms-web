<template>
    <div class="app-container">
        <ul class="projectlist">
            <li>
                <p>第一项目：</p>
                <p class="show-content">{{firstPro.projectNum}}</p>
                <p class="show-content">{{firstPro.ptCurCode}}</p>
                <p>更换为</p>
                <div>
                    <el-select class="selectProject" v-model="firstProject" clearable filterable
                               placeholder="请输入项目编号或ticker" size="small">
                        <el-option
                            v-for="item in selectpro"
                            :disabled="item.projectId.toString() === secPro.projectId.toString() || item.projectId.toString() === firstPro.projectId.toString()"
                            :key="item.projectId"
                            :label="item.projectNum + '('+ item.ticker +')'"
                            :value="item.projectId">
                        </el-option>
                    </el-select>
                </div>
                <span v-if="firstProject && firstProject.toString() !== firstPro.projectId.toString()"
                      @click="subChangePro(firstProject, 2, 1, secPro.projectId)">提交</span>
                <span v-if="!isdefaultst"
                      @click="subChangePro(firstPro.projectId, 0, 1, secPro.projectId)">初始化为默认值</span>
            </li>
            <li>
                <p>第二项目：</p>
                <p class="show-content">{{secPro.projectNum}}</p>
                <p class="show-content">{{secPro.ptCurCode}}</p>
                <p>更换为</p>
                <div>
                    <el-select class="selectProject" v-model="secProject" clearable filterable
                               placeholder="请输入项目编号或ticker" size="small">
                        <el-option
                            v-for="item in selectpro"
                            :disabled="item.projectId.toString() === firstPro.projectId.toString() || item.projectId.toString() === secPro.projectId.toString()"
                            :key="item.projectId"
                            :label="item.projectNum + '('+ item.ticker +')'"
                            :value="item.projectId">
                        </el-option>
                    </el-select>
                </div>
                <span v-if="secProject && secProject.toString() !== secPro.projectId.toString()"
                      @click="subChangePro(secProject, 1, 2, firstPro.projectId)">提交</span>
                <span v-if="!isdefaultnd"
                      @click="subChangePro(secPro.projectId, 0, 2, firstPro.projectId)">初始化为默认值</span>
            </li>
        </ul>
    </div>
</template>

<script>
    import {getIndexList, getProList, savePro} from '@/api/content/index-config'

    export default {
        data () {
            return {
                // 首页项目一二列表
                indexProList: [],
                // 项目列表
                selectpro: [],
                // 第一项目数据
                firstPro: [],
                // 第二项目数据
                secPro: [],
                // 第一项目选择框
                firstProject: '',
                // 第二项目选择框
                secProject: '',
                // 第一是否为默认
                isdefaultst: true,
                // 第二是否为默认
                isdefaultnd: true
            }
        },
        mounted () {
            this.getcurrList()
        },
        methods: {
            /**
             * 查询一二项目列表
             */
            getcurrList () {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        pageNum: 1,
                        pageSize: 2
                    }
                }
                getIndexList(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.firstPro = res.data.list[0]
                        this.secPro = res.data.list[1]
                        this.getselectList()
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            },
            /**
             * 查询可选项目列表
             */
            getselectList () {
                let params = {
                    traceId: Math.random().toString(36).substr(2)
                }
                getProList(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.selectpro = res.data
                        // indexOrder不为空就是有排序规则，为0就是默认状态
                        for (let i in res.data) {
                            if (res.data[i].projectId.toString() === this.firstPro.projectId.toString()) {
                                this.isdefaultst = res.data[i].indexOrder === 0
                            }
                            if (res.data[i].projectId.toString() === this.secPro.projectId.toString()) {
                                this.isdefaultnd = res.data[i].indexOrder === 0
                            }
                        }
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            },
            /**
             * 提交修改项目
             * @param value 修改后的值
             * @param order 项目顺序
             * @param mark 当前项目顺序
             * @param otherId 另一个项目id
             */
            subChangePro (value, order, mark, otherId) {
                if (this.checkPro(value, order)) {
                    let params = {
                        traceId: Math.random().toString(36).substr(2),
                        data: {
                            projectId: value.toString(),
                            indexOrder: order,
                            mark: mark.toString(),
                            otherId: otherId.toString()
                        }
                    }
                    savePro(params).then(res => {
                        if (res.code.toString() === '0') {
                            this.getcurrList()
                            if (order === 1) {
                                if (value === this.firstProject) {
                                    this.firstProject = ''
                                }
                            }
                            if (order === 2) {
                                if (value === this.secProject) {
                                    this.secProject = ''
                                }
                            }
                        } else {
                            this.$message.error(res.msg)
                        }
                    }).catch(err => {
                        this.$message.error(err.msg)
                    })
                }
            },
            /**
             * 判断项目是否符合规则
             * @param value 修改后的值
             * @param order 项目顺序
             */
            checkPro (value, order) {
                if (order === 1) {
                    if (value === this.secPro.projectId) {
                        this.$message.error('与原项目一致，没有任何变更，请确认后再试')
                        return false
                    }
                    if (value === this.firstPro.projectId) {
                        this.$message.error('该项目已在首页展示，请确认后再试')
                        return false
                    }
                }
                if (order === 2) {
                    if (value === this.secPro.projectId) {
                        this.$message.error('与原项目一致，没有任何变更，请确认后再试')
                        return false
                    }
                    if (value === this.firstPro.projectId) {
                        this.$message.error('该项目已在首页展示，请确认后再试')
                        return false
                    }
                }
                return true
            }
        }
    }
</script>

<style lang="scss" scoped>
    ul.projectlist {
        padding-left: 30px;
        & > li {
            list-style: none;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            & > p {
                margin-right: 30px;
                &.show-content {
                    width: 90px;
                }
            }
            & > div {
                margin-right: 30px;
            }
            & > span {
                margin-right: 30px;
                cursor: pointer;
                color: #2EA9DF;
            }
            .selectProject {
                width: 260px;
            }
        }
    }
</style>
