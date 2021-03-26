// pages/zhuti/index.js
const { $http } = require('../../utils/util')
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    colorValue_arr: [
      { id: 1, name: '豆沙绿', value: '#999933' },
      { id: 2, name: '魅力紫', value: '#CC99CC' },
      { id: 3, name: '青春橙', value: '#FFCC99' },
      { id: 4, name: '活力橙', value: '#FF7E17' },
      { id: 5, name: '商务灰', value: '#797979' },
      { id: 6, name: '高端蓝', value: '#5E838C' }
    ],
  },

  // 切换主题颜色
  changeColor_fun(e) {
    var color_str = e.currentTarget.dataset.color
    app.globalData.bgColor_str = color_str
    wx.setStorageSync('bgColor', color_str)
    this.setData({
      bgColor_str: color_str
    })
    wx.setNavigationBarColor({ "frontColor": '#ffffff', 'backgroundColor': color_str })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.getColor_fun(this)
    // $http({ url: '/User/backgroundColorChanged', method: 'post', data: { backgroundColor: 'red' } })
    //   .then(res => {
    //     console.log(res);
    //     if (res.data.code === 200) {
    //       wx.showToast({
    //         title: '更改主题成功',
    //       });
    //     } else {
    //       wx.showToast({ title: '更改失败', icon: 'error' })
    //     }
    //   })
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