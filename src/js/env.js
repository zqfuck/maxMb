/**
 * 配置编译环境和线上环境之间的切换
 * 
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * baseImgPath: 图片存放地址
 * 
 */

let baseUrl = '';
let routerMode = 'hash';

if (process.env.NODE_ENV == 'development') {
    baseUrl = '/api'
} else if (process.env.NODE_ENV == 'testing') {
    baseUrl = 'http://livetapi.v114.com'
} else {
    baseUrl = 'http://liveapi.v114.com'
}
export { baseUrl }