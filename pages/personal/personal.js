// pages/personal/personal.js
//导入发送请求的方法
import request from '../../utils/request'

let startY=0 //开始的距离
let moveY=0 //移动后的距离
let moveDistance
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //移动距离
        transform:'translateY(0)',
        //缓慢移动
        transition:'',
        //用户信息
        userInfo:{},
        //播放记录列表
        recentPlayList:[]
    },
    //登录事件处理函数
    gotoLogin(){
        if(this.data.userInfo.token) return
        wx.navigateTo({
          url: '/pages/login/login',
        })
      
    },
    //退出登录
   async logout(){
     if(!this.data.userInfo.token) return 
      const res= await wx.showModal({
            text:'提示',
            content:'确定要退出登录吗?'
        })
        if(!res.confirm) return
        //清空本地存储
        wx.setStorageSync('userInfo', '')
        this.updateUserInfo()
        //跳回登录页面
        wx.navigateTo({
          url: '/pages/login/login',
        })
    },
    //更新userInfo数据
    updateUserInfo(){
        this.setData({
            userInfo:JSON.parse(wx.getStorageSync('userInfo')||'{}')
        })
    },
    //获取用户的播放记录方法
   async getPlayList(){
       if(!this.data.userInfo.token) return 
        const {data:res}=await request('/user/record',{uid:this.data.userInfo.userId,type:0})
        // console.log(res)
        this.setData({
            recentPlayList:res.allData
        })
    },
    handleTouchStart(e){
        // console.log('start' ,e)
        startY=e.touches[0].clientY
        this.setData({
            transition:''
        })
    },
    handleTouchMove(e){
        // console.log('move')
        moveY=e.touches[0].clientY
        moveDistance=moveY-startY
        if(moveDistance<=0) return  //不移动
        if(moveDistance>=80){
            moveDistance=80
        }
        // console.log(moveDistance)
        //开始移动
        this.setData({
            transform:`translateY(${moveDistance}rpx)`
        })
        
    },
    handleTouchEnd(){
        //移动结束，开始复原
        this.setData({
            transform:`translateY(0)`,
            // 1秒平滑过渡
            transition:`transform 1s linear`
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        //调用方法更新userInfo数据
        this.updateUserInfo()
        //调用方法获取用户播放记录
        this.getPlayList()
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
     //调用方法更新userInfo数据
    this.updateUserInfo()
     //调用方法获取用户播放记录
     this.getPlayList()
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