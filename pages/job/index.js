// pages/job/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTitle_int: 0,
    statusBarHeight: app.globalData.statusBarHeight,
    topList_arr: ['全部', 'IT', '设计', '美妆', '休闲', '学习'],
    itemList_arr: [{
      id: 1,
      headPic: '',
      title: '工作设计室',
      type: '学生店',
      zanUp: 34,
      zanDown: 18,
      tag: ['3年经验']
    }, {
      id: 2,
      headPic: '',
      title: '扭转乾坤小程序开发',
      type: '企业店',
      zanUp: 34,
      zanDown: 18,
      tag: ['案例极多', '3年极多']
    }, {
      id: 3,
      headPic: '',
      title: '工作设计室',
      type: '学生店',
      zanUp: 34,
      zanDown: 18,
      tag: ['案例极多']
    }]
  },

  titleTap_fun(e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      currentTitle_int: index
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