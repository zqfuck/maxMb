/*
*Created by zq 2018/12/18
* */

import axios from 'axios'
// axios 配置
axios.defaults.timeout = 5000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
axios.defaults.baseURL = 'http://livetapi.v114.com'

//post请求
export function fetchPost (url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
//get请求
export function fetchGet (url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export default {
  /**
   * WAP首页内容列表 + 搜索
  */
  indexList (params) {
    return fetchPost('/webapi/company/content-index', params)
  },
 /**
  * 获取频道标题列表
  */
 titleList (params) {
   return fetchGet('/company/live/channellist',params)
 },
  /**
   * 获取频道内容列表
   */
  channelList (params) {
    return fetchGet('/appapi/wx/channellist',params)
  },
  /**
   * 轮播图+排行榜+热词+精彩推荐
   * */
  rankList (params) {
    return fetchGet('/webapi/banner/get-data',params)
  },
  /**
   *.全局搜索列表
   * */
  search (params) {
    return fetchGet('/appapi/wx/search',params)
  },
  /**
   *.详情页
   * */
  details (params) {
    return fetchGet('/webapi/company/contentdetails',params)
  },
  /**
   *.频道订阅获取验证码
   * */
  getCode (params) {
    return fetchGet('/appapi/bookchannel/sendcode',params)
  },
  /**
   *.添加频道订阅
   * */
  book_channel (params) {
    return fetchPost('/appapi/bookchannel/bookchannel',params)
  },
  /**
   *.点赞
   * */
  click_zan (params) {
    return fetchPost('/like',params)
  },
  /**
   *.预约短信验证码
   * */
  book_code (params) {
    return fetchGet('/appapi/wx/sendcode',params)
  },
  /**
   *.预约
   * */
  book (params) {
    return fetchGet('/appapi/wx/book',params)
  },
  /**
   *.密码鉴定
   * */
  check_pass (params) {
    return fetchGet('/appapi/wx/authorize',params)
  },
}


