let app = getApp()
import { $http } from '../../utils/util'
// pages/shop/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shop_arr: []
  },

  getShops_fun() {
    $http({
      isJson: true, url: '/businessStreet/getShops', method: 'post', data: {
        pageNum: 1, pageSize: 20, streetShop: { creater: app.globalData.uid_int }
      }
    })
      .then(res => {
        console.log(res);
        if (res.data.code === 200) {
          res.data.data.streetShops.forEach(item => {
            if (item.headSculpture && item.headSculptureName) {
              item.headPic_str = app.globalData.baseUrl + item.headSculpture.slice(25) + '/' + item.headSculptureName
            }
          })
          this.setData({
            shop_arr: res.data.data.streetShops
          })
          console.log(this.data.shop_arr);
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
    this.getShops_fun()
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