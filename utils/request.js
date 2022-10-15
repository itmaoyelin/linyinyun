//发送ajax
//封装函数
//导入服务器主机地址
import config from './config'

export default (urlParams, data = {}, method = 'get') => {
  //返回一个promise实例对象 状态为pending
  return new Promise((resolve,resject) => {
    wx.request({
      url:config.mobleHost + urlParams,
      data, //参数对象
      method,
      success: (res) => {
          // console.log(res)
          resolve(res) //向外传出成功的数据
      },
      fail: (err) => {
          // console.log(err)
          resject(err) //向外传出失败的数据
      }
  })
       })
}