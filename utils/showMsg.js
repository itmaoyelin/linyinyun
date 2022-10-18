export default (title,icon='none')=>{
    wx.showToast({
        title,
        icon,
        duration: 1500
      })
}