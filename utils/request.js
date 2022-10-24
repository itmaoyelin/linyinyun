//发送ajax
//封装函数
//导入服务器主机地址
import config from './config'

export default (urlParams, data = {}, method = 'get') => {
  //返回一个promise实例对象 状态为pending
  return new Promise((resolve,resject) => {
    wx.request({
      url:config.mobleHost + urlParams,
    //   url:config.netHost + urlParams,
      data, //参数对象
      header:{
        //需要新用户登录 才能拿到cookie
        // cookie:wx.getStorageSync('cookie')?wx.getStorageSync('cookie'):'',
        //用户没登录写死一个cookie  可以免登录
        cookie:wx.getStorageSync('cookie')?wx.getStorageSync('cookie'):' MUSIC_U=2c91d0a1ead6bc978e4dfd5549f46c2ef810f885afa543e348aa46554bff90b3519e07624a9f00536877dc0026bb5c706ae1bebbe2f9d8d19753e87d89882c78ab407d1b3442349f7a561ba977ae766d; Max-Age=1296000; Expires=Wed, 02 Nov 2022 12:08:47 GMT; Path=/',
      },
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