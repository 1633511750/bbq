let app = getApp()
import { $http } from '../../utils/util'
// pages/goodpublic/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id_int: 0,
    orgPrice_flo: '',
    nowPrice_flo: '',
    name_str: '',
    desc_str: ''
  },

  inputValue_fun(e) {
    let type_str = e.currentTarget.dataset.name
    if (type_str === 'orgPrice') {
      this.setData({
        orgPrice_flo: e.detail.value.slice(1)
      })
    } else if (type_str === 'nowPrice') {
      this.setData({
        nowPrice_flo: e.detail.value.slice(1)
      })
    } else if (type_str === 'name') {
      this.setData({
        name_str: e.detail.value
      })
    } else if (type_str === 'desc') {
      this.setData({
        desc_str: e.detail.value
      })
    }
  },

  // 提交商品审核
  submitGoods_fun() {
    console.log(this.data.id_int);
    if (this.data.orgPrice_flo.trim() === '' || this.data.nowPrice_flo.trim() === '' || this.data.name_str.trim() === '' || this.data.desc_str.trim() === '') {
      return wx.showToast({ title: '请填写完整相关信息', icon: 'none' })
    }
    let orgPrice_flo = this.data.orgPrice_flo - 0
    let nowPrice_flo = this.data.nowPrice_flo - 0
    if (Number.isNaN(orgPrice_flo) || Number.isNaN(nowPrice_flo)) {
      return wx.showToast({ title: '请输入合法的价格', icon: 'none' })
    }
    console.log(orgPrice_flo, this.data.desc_str.trim(), this.data.id_int);
    $http({
      isJson: true, method: 'post', url: '/businessStreet/addOrUpdateGoods', data: {
        shopId: this.data.id_int,
        business: 1,  // 1：上架中，0：待上架
        costPrice: orgPrice_flo,
        creater: app.globalData.uid_int,
        examined: 0,  // 0：未审核，1：已审核
        introductionText: this.data.desc_str.trim(),
        name: this.data.name_str.trim(),
        price: nowPrice_flo
      }
    }).then(res => {
      console.log(res);
      if (res.data.code === 200) {
        wx.showToast({ title: '提交审核成功' })

        setTimeout(() => {
          var pages = getCurrentPages()
          var curPage = pages[pages.length - 1]
          var url = curPage.route
          if (url === 'pages/goodpublic/index') {
            wx.navigateBack({
              delta: 1
            });
          }
        }, 1500);
      } else {
        wx.showToast({ title: '提交失败', icon: 'error' })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
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