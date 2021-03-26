// pages/mywall/index.js
const { $http } = require('../../utils/util')
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
            var temp_arr = item.createTime.split('T')
            var t = temp_arr[0].split('-')
            item.date_str = t[1] + '-' + t[2]

            t = temp_arr[1].split(':')
            item.time_str = t[0] + ':' + t[1]

            item.commentListNum_int = item.commentList.length

            if (item.dianzanUids) {
              item.dianzanNum_int = item.dianzanUids.split(',').length
            } else {
              item.dianzanNum_int = 0
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