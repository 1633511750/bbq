let app = getApp()
import { $http } from '../../utils/util'
// pages/goods/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id_int: 0,
    goods_arr: [],
    goodsStateIndex_int: 0,
  },

  goodsStateIndex_fun(e) {
    let index_int = e.currentTarget.dataset.index - 0
    this.setData({
      goodsStateIndex_int: index_int
    })
    this.getGoods_fun(this.data.id_int)
  },

  // 获取商品
  getGoods_fun(shopId) {
    if (this.data.goodsStateIndex_int === 0) {
      $http({
        isJson: true, method: 'post', url: '/businessStreet/getGoods', data: {
          pageNum: 1, pageSize: 10, streetGoods: { shopId, creater: app.globalData.uid_int, examined: '1', business: '1' }
        }
      }).then(res => {
        console.log(res);
        if (res.data.code === 200) {
          this.setData({
            goods_arr: res.data.data.streetGoods
          })
        } else {
          wx.showToast({ title: '获取商品失败', icon: 'error' })
        }
      }).catch(err => {
        console.log(err);
      })
    } else if (this.data.goodsStateIndex_int === 1) {
      $http({
        isJson: true, method: 'post', url: '/businessStreet/getGoods', data: {
          pageNum: 1, pageSize: 10, streetGoods: { shopId, creater: app.globalData.uid_int, business: '0' }
        }
      }).then(res => {
        console.log(res);
        if (res.data.code === 200) {
          this.setData({
            goods_arr: res.data.data.streetGoods
          })
        } else {
          wx.showToast({ title: '获取商品失败', icon: 'error' })
        }
      }).catch(err => {
        console.log(err);
      })
    } else if (this.data.goodsStateIndex_int === 2) {
      $http({
        isJson: true, method: 'post', url: '/businessStreet/getGoods', data: {
          pageNum: 1, pageSize: 10, streetGoods: { shopId, creater: app.globalData.uid_int, examined: '0' }
        }
      }).then(res => {
        console.log(res);
        if (res.data.code === 200) {
          this.setData({
            goods_arr: res.data.data.streetGoods
          })
        } else {
          wx.showToast({ title: '获取商品失败', icon: 'error' })
        }
      }).catch(err => {
        console.log(err);
      })
    }
  },

  // 下架商品
  ofShelf_fun() {

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
    this.getGoods_fun(this.data.id_int)
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