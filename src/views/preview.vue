<template>
    <section class="container">
        <div class="imghead">
            <img ref="previewHeader" src="/static/preview_images/preview_header.jpg">
        </div>
        <div class="preview-content">
            <div class="title">
                <span>{{title}}</span>
            </div>
            <div class="time">
                <span>发布时间：{{time}}</span>
            </div>
            <div class="content" v-html="content"></div>
            <div class="img-box attachment">
                <div class="img-box-item" v-for="item in attachment">
                    <p>{{item | namerole}}</p>
                    <img src="/static/preview_images/downicon.jpg" alt="">
                </div>
            </div>
            <div class="img-box attachment-login">
                <div class="pop-login" v-if="attachmentLogin.length !== 0">
                    <p><span>登录</span>后可查看文件</p>
                </div>
                <div class="img-box-item" v-for="item in attachmentLogin">
                    <p>{{item | namerole}}</p>
                    <img src="/static/preview_images/downicon.jpg" alt="">
                </div>
            </div>
        </div>
        <div class="imgfooter">
            <img ref="previewFooter" src="/static/preview_images/preview_footer.jpg">
        </div>
    </section>
</template>

<script>
    export default {
        name: 'preview',
        data () {
            return {
                // 标题
                title: '',
                // 正文
                content: '',
                // 发布时间
                time: '',
                checkList: [],
                files: [],
                attachment: [],
                attachmentLogin: []
            }
        },
        created () {
            if (localStorage.getItem('previewContent')) {
                let data = JSON.parse(localStorage.getItem('previewContent'))
                this.title = data.title
                this.content = data.content
                if (data.time === null) {
                    this.time = this.getZoneTime(parseInt(new Date() / 1000)).substring(0, 16)
                } else {
                    this.time = data.time.substring(0, 16)
                }
                this.checkList = data.check
                this.files = data.files
                this.getLoginFile()
            }
        },
        methods: {
            /**
             * 获取需要登录的文件
             */
            getLoginFile () {
                for (let i in this.files) {
                    if (this.checkList.includes(this.files[i].fileId)) {
                        this.attachment.push(this.files[i].name)
                    } else {
                        this.attachmentLogin.push(this.files[i].name)
                    }
                }
            }
        },
        filters: {
            namerole (val) {
                return val.substring(0, val.lastIndexOf('.'))
            }
        }
    }
</script>

<style scoped lang="scss">
    * {
        font-family: "Ping Fang SC", "Microsoft YaHei", "Noto", "Hiragino Sans GB", "San Francisco", "Arial", "Roboto", "Segoe UI", "Segoe UI Emoji", "Segoe UI Symbol" !important;
    }

    .container {
        width: 100%;
        min-width: 1200px;
        overflow-x: hidden;
        position: relative;
        .imghead {
            height: 140px;
        }
        .imgfooter {
            height: 249px;
        }
        .imghead img, .imgfooter img {
            position: absolute;
            left: 50%;
            transform: translate(-50%, 0);
        }
    }

    .preview-content {
        width: 872px;
        margin: 0 auto;
        .title {
            font-size: 24px;
            color: #333;
            text-align: center;
            line-height: 33px;
            margin-bottom: 16px;
        }
        .time {
            font-size: 14px;
            line-height: 20px;
            color: #999;
            text-align: center;
            padding-bottom: 16px;
            border-bottom: 1px solid #f1f1f1;
            margin-bottom: 24px;
        }
        .content {
            width: 840px;
            margin: 0 auto 36px;
            img {
                max-width: 100%;
            }
            table p {
                margin-bottom: 0 !important;
                margin-top: 0 !important;
            }
        }
        .img-box {
            width: 840px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            .img-box-item {
                width: 380px;
                height: 48px;
                padding: 0 30px;
                box-sizing: border-box;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border: 1px solid #d9d9d9;
                border-radius: 24px;
                margin-bottom: 16px;
                cursor: pointer;
                p {
                    font-size: 14px;
                    color: #333;
                    margin: 0;
                    width: 282px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                img {
                    display: block;
                    width: 26px;
                }
            }
        }
        .attachment-login {
            position: relative;
            margin-bottom: 16px;
            .pop-login {
                position: absolute;
                width: 840px;
                height: 100%;
                left: 0;
                top: -8px;
                background: rgba(0, 0, 0, 0.3);
                color: #fff;
                font-size: 24px;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                p {
                    span {
                        text-decoration: underline;
                    }
                }
            }
        }
    }
</style>
