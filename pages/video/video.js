
import request from "../../utils/request"
// pages/video/video.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //导航列表数据
        navList: [],
        //唯一标识
        navId: '',
        //视频列表数据
        videoList: [],
        //视频地址列表
        videoUrl: [],
        //滚动窗口可用高度
        // wh:0,
        //视频标识Id
        videoId: 0,
        //记录video播放的时长
        videoUpdatetTime: [],
        //触发状态
        isTriggered:false
    },

    //获取视频导航列表标签数据的方法
    async getNavList() {
        const { data: res } = await request('/video/group/list')
        // console.log(res.data)
        this.setData({
            // navList:res.data.slice(0,14),
            navList: res.data.filter(item => item.name !== '万有引力').filter(item => item.name !== 'MV').slice(0, 14),
            //将第一项id赋值给navId
            navId: res.data[0].id
        })
        //调用方法获取视频数据
        this.getVideoList()
    },
    //获取视频数据的方法
    async getVideoList() {
        const { data: res } = await request('/video/group', { id: this.data.navId })
        // console.log(res)
        //循环调用
        res.datas.forEach((item) => {
            this.getVideoUrl(item.data.vid, item.data.coverUrl)
        })
        this.setData({
            videoList: res.datas,
            isTriggered:false //关闭下拉刷新
        })
        //关闭加载框
        wx.hideLoading()
    },

    //获取视频播放地址
    async getVideoUrl(id, cover) {
        const { data: res } = await request('/video/url', { id })
        res.urls[0].cover = cover
        // console.log(res.urls)
        this.setData({
            videoUrl: [...this.data.videoUrl, ...res.urls]
        })
    },
    // 点击播放/继续播放视频处理函数
    playHandle(e) {
        //关闭上一个视频的实例 (同一个视频不关闭)
        // this.id!==e.currentTarget.id&&this.VideoContext && this.VideoContext.stop()
        // this.id=e.currentTarget.id
        //更新视频Id
        this.setData({
            videoId: e.currentTarget.id
        })
        //创建控制video标签的实例对象
        this.VideoContext = wx.createVideoContext(e.currentTarget.id)
        let videoItem = this.data.videoUpdatetTime.find(item => item.vid === e.currentTarget.id)
        // if(videoItem){
        //     this.VideoContext.seek(videoItem.time)
        // }
        //跳转到上次播放时间位置
        videoItem && this.VideoContext.seek(videoItem.time)
    },
    //视频播放结束事件处理函数
    endedHandle(e) {
        // console.log(e)
        //更新播放记录
        this.setData({
            videoUpdatetTime: this.data.videoUpdatetTime.filter(item => item.vid !== e.target.id)
        })
    },
    //更新播放时间处理函数
    UpdateTimeHandle(e) {
        // console.log(e)
        let videoTimeObj = {
            vid: e.currentTarget.id,
            time: e.detail.currentTime
        }
        let { videoUpdatetTime } = this.data
        let videoItem = videoUpdatetTime.find(item => item.vid === videoTimeObj.vid)
        if (videoItem) {
            videoItem.time = videoTimeObj.time
        } else {
            videoUpdatetTime.push(videoTimeObj)
        }
        //更新时间
        this.setData({
            videoUpdatetTime,
        })
    },
    // 下拉刷新事件处理函数
    refreshHandle(){
        // console.log('oK')
        //清空视频地址列表数据
        this.setData({
            videoUrl:[],
            isTriggered:true //开启下拉刷新
        })
        //获取视频列表数据
        this.getVideoList()
      
    },
    //上拉触底处理函数
    tolowerHandler(){
    //   console.log('Ok')
    },
    //更新选中状态
    updateActive(e) {
        this.setData({
            //转成number
            navId: e.target.id - 0,
            videoUrl: []
        })
        //显示加载。。
        wx.showLoading({
            title: '正在加载中...',
            mask: true
        })
        this.getVideoList()

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        //调用方法获取导航列表数据
        this.getNavList()
        //把当前窗口可用高度赋值
        //  this.setData({
        //       //获取当前系统信息 //获取窗口可用高度-导航和头部高度
        //      wh:wx.getSystemInfoSync().windowHeight-90
        //  })
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
    onShareAppMessage({from}) {
        console.log(from)
        //自定义转发的内容
        // return{
        //     title:'女神来啦',
        //     path:'/pages/index/index',
        //     imageUrl:'../../static/images/nvsheng.jpg'
        // }
    }
})