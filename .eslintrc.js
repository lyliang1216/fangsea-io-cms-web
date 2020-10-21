module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
      "ecmaVersion": 6, //指定ECMAScript支持的版本，6为ES6
      "sourceType": "module", //指定来源的类型，有两种”script”或”module”
      "ecmaFeatures": {
          "jsx": false//检测JSX
      },
    },
    env: {
        browser: true,
        node: true,
        commonjs: true,
        es6: true
    },
    extends: 'standard',
    // 此项是用来提供插件的，插件名称省略了eslint-plugin-，下面这个配置是用来规范html的
    plugins: [
        'html'
    ],

    // add your custom rules here
    //it is base on https://github.com/vuejs/eslint-config-vue
    rules: {
        // 缩进
        "indent": [
            "error",
            4
        ],
        // 使用es6语法定义变量
        "no-var": 2,
        // 定义过的变量必须使用
        'no-unused-vars': [
            'warn',
            {
                vars: 'all',
                args: 'none',
                caughtErrors: 'none',
                ignoreRestSiblings: true
            }
        ],
    },
    globals: {}
}

