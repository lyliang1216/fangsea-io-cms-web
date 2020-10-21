<template>
    <section class="container container-computer">
        <img ref="errorimg" src="/static/404_images/error_img.png" alt="404" :style="style">
        <div class="error-word">
            <h2>404出错啦...</h2>
            <p>{{time}}秒后自动返回登录</p>
            <button @click="backlogin">返回登录</button>
        </div>
    </section>
</template>

<script>
    import store from '../store'
    import Cookie from 'js-cookie'

    export default {
        name: 'Page404',
        data () {
            return {
                time: 5,
                style: {
                    width: document.body.offsetWidth + 'px',
                    height: document.body.offsetHeight + 'px'
                }
            }
        },
        mounted () {
            let _this = this
            let setIntervalCD = setInterval(function () {
                if (_this.time !== 0) {
                    _this.time--
                } else {
                    window.clearInterval(setIntervalCD)
                    _this.backlogin()
                }
            }, 1000)
        },
        methods: {
            backlogin () {
                Cookie.set('initlogout', 'toindex')
                store.dispatch('user/logout').then(() => {
                    location.reload()
                })
                localStorage.removeItem('roles')
                window.location.href = '/login'
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .container-computer {
        position: relative;
        img {
            display: block;
        }
        .error-word {
            position: absolute;
            left: 12%;
            top: 36%;
            h2 {
                font-size: 24px;
                color: #333;
                margin: 0;
                font-weight: normal;
            }
            p {
                font-size: 15px;
                color: #666;
                margin-bottom: 15px;
            }
            button {
                display: block;
                width: 100px;
                height: 38px;
                line-height: 38px;
                color: #fff;
                font-size: 15px;
                background: #2EA9DF;
                border-radius: 19px;
                margin: 0;
                padding: 0;
                border: 0;
                outline: none;
                cursor: pointer;
                text-align: center;
            }
        }
    }
</style>
