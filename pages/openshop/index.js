import { $http } from '../../utils/util'
let app = getApp()
// pages/shopsetting/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isModify_bool: false,
    shopName_str: '',
    tag_str: '',
    category_str: '',
    address_str: '',
    phone_str: '',
    wechat_str: '',
    qq_str: '',
    desc_str: ''
  },

  input_fun(e) {
    let value = e.currentTarget.dataset.value
    this.setData({
      [value]: e.detail.value
    })
  },

  // 开店请求
  setting_fun() {
    if (this.data.shopName_str.trim() === '' || this.data.category_str.trim() === '' || this.data.address_str.trim() === '' || this.data.phone_str.trim() === '' || this.data.wechat_str.trim() === '' || this.data.qq_str.trim() === '' || this.data.desc_str.trim() === '') {
      return wx.showToast({ title: '请填写完整信息后再提交', icon: 'none' })
    }

    $http({
      isJson: true, url: '/businessStreet/addOrUpdateShop', method: 'post', data: {
        address: this.data.address_str,
        business: 0,
        category: this.data.category_str,
        creater: app.globalData.uid_int,
        examined: 0,
        introduction: this.data.desc_str,
        label: this.data.tag_str,
        name: this.data.shopName_str,
        phone: this.data.phone_str,
        qq: this.data.qq_str,
        wechat: this.data.wechat_str
      }
    }).then(res => {
      console.log(res);
      if (res.data.code === 200) {
        wx.showToast({ title: '开店提交成功，审核中', icon: 'none' })
        setTimeout(() => {
          var pages = getCurrentPages()
          var curPage = pages[pages.length - 1]
          var url = curPage.route
          if (url === 'pages/openshop/index') {
            wx.navigateTo({
              url: '/pages/shop/index',
            });
          }
        }, 1500);
      } else {
        wx.showToast({ title: '开店提交失败', icon: 'error' })
      }
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