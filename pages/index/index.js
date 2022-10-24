// pages/index/index.js
//导入request 发送请求
import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //轮播图数据
        swiperList: [],
        //推荐歌单数据列表
        recommendMusicList:[],
        //排行榜数据列表
        rankingList:[]
    },

    //获取轮播图数据方法
    async getSwiper() {
        const {data:res} = await request('/banner',{type:1})
        // console.log(res)
        this.setData({
            swiperList:res.banners
        })
    },
    //获取推荐歌单数据方法
    async getRecommendMusic() {
        const {data:res} = await request('/personalized',{limit:10})
        // console.log(res.result)
        this.setData({
            recommendMusicList:res.result
        })
        
    },
    //获取排行榜数据的方法
    async getRankingList(){
        let index=0
        while(index<5){
            let {data:res}=await request('/top/list',{idx:index++})
            // console.log(res)
            //重组对象
            let rankingItem={name:res.playlist.name,tracks:res.playlist.tracks.slice(0,3)}
            // 更新排行榜列表数据
            this.setData({
                rankingList:[...this.data.rankingList,rankingItem]
            })
        }  
    },
    //获取新的排行榜数据的方法
    async getTopList(){
        const {data:res}=await request('/toplist/detail')
        // console.log(res) 
        //更新排行榜列表数据
        this.setData({
            rankingList:res.list.slice(0,4)
        })
    },
    //跳转到每日推荐页
    gotoRecommend(){
        wx.navigateTo({
          url: '/pages/recommendSong/recommendSong',
        })
    },
    // 跳转到详情页
    gotoSongDeatil(e){
        // console.log(e)
        let songInfo=JSON.stringify(e.currentTarget.dataset.song)
        wx.navigateTo({
          url: '/pages/songDetail/songDetail?song='+encodeURIComponent(songInfo),
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        //调用方法获取轮播图数据
        this.getSwiper()
        //调用方法获取推荐歌单数据
        this.getRecommendMusic()
        //调用方法获取排行榜数据列表
        // this.getTopList()
        this.getRankingList()
        
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