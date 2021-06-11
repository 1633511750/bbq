let app = getApp()
import { $http } from '../../utils/util'
import $street from '../../utils/businessStreet'
// pages/shop/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shop_arr: [],
    shopState_str: '店铺加载中...'
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
          if (this.data.shop_arr.length === 0) {
            this.setData({ shopState_str: '暂无店铺' })
          } else {
            this.setData({ shopState_str: '加载成功' })
          }
        }
      })
  },

  delete_fun(e) {
    wx.showModal({
      title: '删除提示',
      content: '是否永久删除该店铺？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if (result.confirm) {
          let id_int = e.currentTarget.dataset.id
          $street.deleteShop_fun(id_int, () => {
            wx.showToast({ title: '删除成功' })
            this.getShops_fun()
          })
        }
      },
      fail: () => { },
      complete: () => { }
    });

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