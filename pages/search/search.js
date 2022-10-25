import request from '../../utils/request'
// pages/search/search.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        placeholder: '大家都在搜',
        hotList: [], //热搜列表
        inputValue: '', //输入框的值
        searchList: [],  //搜索列表
        historyList: JSON.parse(wx.getStorageSync('history') || '[]'), //历史列表
    },
    // 获取默认关键字方法
    async getPlaceholder() {
        const { data: res } = await request('/search/default')
        // console.log(res)
        this.setData({
            placeholder: res.data.showKeyword
        })

    },
    //获取热搜列表
    async getHotList() {
        const { data: res } = await request('/search/hot/detail')
        // console.log(res)
        this.setData({
            hotList: res.data
        })
    },
    //获取搜索列表数据方法
    async getSearchList() {
        if (!this.data.inputValue) {
            return this.setData({
                searchList: []
            })
        }
        const { data: res } = await request('/search', { keywords: this.data.inputValue, limit: 10 })
        let { historyList, inputValue } = this.data
        //清除已存在的记录
        let newHistory = historyList.filter(x => x !== inputValue && x !== '').slice(0, 9)
        if(!inputValue) return
        //重新添加新的记录
        let history = [this.data.inputValue, ...newHistory]
        //存入本地
        let historyString = JSON.stringify(history)
        wx.setStorageSync('history', historyString)
        // 更新数据
        this.setData({
            searchList: res.result.songs,
            historyList: history
        })

    },
    //input输入框事件处理函数
    getInput(e) {
        //清除延时器
        clearTimeout(this.timer)
        //开启一个延时器
        this.timer = setTimeout(() => {
            this.setData({
                inputValue: e.detail.value.trim()
            })
            this.getSearchList()
        },300)
    },
    //获取热搜名字
    getHotName(e) {
        // console.log(e)
        this.setData({
            inputValue: e.currentTarget.dataset.name
        })
        this.getSearchList()
    },
    //取消事件处理函数
    cancel() {
        this.setData({
            inputValue: ''
        })
    },
    //删除历史记录
    historyDelete() {
        //调用方法清除历史记录 
        this.tipDelete()
    },
    //提示删除方法
    async tipDelete() {
        const res = await wx.showModal({
            title: '提示',
            content: '确定要删除历史记录吗?',
        })
        if (res.confirm) {
            this.setData({
                historyList: []
            })
            //清除本地历史记录
            //wx.setStorageSync('history', '')
            //移除本地历史记录
            wx.removeStorageSync('history')
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        //调用方法获取默认关键字
        this.getPlaceholder(),
            //调用方法获取热搜列表
            this.getHotList()
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