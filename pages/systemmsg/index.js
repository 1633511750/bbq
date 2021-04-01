// pages/systemmsg/index.js
const { $http, myTime } = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg_arr: []
  },

  getMsg() {
    $http({
      hasLimit: true, url: '/PrivateLetter/readPrivateLetters', method: 'get', data: {
      }
    })
      .then(res => {
        var list_arr = res.data.data.privateLetterList
        list_arr.forEach(item => {
          var t_o = myTime(item.createTime)
          item.date_str = t_o.year + '-' + t_o.month + '-' + t_o.day
        })
        this.setData({
          msg_arr: list_arr
        })
        console.log(this.data.msg_arr);
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMsg()
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