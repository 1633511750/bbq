// pages/aite/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnText_str: '搜索',
    list_arr: [{
      id: 1,
      name: 'hello',
      headPic: 'https://i04piccdn.sogoucdn.com/0e3e409f0cf25fb3'
    }, {
      id: 2,
      name: 'abc',
      headPic: 'https://i04piccdn.sogoucdn.com/0e3e409f0cf25fb3'
    }, {
      id: 3,
      name: '333',
      headPic: 'https://i04piccdn.sogoucdn.com/0e3e409f0cf25fb3'
    }, {
      id: 4,
      name: 'ack',
      headPic: 'https://i04piccdn.sogoucdn.com/0e3e409f0cf25fb3'
    }, {
      id: 5,
      name: 'xxx',
      headPic: 'https://i04piccdn.sogoucdn.com/0e3e409f0cf25fb3'
    }],
    retList_arr: [],
    isSearch: true
  },

  selectFriends_fun(arg) {
    this.setData({
      btnText_str: '确认',
      retList_arr: arg.detail.value,
      isSearch: false
    })
  },

  tap_fun() {
    if (this.data.isSearch) {

    } else {
      // var name = arg.currentTarget.dataset.name
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];  //上一个页面
      //不需要页面更新
      prevPage.setData({
        friendsName_arr: this.data.retList_arr
      })
      wx.navigateBack({
        delta: 1
      });
    }
  },

  changeText_fun() {
    this.setData({
      btnText_str: '搜索',
      isSearch: true
    })
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