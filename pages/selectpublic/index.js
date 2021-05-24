// pages/selectpublic/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeList_arr: ['表白', '找对象', '感情', '找同伴', '捞人', '', '游戏', '靓仔日常', '爱豆', '有偿求助', '失物招领', '二手交易', '吐槽', '曝光', '', '其他', '问答'],
    tagBg_arr: ['#C962E3', '#C962E3', '#C962E3', '#C962E3', '#C962E3', '#C962E3', '#00B4FF', '#00B4FF', '#00B4FF', '#FFCD1D', '#FFCD1D', '#FFCD1D', '#FF3434', '#FF3434', '#FF3434', '#3DC795', '#3DC795']
  },

  // 点击了标签
  publish_fun(e) {
    const { item } = e.currentTarget.dataset
    if (item === '') {
      return
    }
    this.setData({
      showDialog_bool: false
    })
    wx.redirectTo({
      url: '/pages/publish/index?category=' + item + '&isNM=' + this.data.isAnonymous_bool
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})