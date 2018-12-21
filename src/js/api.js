/*
*Created by zq 2018/12/18
* */

import axios from 'axios'
// axios 配置
axios.defaults.timeout = 3000
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

}


