//该文件会在package.json的dependencies中的 "react-app-rewired"运行时被执行
const {override, fixBabelImports,addLessLoader} = require('customize-cra'); //该配置文件一共实现 按需加载和自定义主题两个目标

//针对antd实现按需打包：根据import进来的东西来打包(就是引入指定文件)
module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: 'true', //自动打包相关的样式，去处理源码，就是处理less而不是css
    }),

    //使用Less-Loader对源码中的Less的变量进行重新指定
    addLessLoader({
        javascriptEnable: true,
        modifyVars: {
            '@primary-color': '#1DA57A',
            '@link-color': '#1DA57A',
            '@border-radius-base': '2px'
        }, //less写法，可以再这儿改变主题颜色
    })
);