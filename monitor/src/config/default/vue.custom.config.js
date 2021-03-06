/*
 * @Description: 
 * @Author: ZY
 * @Date: 2020-12-09 11:15:59
 * @LastEditors: ZY
 * @LastEditTime: 2021-03-15 10:50:45
 */
const vueDefaultConfig = {
    publicPath: '/',
    outputDir: 'dist',
    assetsDir: 'static',
    lintOnSave: true,
    transpileDependencies: ['vue-echarts', 'resize-detector'],
    //webpack 配置的项目名称
    title: 'monitor',
    titleSeparator: ' - ',
    titleReverse: false,
    devPort: '8888',
    abbreviation: 'vt2at',
    providePlugin: {},
    build7z: false,
    startMessage:'欢迎使用vue3-ts-composition-admin-template,使用composition API和TS 玩转最潮技术'
}

module.exports = vueDefaultConfig
  