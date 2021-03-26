// pages/jubao/index.js
const { $http } = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id_int: '',
    list_arr: ['广告软文', '内容不实', '政治谣言', '暴恐血腥', '诈骗', '色情', '违法犯罪及违禁品', '其他问题']
  },

  jubao_fun(e) {
    var con = e.currentTarget.dataset.con
    $http({ url: '/User/complain', method: 'post', data: { articleId: this.data.id_int, category: con, content: '' } })
      .then(res => {
        if (res.data.code === 200) {
          wx.showToast({
            title: '举报成功',
            icon: 'success'
          });
        } else {
          wx.showToast({
            title: '举报失败',
            icon: 'error'
          })
        }
        setTimeout(() => {
          var pages = getCurrentPages()
          var curPage = pages[pages.length - 1]
          var url = curPage.route
          if (url === 'pages/jubao/index') {
            wx.navigateBack({
              delta: 1
            });
          }
        }, 1500);
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id_int: options.id - 0
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