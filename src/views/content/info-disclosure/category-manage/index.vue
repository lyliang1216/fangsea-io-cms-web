<template>
    <div class="app-container">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="类别管理" name="category"></el-tab-pane>
        </el-tabs>
        <p>勾选类别将被显示</p>
        <el-tree
            ref="tree"
            :data="treedata"
            show-checkbox
            draggable
            node-key="id"
            default-expand-all
            :default-checked-keys="defaultCategory"
            :check-strictly="true"
            @check="CheckNode"
            @node-drop="handleDrop"
            :allow-drop="allowDrop"
            :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span class="tree-item-btn-box">
                    <el-button
                        v-if="node.level !== 1"
                        type="text"
                        size="mini"
                        @click="() => edit(data)">
                        编辑
                    </el-button>
                    <el-button
                        v-if="node.level !== 4"
                        type="text"
                        size="mini"
                        @click="() => additem(data)">
                        添加
                    </el-button>
                    <el-button
                        v-if="(node.level !== 2 || treedata[0].children.length !== 1) && node.level !== 1"
                        type="text"
                        size="mini"
                        @click="() => removeDialog(node, data)">
                        删除
                    </el-button>
                </span>
            </span>
        </el-tree>
        <div class="btn">
            <el-button size="small" type="primary" :disabled="subimtDisable" @click="saveTreeList">保存</el-button>
            <el-button size="small" @click="getTreeData">重置</el-button>
        </div>
        <el-dialog
            title="类别目录名"
            :visible.sync="dialogVisible"
            width="50%"
            :close-on-click-modal="false"
            @close="closedialog"
            :destroy-on-close="true">
            <el-form ref="form" :rules="rules" :model="form" label-width="80px" class="dialogform" v-if="dialogVisible">
                <el-form-item label="简体中文" prop="zhcn">
                    <el-input v-model="form.zhcn"></el-input>
                </el-form-item>
                <el-form-item label="繁体中文" prop="zhtw">
                    <el-input v-model="form.zhtw"></el-input>
                </el-form-item>
                <el-form-item label="English" prop="enus">
                    <el-input v-model="form.enus"></el-input>
                </el-form-item>
                <el-form-item prop="enus">
                    <div class="dialog-footer">
                        <el-button size="small" type="primary" @click="saveform">保存</el-button>
                        <el-button size="small" @click="closedialog">取消</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog
            title="慎重操作"
            :visible.sync="dialogVisibleRemove"
            width="20%"
            :close-on-click-modal="false"
            destroy-on-close
            center>
            <span>子类别将一同被删除，删除后无法恢复</span>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisibleRemove = false">取消</el-button>
                <el-button size="small" type="danger" @click="remove">删除</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {getTree, saveTree} from '@/api/content/category-manage'

    export default {
        data () {
            return {
                // 树结构数据
                treedata: [],
                // tabs标签
                activeName: 'category',
                // 类别名弹出框显示
                dialogVisible: false,
                // 删除确认弹框
                dialogVisibleRemove: false,
                // 当前操作
                active: '',
                // 当前操作data
                nowdata: null,
                // 当前操作节点
                nownode: null,
                // 当前已有id
                idList: [],
                // list结构
                treelist: {
                    zh_CN: [],
                    zh_TW: [],
                    en_US: []
                },
                // 默认选中key
                defaultCategory: [],
                // 设置选中的节点
                setCheckKey: [],
                // 保存按钮禁用
                subimtDisable: true,
                // 类名表单
                form: {
                    zhcn: '',
                    zhtw: '',
                    enus: ''
                },
                rules: {
                    zhcn: [
                        {required: true, max: 16, message: '请输入不超过16个中文字符目录名', trigger: 'blur'}
                    ],
                    zhtw: [
                        {required: true, max: 16, message: '请输入不超过16个中文字符目录名', trigger: 'blur'}
                    ],
                    enus: [
                        {required: true, max: 30, message: '请输入不超过30个英文字符目录名', trigger: 'blur'}
                    ]
                }
            }
        },
        mounted () {
            this.getTreeData()
        },
        methods: {
            /**
             * 获取树结构数据
             */
            getTreeData () {
                let params = {
                    traceId: Math.random().toString(36).substr(2)
                }
                getTree(params).then(res => {
                    if (res.code.toString() === '0') {
                        if (res.data.zh_CN.length !== 0) {
                            this.idList = []
                            this.defaultCategory = []
                            res.data.zh_CN.forEach(item => {
                                this.idList.push(item.id)
                                if (item.status === 0) {
                                    this.defaultCategory.push(item.id)
                                }
                            })
                            if (this.defaultCategory.length === res.data.zh_CN.length) {
                                this.defaultCategory.push(0)
                            }
                            this.setCheckKey = this.defaultCategory
                            let allList = this.getAllList(res.data)
                            allList.sort(this.getsortData)
                            this.treedata = this.toTreeData(allList)
                        } else {
                            this.idList = [1, 2, 3]
                            this.setCheckKey = this.idList
                            this.treedata = [{
                                id: 0,
                                label: '全选',
                                parentId: null,
                                children: [{
                                    id: 1,
                                    label: '一级 1',
                                    zh_CN: '一级 1',
                                    zh_TW: '一级 1',
                                    en_US: '一级 1',
                                    parentId: 0,
                                    articleNum: 0,
                                    children: [{
                                        id: 2,
                                        label: '二级 1-1',
                                        zh_CN: '二级 1-1',
                                        zh_TW: '二级 1-1',
                                        en_US: '二级 1-1',
                                        parentId: 1,
                                        articleNum: 0,
                                        children: [{
                                            id: 3,
                                            label: '三级 1-1-1',
                                            zh_CN: '三级 1-1-1',
                                            zh_TW: '三级 1-1-1',
                                            en_US: '三级 1-1-1',
                                            parentId: 2,
                                            articleNum: 0
                                        }]
                                    }]
                                }]
                            }]
                        }
                    }
                })
            },
            /**
             * 数组排序
             */
            getsortData (a, b) {
                return a.sort - b.sort
            },
            /**
             * 融合list，获取繁体英文
             * @param data 三种语言数据源
             */
            getAllList (data) {
                let allList = []
                let zhcn = data.zh_CN
                let zhtw = data.zh_TW
                let enus = data.en_US
                for (let i in zhcn) {
                    allList.push({
                        id: zhcn[i].id,
                        categoryName: zhcn[i].categoryName,
                        parentId: zhcn[i].parentId,
                        sort: zhcn[i].sort,
                        status: zhcn[i].status,
                        articleNum: zhcn[i].articleNum,
                        zh_CN: zhcn[i].categoryName,
                        zh_TW: '',
                        en_US: ''
                    })
                    for (let j in zhtw) {
                        if (allList[i].id === zhtw[j].id) {
                            allList[i].zh_TW = zhtw[j].categoryName
                        }
                    }
                    for (let q in enus) {
                        if (allList[i].id === enus[q].id) {
                            allList[i].en_US = enus[q].categoryName
                        }
                    }
                }
                return allList
            },
            /**
             * 构造树结构数据
             * @param data 数据源
             */
            toTreeData (data) {
                let list = [{
                    id: 0,
                    label: '全选',
                    parentId: null,
                    children: []
                }]
                let attributesData = {
                    id: 'id',
                    parentId: 'parentId',
                    name: 'categoryName',
                    rootId: 0,
                    sort: 'sort',
                    zh_CN: 'zh_CN',
                    zh_TW: 'zh_TW',
                    en_US: 'en_US',
                    articleNum: 'articleNum'
                }
                let resData = data
                let tree = list[0].children
                // 循环一级
                for (let i = 0; i < resData.length; i++) {
                    if (resData[i].parentId === attributesData.rootId) {
                        let labelNum = ''
                        if (resData[i][attributesData.articleNum] === 0) {
                            labelNum = resData[i][attributesData.name]
                        } else {
                            labelNum = resData[i][attributesData.name] + ' (' + resData[i][attributesData.articleNum] + ')'
                        }
                        let obj = {
                            id: resData[i][attributesData.id],
                            label: labelNum,
                            sort: resData[i][attributesData.sort],
                            parentId: 0,
                            zh_CN: resData[i][attributesData.zh_CN],
                            zh_TW: resData[i][attributesData.zh_TW],
                            en_US: resData[i][attributesData.en_US],
                            articleNum: resData[i][attributesData.articleNum],
                            children: []
                        }
                        tree.push(obj)
                        resData.splice(i, 1)
                        i--
                    }
                }
                run(tree)

                function run (chiArr) {
                    if (resData.length !== 0) {
                        for (let i = 0; i < chiArr.length; i++) {
                            for (let j = 0; j < resData.length; j++) {
                                if (chiArr[i].id === resData[j][attributesData.parentId]) {
                                    let labelNumInner = ''
                                    if (resData[j][attributesData.articleNum] === 0) {
                                        labelNumInner = resData[j][attributesData.name]
                                    } else {
                                        labelNumInner = resData[j][attributesData.name] + ' (' + resData[j][attributesData.articleNum] + ')'
                                    }
                                    let obj = {
                                        id: resData[j][attributesData.id],
                                        label: labelNumInner,
                                        sort: resData[j][attributesData.sort],
                                        parentId: resData[j][attributesData.parentId],
                                        zh_CN: resData[j][attributesData.zh_CN],
                                        zh_TW: resData[j][attributesData.zh_TW],
                                        en_US: resData[j][attributesData.en_US],
                                        articleNum: resData[j][attributesData.articleNum],
                                        children: []
                                    }
                                    chiArr[i].children.push(obj)
                                    resData.splice(j, 1)
                                    j--
                                }
                            }
                            run(chiArr[i].children)
                        }
                    }
                }

                return list
            },
            /**
             * 选中节点
             * @param data 节点对象
             * @param node tree当前选中对象
             */
            CheckNode (data, node) {
                let allKey = JSON.parse(JSON.stringify(this.idList))
                // 当前被选中
                if (node.checkedKeys.indexOf(data.id) !== -1) {
                    if (data.id === 0) {
                        allKey.push(0)
                        this.setCheckKey = allKey
                    } else {
                        // 添加选中id
                        this.setCheckKey.push(data.id)
                        if (data.children && data.children.length !== 0) {
                            data.children.forEach(item => {
                                // 添加选中子级id
                                this.setCheckKey.push(item.id)
                                if (item.children && item.children.length !== 0) {
                                    item.children.forEach(_item => {
                                        // 如子级还有子级，添加第三级id
                                        this.setCheckKey.push(_item.id)
                                    })
                                }
                            })
                        }
                        // 当父级id为0，是第一级时不添加父级id
                        if (data.parentId !== 0) {
                            // 已包含二级添加父级id
                            this.setCheckKey.push(data.parentId)
                            // 为三级时，添加父级id
                            this.setCheckKey.push(this.getparentId(data.id, data.parentId))
                        }
                        // 删除多余，以便添加全选
                        if (this.setCheckKey.indexOf('del') !== -1) {
                            this.setCheckKey.splice(this.setCheckKey.indexOf('del'), 1)
                        }
                        this.setCheckKey = Array.from(new Set(this.setCheckKey))
                        this.idList = Array.from(new Set(this.idList))
                        if (this.setCheckKey.length === this.idList.length) {
                            this.setCheckKey.push(0)
                        }
                    }
                } else if (data.id === 0) {
                    this.setCheckKey = []
                } else {
                    // 删除选中id
                    this.setCheckKey.splice(this.setCheckKey.indexOf(data.id), 1)
                    // 删除全部选中
                    if (this.setCheckKey.indexOf(0) !== -1) {
                        this.setCheckKey.splice(this.setCheckKey.indexOf(0), 1)
                    }
                    if (data.children && data.children.length !== 0) {
                        data.children.forEach(item => {
                            // 删除子级id
                            if (this.setCheckKey.indexOf(item.id) !== -1) {
                                this.setCheckKey.splice(this.setCheckKey.indexOf(item.id), 1)
                            }
                            if (item.children && item.children.length !== 0) {
                                // 如子级还有子级，删除第三级id
                                item.children.forEach(_item => {
                                    if (this.setCheckKey.indexOf(_item.id) !== -1) {
                                        this.setCheckKey.splice(this.setCheckKey.indexOf(_item.id), 1)
                                    }
                                })
                            }
                        })
                    }
                }
                this.$refs.tree.setCheckedKeys(this.setCheckKey)
                this.subimtDisable = false
            },
            /**
             * 查找祖级id
             * @param id 自身id
             * @param parentId 父级id
             */
            getparentId (id, parentId) {
                let grandparentId = ''
                let list = this.treedata[0].children
                for (let i in list) {
                    if (list[i].id === parentId) {
                        grandparentId = 'del'
                        break
                    }
                    for (let j in list[i].children) {
                        // 二级id等于三级父id
                        if (list[i].children[j].id === parentId) {
                            grandparentId = list[i].id
                            break
                        }
                    }
                }
                return grandparentId
            },
            /**
             * 添加类别
             * @param data 操作的数据
             * @param form 编辑的类名
             */
            append (data, form) {
                let max = Math.max.apply(null, this.idList)
                const newChild = {
                    id: max + 1,
                    label: form.zhcn,
                    parentId: data.id,
                    zh_CN: form.zhcn,
                    zh_TW: form.zhtw,
                    en_US: form.enus,
                    articleNum: 0,
                    children: []
                }
                if (!data.children) {
                    this.$set(data, 'children', [])
                }
                data.children.push(newChild)
                this.idList.push(max + 1)
                this.closedialog()
                if (this.setCheckKey.indexOf(0) !== -1) {
                    this.setCheckKey.splice(this.setCheckKey.indexOf(0), 1)
                }
                this.$refs.tree.setCheckedKeys(this.setCheckKey)
                this.subimtDisable = false
            },
            /**
             *  删除类别
             */
            remove () {
                let node = this.nownode
                let data = this.nowdata
                const parent = node.parent
                const children = parent.data.children || parent.data
                const index = children.findIndex(d => d.id === data.id)
                children.splice(index, 1)
                this.dialogVisibleRemove = false
                if (this.setCheckKey.indexOf(data.id) !== -1) {
                    this.setCheckKey.splice(this.setCheckKey.indexOf(data.id), 1)
                }
                if (this.idList.indexOf(data.id) !== -1) {
                    this.idList.splice(this.idList.indexOf(data.id), 1)
                }
                if (this.setCheckKey.length === this.idList.length - 1) {
                    this.setCheckKey.push(0)
                    this.$refs.tree.setCheckedKeys(this.setCheckKey)
                }
                this.subimtDisable = false
            },
            /**
             * 删除类别弹框
             */
            removeDialog (node, data) {
                if (!this.hasArticle(data)) {
                    this.$message.error('当前目录\'' + data.zh_CN + '\'存在关联信息，无法直接删除，请先解除信息关联')
                } else {
                    this.nownode = node
                    this.nowdata = data
                    this.dialogVisibleRemove = true
                }
            },
            /**
             * 判断是否有文章，能否删除
             * @param data 数据源
             */
            hasArticle (data) {
                let flag = true
                if (data.articleNum !== 0) {
                    return false
                }
                if (data.children && data.children.length !== 0) {
                    for (let i in data.children) {
                        if (data.children[i].articleNum !== 0) {
                            flag = false
                            break
                        }
                        if (data.children[i].children && data.children[i].children.length !== 0) {
                            for (let j in data.children[i].children) {
                                if (data.children[i].children[j].articleNum !== 0) {
                                    flag = false
                                    break
                                }
                            }
                        }
                    }
                }
                return flag
            },
            /**
             * 关闭弹窗
             */
            closedialog () {
                this.$refs.form.resetFields()
                this.form = {
                    zhcn: '',
                    zhtw: '',
                    enus: ''
                }
                this.dialogVisible = false
            },
            /**
             * 保存表单类名
             */
            saveform () {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        if (this.active === 'append') {
                            this.append(this.nowdata, this.form)
                        } else {
                            if (this.nowdata.articleNum === 0) {
                                this.nowdata.label = this.form.zhcn
                            } else {
                                this.nowdata.label = this.form.zhcn + ' (' + this.nowdata.articleNum + ')'
                            }
                            this.nowdata.zh_CN = this.form.zhcn
                            this.nowdata.zh_TW = this.form.zhtw
                            this.nowdata.en_US = this.form.enus
                            this.closedialog()
                        }
                        this.subimtDisable = false
                    } else {
                        return false
                    }
                })
            },
            /**
             * 添加按钮
             * @param data
             */
            additem (data) {
                this.form = {
                    zhcn: '',
                    zhtw: '',
                    enus: ''
                }
                this.dialogVisible = true
                this.active = 'append'
                this.nowdata = data
            },
            /**
             * 编辑按钮
             */
            edit (data) {
                this.form = {
                    zhcn: '',
                    zhtw: '',
                    enus: ''
                }
                this.dialogVisible = true
                this.active = 'edit'
                this.form = {
                    zhcn: data.zh_CN,
                    zhtw: data.zh_TW,
                    enus: data.en_US
                }
                this.nowdata = data
            },
            /**
             * 保存修改后的结构
             */
            saveTreeList () {
                let keyList = this.$refs.tree.getCheckedKeys()
                this.treelist = {
                    zh_CN: [],
                    zh_TW: [],
                    en_US: []
                }
                this.toTreeList(keyList, this.treedata[0].children, 'zh_CN')
                this.toTreeList(keyList, this.treedata[0].children, 'zh_TW')
                this.toTreeList(keyList, this.treedata[0].children, 'en_US')
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: this.treelist
                }
                saveTree(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.$message.success('保存成功')
                        this.subimtDisable = true
                    } else {
                        this.$message.error(res.msg)
                    }
                }).catch(err => {
                    this.$message.error(err.msg)
                })
            },
            /**
             * 树结构转list
             * @param keyList 选中的节点arr
             * @param data 数据源
             * @param language 语言
             * @param parentData 父级数据
             */
            toTreeList (keyList, data, language, parentData) {
                for (let i in data) {
                    this.treelist[language].push({
                        id: data[i].id,
                        categoryName: data[i][language],
                        parentId: parentData ? parentData.id : 0,
                        sort: parseInt(i),
                        status: keyList.indexOf(data[i].id) !== -1 ? 0 : 1
                    })
                    if (data[i].children) {
                        this.toTreeList(keyList, data[i].children, language, data[i])
                    }
                }
            },
            /**
             * 拖拽成功后
             * @param draggingNode 被拖拽节点
             * @param dropNode 进入的节点
             * @param dropType 拖拽方式（inner，before，after）
             */
            handleDrop (draggingNode, dropNode, dropType) {
                if (dropType === 'before' || dropType === 'after') {
                    draggingNode.data.parentId = dropNode.data.parentId
                } else {
                    draggingNode.data.parentId = dropNode.data.id
                }
                this.$refs.tree.setCheckedKeys(this.setCheckKey)
                this.subimtDisable = false
            },
            /**
             * 是否允许拖拽成功
             * @param draggingNode 被拖拽节点
             * @param dropNode 进入的节点
             * @param type 放置方式（prev，inner，next），目标节点前中后
             */
            allowDrop (draggingNode, dropNode, type) {
                if (draggingNode.data.id === 0) {
                    return false // 不允许拖动全部
                }
                if (dropNode.data.id === 0 && type !== 'inner') {
                    return false // 不允许与全部同级（prev，next）
                }
                if (type === 'inner' && this.getMaxDimension(dropNode.data.id) === 0 && this.getChildrenNum(draggingNode.data) > 2) {
                    return false // 插入到0级中，为1级不超过2层子级
                }
                if (type === 'inner' && this.getMaxDimension(dropNode.data.id) === 1 && this.getChildrenNum(draggingNode.data) > 1) {
                    return false // 插入到1级中，为2级不超过2层子级
                }
                if (type === 'inner' && this.getMaxDimension(dropNode.data.id) === 2 && this.getChildrenNum(draggingNode.data) > 0) {
                    return false // 插入到2级中，为3级不超过0层子级
                }
                if (type === 'inner' && this.getMaxDimension(dropNode.data.id) === 3) {
                    return false // 插入到3级中，为4级不允许
                }
                if (type !== 'inner' && this.getMaxDimension(dropNode.data.id) === 0) {
                    return false // 放置在0级，不允许
                }
                if (type !== 'inner' && this.getMaxDimension(dropNode.data.id) === 1 && this.getChildrenNum(draggingNode.data) > 2) {
                    return false // 放置在1级，不超过2层子级
                }
                if (type !== 'inner' && this.getMaxDimension(dropNode.data.id) === 2 && this.getChildrenNum(draggingNode.data) > 1) {
                    return false // 放置在2级，不超过1层子级
                }
                if (type !== 'inner' && this.getMaxDimension(dropNode.data.id) === 3 && this.getChildrenNum(draggingNode.data) > 0) {
                    return false // 放置在3级，不超过0层子级
                }
                return true
            },
            /**
             * 查找指定节点在第几层（参考位置，放置或插入）
             * @param id 目标id
             */
            getMaxDimension (id) {
                let data = this.treedata[0].children
                let flag = 0
                for (let i in data) {
                    if (data[i].id === id) {
                        flag = 1
                        break
                    }
                    if (data[i].children.length !== 0) {
                        for (let j in data[i].children) {
                            if (data[i].children[j].id === id) {
                                flag = 2
                                break
                            }
                            if (data[i].children[j].children.length !== 0) {
                                for (let q in data[i].children[j].children) {
                                    if (data[i].children[j].children[q].id === id) {
                                        flag = 3
                                        break
                                    }
                                }
                            }
                        }
                    }
                }
                return flag
            },
            /**
             * 获取子级层数
             * @param node 数据节点
             */
            getChildrenNum (node) {
                let num = 0
                if (node.children.length !== 0) {
                    num = 1
                    for (let i in node.children) {
                        if (node.children[i].children.length !== 0) {
                            num = 2
                            break
                        }
                    }
                }
                return num
            }
        }
    }
</script>

<style lang="scss" scoped>
    .el-tree {
        width: 420px;
    }

    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }

    .tree-item-btn-box {
        display: none;
    }

    .custom-tree-node:hover .tree-item-btn-box {
        display: inline-block;
    }

    .dialogform {
        padding-left: 30px;
        padding-right: 30px;
    }

    /deep/ .el-dialog__footer {
        text-align: center;
    }

    .btn {
        margin-top: 20px;
    }
</style>
