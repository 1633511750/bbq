import { $http } from '../../utils/util'
// pages/logodesign/index.js
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

  // 获取商品
  getGoods_fun() {
    $http({
      isJson: true, method: 'post', url: '/businessStreet/getGoods', data: {
        pageNum: 1, pageSize: 10, streetGoods: { id: this.data.id_int, business: '1', examined: '1' }
      }
    }).then(res => {
      console.log(res);
      if (res.data.code === 200) {
        let obj = res.data.data.streetGoods[0]
        this.setData({
          orgPrice_flo: obj.costPrice,
          nowPrice_flo: obj.price,
          name_str: obj.name,
          desc_str: obj.introductionText
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id_int: options.id - 0
    })
    console.log(this.data.id_int);
    this.getGoods_fun()
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