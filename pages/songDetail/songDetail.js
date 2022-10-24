//引入第三方包
import PubSub from 'pubsub-js'
import moment from 'moment'
import request from '../../utils/request'


//获取全局app实例
const appInstance = getApp()
// pages/songDetail/songDetail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //是否播放
        isPlay: true,
        //歌曲id
        sid: '',
        //歌曲信息
        songInfo: {},
        //音乐地址
        songUrl: '',
        //歌曲错误
        errMsg: '',
        //当前时间
        currentTime: '00:00',
        //总时间
        totalTime: '00:00',
        //进度条宽度比:
        width: '0%'
    },
    //更新播放状态处理函数
    updateIsPlay() {
        // //更新播放状态
        this.setData({
            isPlay: !this.data.isPlay
        })
        //调用方法控制播放和暂停
        this.musicControl()
    },
    //控制音乐播放和暂停的功能函数
    musicControl() {
        //创建音频实例
        //  let BackgroundAudioManager =wx.getBackgroundAudioManager()
        //判断播放还是暂停
        if (this.data.isPlay) {
            //播放音乐
            this.BackgroundAudioManager.src = this.data.songUrl
            //设置歌曲名称(必须)
            this.BackgroundAudioManager.title = this.data.songInfo.name
        } else {
            //暂停播放
            this.BackgroundAudioManager.pause()
        }
    },
    //获取音乐地址的方法
    async getSongUrl() {
        const { data: res } = await request('/song/url', { id: this.data.songInfo.id })
        // console.log(res)
        //如果歌曲地址为空
        if (!res.data[0].url) {
            return this.setData({
                errMsg: '暂无歌曲信息,无法播放!'
            })
        }
        this.setData({
            songUrl: res.data[0].url
        })
        //调用方法控制播放和暂停
        this.musicControl()
    },
    //切换歌曲事件处理函数
    switchHandle(e) {
        const type = e.currentTarget.dataset.type
        //调用方法订阅
        this.getPubSub(type)
    },
    //订阅消息获取数据的方法
    getPubSub(type) {
        //订阅消息
        PubSub.subscribe('songInfo', (msg, song) => {
            // console.log(song)
            //更新歌曲数据
            this.setData({
                songInfo: song,
                //格式化总时间
                totalTime: moment(song.dt).format("mm:ss")
            })
            //调用方法更新歌曲名
            this.updateSongName(song.name)
            //调用方法获取音乐地址
            this.getSongUrl()
            //取消这个订阅
            PubSub.unsubscribe('songInfo')
        })
        //发布消息
        PubSub.publishSync('switchType', type)
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        //接收参数歌曲id并更新
        let song = options.song
        if (!song) return
        //解码decodeURIComponent
        let songInfo = JSON.parse(decodeURIComponent(options.song))
        this.setData({
            songInfo: songInfo,
            //格式化总时间
            totalTime: moment(songInfo.dt).format("mm:ss")
        })
        //判断当前页面是否在播放
        if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === songInfo.id) {
            this.setData({
                isPlay: true
            })
        }
        //调用方法更新歌曲名
        this.updateSongName(songInfo.name)
        //创建音乐实例挂载到this上
        this.BackgroundAudioManager = wx.getBackgroundAudioManager()
        //调用方法获取音乐地址
        this.getSongUrl()
        //监听音乐的暂停和播放事件
        //监听播放
        this.BackgroundAudioManager.onPlay(() => {
            //修改播放状态
            this.changePlayState(true)
            //修改全局播放状态数据
            appInstance.globalData.musicId = songInfo.id
        })
        //监听暂停  修改播放状态
        this.BackgroundAudioManager.onPause(() => this.changePlayState(false))
        //监听停止播放
        this.BackgroundAudioManager.onStop(() => this.changePlayState(false))
        //监听音乐自然停止
        this.BackgroundAudioManager.onEnded(() => {
             //调用方法订阅
             this.getPubSub('next')
        })
        //监听音乐播放时长
        this.BackgroundAudioManager.onTimeUpdate(() => {
            let { currentTime, duration } = this.BackgroundAudioManager
            // console.log(currentTime)
            this.setData({
                currentTime: moment(currentTime * 1000).format("mm:ss"),
                width: (currentTime / duration) * 100 + '%',
            })
        })
    },
    //修改歌曲播放状态功能函数
    changePlayState(isPlay) {
        this.setData({
            isPlay
        })
        //修改全局播放状态的数据
        appInstance.globalData.isMusicPlay = isPlay
    },
    //更新歌曲名字函数
    updateSongName(songName) {
        wx.setNavigationBarTitle({
            title: '                          ' + songName
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