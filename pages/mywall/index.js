// pages/mywall/index.js
const { $http, myTime } = require('../../utils/util')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasArtical_bool: true,
    commentList_arr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // $http({ url: '/Article/getDianzanCountByArticId', data: { articleId: 4 } })
    //   .then(res => {
    //     console.log(res);
    //   })
  },

  getAllMyArtical_fun() {
    $http({ url: '/Article/getArticlesByFromUid' })
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          var list_arr = res.data.data.articleList.reverse()
          list_arr.forEach((item) => {
            var t_o = myTime(item.createTime)
            item.date_str = t_o.month + '-' + t_o.day
            item.time_str = t_o.hour + ':' + t_o.minute

            item.commentListNum_int = item.commentList.length

            if (item.dianzanUids) {
              item.dianzanNum_int = item.dianzanUids.split(',').length
            } else {
              item.dianzanNum_int = 0
            }

            if (item.isAnonymous) {
              item.name_str = '匿名'
              item.avatarUrl_str = app.globalData.anonymousAvatarUrl_str
            } else {
              item.name_str = app.globalData.nickName_str
              item.avatarUrl_str = app.globalData.avatarUrl_str
            }
          })
          this.setData({
            commentList_arr: list_arr,
            hasArtical_bool: true
          })
        } else if (res.data.code === 205) {
          // wx.showToast({ title: '帖子为空' });
          this.setData({
            hasArtical_bool: false
          })
        } else {
          wx.showToast({
            title: '获取失败',
            icon: 'error',
          });
        }
      })
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
    this.getAllMyArtical_fun()
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