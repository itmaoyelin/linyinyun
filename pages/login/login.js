
// pages/login/login.js
//导入showMsg方法
import showMsg from '../../utils/showMsg'
//导入发送请求的方法
import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        phone:'', //手机号
        password:''  //用户密码
    },
    //获取输入框数据处理函数
    handleInput(e){
        //获取到输入框的名字
        const type=e.currentTarget.dataset.type
        // console.log(type)
        this.setData({
            [type]:e.detail.value //设置输入框的值
        })
    },
    //登录处理函数
    async login(){
        // console.log('ok')
        let {phone,password}=this.data
        //前端验证
        //检查手机号
        if(!phone) return showMsg('手机号不能为空!')
        //定义正则表达式
        let phoneReg=/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
        if(!phoneReg.test(phone)) return showMsg('手机号不合法,请重新输入！')
        //检查密码
        if(!password) return showMsg('密码不能为空!','error')
        //定义正则表达式
        // let passwordReg=/^[a-zA-Z]\w{5,17}$/
        let passwordReg=/^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9]{8,10}$/  //字母数字组合
        if(!passwordReg.test(password)) return showMsg('密码不合法,请重新输入!') 
        showMsg('前端验证通过,请稍等!')
        //后端验证
       const {data:res}=await request('/login/cellphone',{phone:this.data.phone,password:this.data.password})
       console.log(res)
       if(res.code===200){
           showMsg('登录成功!')
           const userInfo={
               nickname:res.profile.nickname,
               avatarUrl:res.profile.avatarUrl,
               backgroundUrl:res.profile.backgroundUrl,
               token:res.token,
               userId:res.profile.userId
            }
            //将用户信息存储到本地
           wx.setStorageSync('userInfo', JSON.stringify(userInfo))
           wx.switchTab({
             url: '/pages/personal/personal',
           })
       }else if(res.code===502){
           showMsg('账号或密码错误!','error')
       }else if(res.code===509){
           showMsg('密码错误超过限制')
       }else{
           showMsg('登录失败！请重新登录~')
       }
    },
    
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})