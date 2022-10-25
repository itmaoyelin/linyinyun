//引入第三方包
import PubSub from 'pubsub-js'
import request from '../../../utils/request'
// pages/recommendSong/recommendSong.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        day: '', //日
        month: '', //月
        //滚动窗口可用高度
        wh: 0,
        //日常歌曲列表
        RecommendSongsList: [],
        //歌曲下标
        index:0
    },
    //更新日期方法
    updateDate() {
        this.setData({
            day: new Date().getDate(),
            month: new Date().getMonth() + 1,
        })
    },
    //设置窗口可用高度的方法
    setHeight() {
        this.setData({
            //获取当前系统信息 //获取窗口可用高度-导航和头部高度
            wh: wx.getSystemInfoSync().windowHeight - 190
        })
    },
    //获取每日推荐歌曲数据的方法
    async getRecommendSong() {
        //判断用户
        const { data: res } = await request('/recommend/songs')
        // console.log(res)
        this.setData({
            RecommendSongsList: res.data.dailySongs
        })
    },
    // 跳转到详情页
    gotoSongDeatil(e){
        // console.log(e)
        // 更新当前歌曲下标
        this.setData({
            index:e.currentTarget.dataset.index
        })
        let songInfo=JSON.stringify(e.currentTarget.dataset.song)
        wx.navigateTo({
          url: '/songPackage/pages/songDetail/songDetail?song='+encodeURIComponent(songInfo),
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        //调用方法更新时间
        this.updateDate()
        //设置窗口可用高度
        this.setHeight()
        //调用方法获取推荐歌曲数据
        this.getRecommendSong()
        //订阅消息
        PubSub.subscribe('switchType',(msg, type)=>{
            // console.log(msg,type)
            let index=this.data.index
            if(type==='pre'){
                index--
                index<0?index=this.data.RecommendSongsList.length-1:index 
            }else{
                index>=this.data.RecommendSongsList.length-1?index=0:index++
            }
            // console.log(index)
            //通过下标找到对应的歌曲信息
            let song=this.data.RecommendSongsList[index]
            //发消息
            PubSub.publishSync('songInfo',song)
            //更新下标
            this.setData({
                index
            })
        })

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